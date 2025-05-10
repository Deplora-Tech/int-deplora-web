"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StageIcon } from "../stage-icon";
import { StageConnector } from "../stage-connector";
import { LogViewer } from "../log-viewer";
import { PipelineState, PipelineStage } from "../../types/PipelineTypes";
import { PipelineStageStatus } from "@/app/constants/Enums";
import { usePipeline } from "../../hooks/pipeline";
import { useSession } from "@/app/hooks/session";

export const metadata = {
  title: "CI Pipeline Dashboard",
  description: "Monitor your CI/CD pipeline progress",
};


export default function PipelineDashboard() {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const { pipelineData } = usePipeline();
  const { session_id } = useSession();
  const [building, setBuilding] = useState(true);
  // const []

  // run every 2 seconds
  useEffect(() => {
    if (!building) return;

    const interval = setInterval(() => {
      if (!building || !session_id || !pipelineData?.id) {
        clearInterval(interval);
        return;
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/${session_id}/${pipelineData.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            console.error("Failed to post status");
            return;
          }
          const status = await res.json();
          setBuilding(status.building);
          setElapsedTime(Date.now() - Number(pipelineData.timestamp));
        })
        .catch((err) => {
          console.error("Error posting status:", err);
        });

    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [building, session_id, pipelineData?.id]);



  // useEffect(() => {
  //   let in_progress = pipelineData?.stages?.find((stage) => stage.status === PipelineStageStatus.IN_PROGRESS);

  //   if (in_progress && !selectedStage) {
  //     setSelectedStage(in_progress);
  //   }

  //   if (!in_progress || !pipelineData?.timestamp) return; // Exit if timestamp is not available

  //   const interval = setInterval(() => {
  //     const now = Date.now();
  //     setElapsedTime(now - Number(pipelineData.timestamp));
  //   }, 1000);

  //   return () => clearInterval(interval);

  // }, [pipelineData]);

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
