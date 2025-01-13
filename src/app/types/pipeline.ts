export type StageStatus = 'completed' | 'in-progress' | 'pending' | 'failed'

export interface Stage {
  id: string
  name: string
  status: StageStatus
  logs?: string[]
  startTime?: number
  endTime?: number
}

export interface PipelineState {
  stages: Stage[]
  currentStage: number
  startTime: number
  estimatedDuration: number
}

