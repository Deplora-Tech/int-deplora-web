import { memo } from "react";

interface AssistantMessageProps {
  content: string;
  annotations?: any[];
}

export const AssistantMessage = memo(
  ({ content, annotations }: AssistantMessageProps) => {
    const filteredAnnotations = (annotations?.filter(
      (annotation: any) =>
        annotation &&
        typeof annotation === "object" &&
        Object.keys(annotation).includes("type")
    ) || []) as { type: string; value: any }[];

    const usage: {
      completionTokens: number;
      promptTokens: number;
      totalTokens: number;
    } = filteredAnnotations.find(
      (annotation) => annotation.type === "usage"
    )?.value;

    return (
      <div className="overflow-hidden w-full">
        {usage && (
          <div className="text-sm text-bolt-elements-textSecondary mb-2">
            Tokens: {usage.totalTokens} (prompt: {usage.promptTokens},
            completion: {usage.completionTokens})
          </div>
        )}
      </div>
    );
  }
);
