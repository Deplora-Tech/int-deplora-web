import { Check, Clock, Terminal, AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { PipelineStageStatus } from "@/app/constants/Enums";

interface StageIconProps {
  status: PipelineStageStatus;
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
        status === PipelineStageStatus.SUCCESS && "bg-green-500 text-white",
        status === PipelineStageStatus.IN_PROGRESS && "bg-blue-600 text-white animate-pulse",
        status === PipelineStageStatus.PENDING && "bg-gray-800 text-gray-400",
        status === PipelineStageStatus.FAILED && "bg-red-500 text-white",
        status === PipelineStageStatus.ABORTED && "bg-yellow-500 text-white",
        isActive && "ring-2 ring-blue-400",
        className
      )}
    >
      {status === PipelineStageStatus.SUCCESS && <Check className="w-8 h-8" />}
      {status === PipelineStageStatus.IN_PROGRESS && <Clock className="w-8 h-8" />}
      {status === PipelineStageStatus.PENDING && <Terminal className="w-8 h-8" />}
      {status === PipelineStageStatus.FAILED && <AlertCircle className="w-8 h-8" />}
      {status === PipelineStageStatus.ABORTED && <AlertCircle className="w-8 h-8" />}
    </div>
  );
}
