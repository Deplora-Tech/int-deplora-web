import { useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { Message } from "../types/MessageTypes";
import { useMessages } from "../hooks/messages";

interface SecureInputFormProps {
  message: Message;
  setPipelineData: (data: any) => void;
}

export function ExcecutionMessage({ message, setPipelineData }: SecureInputFormProps) {
  const { allPipelineData , addMessage} = useMessages();
  const pipelineData = useMemo(() => {
    let data = allPipelineData[message.content]
    if (data){
      data["id"] = message.content
    return data;
    }
  }, [allPipelineData, message.content]);

  const [open, setOpen] = useState(false);
  
  const isFailed = pipelineData?.stages?.some((stage: any) => stage.status === "FAILED");
  const firstFailedStage = pipelineData?.stages?.find((stage: any) => stage.status === "FAILED");

  const renderStatusIcon = (status: string) => {
    if (status === "SUCCESS") return <CheckCircle className="text-green-500 w-4 h-4" />;
    if (status === "FAILED") return <XCircle className="text-red-500 w-4 h-4" />;
    return <Clock className="text-yellow-500 w-4 h-4" />;
  };


  const handleFix = () => {


      setTimeout(() => {
        addMessage({
          content: `The following stage failed:\n\n${firstFailedStage?.name}\n\nLogs:\n${firstFailedStage?.logs?.join('\n')}\n\nCan you help fix this issue?`,
          sender: "User",
          timestamp: new Date(),
          userId: 1,
          state: [],
        });
      }, 1000);

  };

  return (
    <Card className="max-w-md w-full mx-auto bg-[#0a0d14]/90 border border-[#1e2a3a] shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <h2 className="text-xl font-semibold text-white">Pipeline Execution</h2>
          {open ? (
            <ChevronDown className="w-5 h-5 text-white" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white" />
          )}
        </div>

        {open && pipelineData?.stages?.length > 0 ? (
          <div className="space-y-3 pt-2">
            {pipelineData.stages.map((stage: any) => (
              <div
                key={stage.id}
                className="flex items-center justify-between border-b border-[#1e2a3a]/50 pb-2"
              >
                <div>
                  <p className="text-sm text-white font-medium">{stage.name}</p>
                  <p className="text-xs text-gray-400">
                    Duration: {(stage.durationMillis / 1000).toFixed(2)}s
                  </p>
                </div>
                <div>{renderStatusIcon(stage.status)}</div>
              </div>
            ))}
          </div>
        ) : (
          open && <p className="text-sm text-gray-400">No pipeline data available.</p>
        )}
      </CardContent>
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 px-6 pb-4">
        {isFailed && (
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded transition"
            onClick={handleFix}
          >
            Fix
          </button>
        )}
        <button
          className={`${
            isFailed
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-cyan-600 hover:bg-cyan-700"
          } text-white text-sm font-medium py-2 px-4 rounded transition`}
          onClick={() => {
            setPipelineData(message.content);
          }}
        >
          View Details
        </button>
      </div>
    </Card>
  );
}
