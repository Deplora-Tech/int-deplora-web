"use client";

import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from "react";
import { Button } from "./button";

interface DropdownFormProps {
  title: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  initialValue?: string;
  inputPlaceholder?: string;
  descriptionPlaceholder?: string;
  showDescription?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  className?: string;
}

export function DropdownForm({
  title,
  onSubmit,
  onCancel,
  initialValue = "",
  inputPlaceholder = "Enter name",
  descriptionPlaceholder = "Description (optional)",
  showDescription = false,
  submitButtonText = "Save",
  cancelButtonText = "Cancel",
  className = "",
}: DropdownFormProps) {
  const [value, setValue] = useState(initialValue);
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  // Focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim() === "") return;

    onSubmit(value);
    setValue("");
    setDescription("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (
        (e.shiftKey || e.ctrlKey) &&
        showDescription &&
        descriptionRef.current
      ) {
        // Move to description field
        descriptionRef.current.focus();
      } else {
        // Submit the form
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 bg-gradient-to-r from-blue-500/10 to-teal-400/10 rounded-lg border border-white/10 ${className} w-max h-full`}
    >
      <input
        ref={inputRef}
        type="text"
        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-md text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
        placeholder={inputPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={title}
      />

      {showDescription && (
        <input
          ref={descriptionRef}
          type="text"
          className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-md text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3"
          placeholder={descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim() !== "") {
              handleSubmit();
            } else if (e.key === "Escape") {
              onCancel();
            }
          }}
          aria-label="Description"
        />
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white transition-colors"
          onClick={onCancel}
          type="button"
        >
          {cancelButtonText}
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500 transition-colors"
          onClick={() => handleSubmit()}
          disabled={value.trim() === ""}
          type="submit"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
