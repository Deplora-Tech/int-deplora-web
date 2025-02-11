import { Check, Clock, Terminal, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { StageStatus } from "../types/pipeline";

interface StageIconProps {
  status: StageStatus;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StageIcon({
  status,
  isActive,
  onClick,
  className,
}: StageIconProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-colors",
        status === "SUCCESS" && "bg-blue-500 text-white",
        status === "IN_PROGRESS" && "bg-blue-600 text-white animate-pulse",
        status === "pending" && "bg-gray-800 text-gray-400",
        status === "FAILED" && "bg-red-500 text-white",
        isActive && "ring-2 ring-blue-400",
        className
      )}
    >
      {status === "SUCCESS" && <Check className="w-8 h-8" />}
      {status === "IN_PROGRESS" && <Clock className="w-8 h-8" />}
      {status === "pending" && <Terminal className="w-8 h-8" />}
      {status === "FAILED" && <AlertCircle className="w-8 h-8" />}
    </div>
  );
}
