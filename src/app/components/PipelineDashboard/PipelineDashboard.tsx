"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StageIcon } from "../stage-icon";
import { StageConnector } from "../stage-connector";
import { LogViewer } from "../log-viewer";
import { PipelineState, Stage } from "../../types/pipeline";

export const metadata = {
  title: "CI Pipeline Dashboard",
  description: "Monitor your CI/CD pipeline progress",
};

const INITIAL_PIPELINE_STATE: PipelineState = {
  stages: [
    {
      id: "build",
      name: "Build",
      status: "completed",
      logs: [
        "Installing dependencies...",
        "Building project...",
        "Build successful!",
      ],
    },
    {
      id: "test",
      name: "Test",
      status: "completed",
      logs: ["Running unit tests...", "Testing API endpoints..."],
    },
    { id: "deploy", name: "Deploy", status: "in-progress", logs: [] },
    { id: "verify", name: "Verify", status: "pending", logs: [] },
  ],
  currentStage: 1,
  startTime: Date.now(),
  estimatedDuration: 90 * 60 * 1000, // 90 minutes in milliseconds
};

export default function PipelineDashboard() {
  const [pipeline, setPipeline] = useState<PipelineState>(
    INITIAL_PIPELINE_STATE
  );
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedTime(now - pipeline.startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [pipeline.startTime]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleStageClick = (stage: Stage) => {
    if (stage.status === "completed" || stage.status === "in-progress") {
      setSelectedStage(stage);
    }
  };

  const estimatedTimeRemaining = pipeline.estimatedDuration - elapsedTime;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-950 text-white border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          CI Pipeline Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl mb-6">Pipeline Overview</h2>
          <div className="flex items-center justify-center">
            {pipeline.stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <StageIcon
                  status={stage.status}
                  isActive={pipeline.currentStage === index}
                  onClick={() => handleStageClick(stage)}
                />
                {index < pipeline.stages.length - 1 && (
                  <StageConnector isActive={index < pipeline.currentStage} />
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
