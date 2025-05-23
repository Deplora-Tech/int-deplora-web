"use client";

import { useRef, useEffect, useState, ReactNode, KeyboardEvent } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
  closeOnClickOutside?: boolean;
  selectorAttribute?: string;
  focusFirstItemOnOpen?: boolean;
  id?: string;
}

export function Dropdown({
  trigger,
  children,
  className = "",
  onOpenChange,
  isOpen: controlledIsOpen,
  closeOnClickOutside = true,
  selectorAttribute,
  focusFirstItemOnOpen = false,
  id,
}: DropdownProps) {
  // Use controlled state if provided, otherwise use internal state
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(value);
    }
    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle toggle
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    // Close on Escape
    if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
    // Toggle on Enter or Space
    if ((e.key === "Enter" || e.key === " ") && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  // Focus first interactive element when menu opens
  useEffect(() => {
    if (isOpen && focusFirstItemOnOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen, focusFirstItemOnOpen]);

  // Handle outside clicks
  useEffect(() => {
    if (!closeOnClickOutside) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        (selectorAttribute
          ? !(event.target as Element).closest(`[${selectorAttribute}]`)
          : true)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Small delay to prevent immediate closure when clicking the toggle
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      // Also close on Escape key press globally
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setIsOpen(false);
      });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") setIsOpen(false);
      });
    };
  }, [isOpen, closeOnClickOutside, selectorAttribute]);
  return (
    <div className={`relative ${className}`} ref={dropdownRef} id={id}>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-menu` : undefined}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 z-50"
          ref={menuRef}
          role="menu"
          id={id ? `${id}-menu` : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}
