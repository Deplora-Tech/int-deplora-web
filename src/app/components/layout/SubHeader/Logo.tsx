"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function Logo({ size = "md", className = "", onClick }: LogoProps) {
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const textSize = textSizes[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = "/";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <span
      className={`${textSize} font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent ${className}`}
    >
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Go to homepage"
        className="outline-none"
        tabIndex={0}
      >
        Deplora
      </button>
    </span>
  );
}
