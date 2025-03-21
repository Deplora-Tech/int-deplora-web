"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StageIcon } from "../stage-icon";
import { StageConnector } from "../stage-connector";
import { LogViewer } from "../log-viewer";
import { PipelineState,  PipelineStage} from "../../types/PipelineTypes";
import { PipelineStageStatus } from "@/app/constants/Enums";
import {usePipeline} from "../../hooks/pipeline";
import { useSession } from "@/app/hooks/session";

export const metadata = {
  title: "CI Pipeline Dashboard",
  description: "Monitor your CI/CD pipeline progress",
};



// const INITIAL_PIPELINE_STATE: PipelineState = {
//   stages: [
//     {
//       id: "build",
//       name: "Build",
//       status: PipelineStageStatus.PENDING,
//       logs: [
//         "Installing dependencies...",
//         "Building project...",
//         "Build successful!",
//       ],
//       duration: 120000,
//     },
//     {
//       id: "test",
//       name: "Test",
//       status: PipelineStageStatus.SUCCESS,
//       logs: ["Running unit tests...", "Testing API endpoints..."],
//       duration: 180000,
//     },
//     { id: "deploy", name: "Deploy", status: PipelineStageStatus.IN_PROGRESS, logs: [], duration: 0 },
//     { id: "verify", name: "Verify", status: PipelineStageStatus.FAILED, logs: [], duration: 0 },
//   ],
//   currentStage: 0,
//   // startTime: Date.now(),
//   estimatedDuration: 90 * 60 * 1000, // 90 minutes in milliseconds
// };

export default function PipelineDashboard() {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const {pipelineData} = usePipeline();
  const {session_id} = useSession();


  useEffect(() => {
    let in_progress = pipelineData?.stages?.find((stage) => stage.status === PipelineStageStatus.IN_PROGRESS);

    if (in_progress && !selectedStage){
      setSelectedStage(in_progress);
    }

    if (!in_progress || !pipelineData?.timestamp) return; // Exit if timestamp is not available

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedTime(now - Number(pipelineData.timestamp));
    }, 1000);

    return () => clearInterval(interval);
  
  }, [pipelineData]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleStageClick = (stage: PipelineStage) => {
    setSelectedStage(stage);
  };

  const estimatedTimeRemaining = pipelineData.estimatedDuration - elapsedTime;

  const abortPipeline = () => {
    if (!session_id || !pipelineData?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/abort/${session_id}/${pipelineData.id}`, {
      method: 'POST',
    });
  };

  return (
  <Card className="w-full bg-gray-950 text-white border-gray-800">
    <CardHeader>
        <CardTitle className="text-2xl font-bold">
          CI Pipeline Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl mb-6">Pipeline Overview</h2>
          <div className="flex items-center justify-center">
            {pipelineData.stages?.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <StageIcon
                  status={stage.status}
                  isActive={pipelineData.currentStage === index}
                  onClick={() => handleStageClick(stage)}
                />
                {index < pipelineData.stages.length - 1 && (
                  <StageConnector isActive={index < pipelineData.currentStage} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-400">
            <div>Elapsed: {formatTime(elapsedTime)}</div>
            <div>
              Estimated: {formatTime(Math.max(0, estimatedTimeRemaining))}{" "}
              remaining
            </div>
          </div>
        </div>

        {selectedStage && (
          <LogViewer
            stage={selectedStage}
            onClose={() => setSelectedStage(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}
