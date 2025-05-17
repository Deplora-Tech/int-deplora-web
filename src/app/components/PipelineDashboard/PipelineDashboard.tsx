"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StageIcon } from "@/app/components/PipelineDashboard/stage-icon";
import { StageConnector } from "@/app/components/PipelineDashboard/stage-connector";
import { LogViewer } from "@/app/components/PipelineDashboard/log-viewer";
import { PipelineState, PipelineStage } from "../../types/PipelineTypes";
import { useSession } from "@/app/hooks/session";
import { useMessages } from "@/app/hooks/messages";

interface PipelineDashboardProps {
  build_id: string;
}

export default function PipelineDashboard({ build_id }: PipelineDashboardProps) {
  const { session_id } = useSession();
  const {setMessageHistory} = useMessages()
  const [pipelineData, setPipelineData] = useState<PipelineState | undefined>();
  const [building, setBuilding] = useState<boolean>(true);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);

  // Initial + repeated status polling
  useEffect(() => {
    if (!session_id || !build_id) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/${session_id}/${build_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.error("Failed to post status");
          return;
        }

        const status: PipelineState & { building: boolean } = await res.json();
        setPipelineData(status);
        setBuilding(status.building);
        if (status.timestamp) {
          setElapsedTime(Date.now() - Number(status.timestamp));
        }
        setMessageHistory()
      } catch (err) {
        console.error("Error posting status:", err);
      }
    };

    fetchStatus(); // Initial call

    const interval = setInterval(() => {
      if (building) fetchStatus();
      else clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, [build_id, session_id, building]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const estimatedTimeRemaining = pipelineData?.estimatedDuration
    ? pipelineData.estimatedDuration - elapsedTime
    : 0;

  return (
    <Card className="w-full bg-gray-950 text-white border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          CI Pipeline Dashboard {building ? "Building..." : "Completed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl mb-6">Pipeline Overview</h2>
          <div className="flex items-center justify-center">
            {pipelineData?.stages?.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <StageIcon
                  status={stage.status}
                  isActive={pipelineData.currentStage === index}
                  onClick={() => setSelectedStage(stage)}
                />
                {index < pipelineData.stages.length - 1 && (
                  <StageConnector isActive={index < pipelineData.currentStage} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-400">
            <div>Elapsed: {formatTime(elapsedTime)}</div>
            <div>Estimated: {formatTime(Math.max(0, estimatedTimeRemaining))} remaining</div>
          </div>
        </div>

        {selectedStage && (
          <LogViewer
            stage={selectedStage}
            onClose={() => setSelectedStage(null)}
            pipelineData={pipelineData}
          />
        )}
      </CardContent>
    </Card>
  );
}
