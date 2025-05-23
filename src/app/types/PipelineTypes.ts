import { PipelineStageStatus } from "../constants/Enums";

export interface PipelineStage {
    id: string;
    name: string;
    status: PipelineStageStatus;
    duration: number;
    logs?: string[];
}

// Represents a single pipeline data entry
export interface PipelineState {
  id: string;
  stages: PipelineStage[];
  estimatedDuration: number;
  duration: number;
  timestamp: Date;
  currentStage: number;
  building: boolean;
}

// Represents the context type for pipeline management
export interface PipelineContextType {
  pipelineData: PipelineState;
}
