import { cn } from "@/app/lib/utils";

interface StageConnectorProps {
  isActive?: boolean;
  className?: string;
}

export function StageConnector({ isActive, className }: StageConnectorProps) {
  return (
    <div className={cn("flex items-center px-2", className)}>
      <div className="h-1 w-8 rounded">
        <div
          className={cn(
            "h-full w-full rounded transition-colors",
            isActive ? "bg-blue-500" : "bg-gray-800"
          )}
        />
      </div>
    </div>
  );
}
