import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { PipelineStage, PipelineState } from "@/app/types/PipelineTypes";
import { usePipeline } from "@/app/hooks/pipeline";
import AnsiToHtml from "ansi-to-html";

// Create a converter instance with optional configuration.
const converter = new AnsiToHtml({
  // Example options (optional):
  // fg: '#FFF',
  // bg: '#000',
  // newline: true,
});

interface LogViewerProps {
  stage: PipelineStage;
  onClose: () => void;
  pipelineData?: PipelineState;
}

export function LogViewer({
  stage,
  onClose,
  pipelineData: propPipelineData,
}: LogViewerProps) {
  const { pipelineData: hookPipelineData } = usePipeline();
  const pipelineData = propPipelineData || hookPipelineData;

  // Split long log lines (> 130 chars) into multiple lines
  const stageLogs =
    pipelineData.stages
      ?.find((s: PipelineStage) => s.name === stage.name)
      ?.logs?.flatMap((log: string) =>
        log.length > 130
          ? log.match(/.{1,130}/g) || [log] // split into 130-char chunks, handle null
          : [log]
      ) || [];

  return (
    <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold">{stage.name} Logs</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[300px] p-4" scrollToBottom={true}>
        {" "}
        {stageLogs.map((log: string, index: number) => {
          // Convert the ANSI log string to HTML
          const html = converter.toHtml(log || "");

          return (
            <div
              key={index}
              className="font-mono text-sm text-gray-400 whitespace-pre-wrap"
              // Render the formatted HTML. Ensure you trust the log content!
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
}
