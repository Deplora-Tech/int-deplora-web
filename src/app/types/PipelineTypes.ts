import { ExcecutionStatus } from "../constants/Enums";

interface Stage {
    id: string;
    name: string;
    status: string;
    duration: number;
    logs?: string[];
}

// Represents a single pipeline data entry
export interface PipelineData {
  id: string;
  stages: Stage[];
  estimatedDuration: number;
  duration: number;
  timestamp: Date;
  currentStage: number;
}

// Represents the context type for pipeline management
export interface PipelineContextType {
  pipelineData: PipelineData;
}
