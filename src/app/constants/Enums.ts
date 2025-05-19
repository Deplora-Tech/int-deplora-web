export enum DeploymentOptions {
    DOCKERIZED_DEPLOYMENT = "Dockerized Deployments (Containerization)",
    KUBERNETES_DEPLOYMENT = "Kubernetes-Orchestrated Deployment",
    VM_DEPLOYMENT = "MI/VM Image-Based Deployment",
  }
  
  export enum LoraStatus {
    STARTING = "LORASTATUS_STARTING",
    INTENT_DETECTED = "LORASTATUS_INTENT_DETECTED",
    RETRIEVING_USER_PREFERENCES = "LORASTATUS_RETRIEVING_USER_PREFERENCES",
    RETRIEVING_PROJECT_DETAILS = "LORASTATUS_RETRIEVING_PROJECT_DETAILS",
    GENERATING_DEPLOYMENT_PLAN = "LORASTATUS_GENERATING_PLAN",
    GENERATED_DEPLOYMENT_PLAN = "LORASTATUS_GENERATED_PLAN",
    FAILED = "LORASTATUS_FAILED",
    COMPLETED = "LORASTATUS_COMPLETED",
    GATHERING_DATA = "LORASTATUS_GATHERING_DATA",
  }
  
  export enum GraphStatus {
    INITIALIZE = "GRAPHSTATUS_INITIALIZE",
    COMPLETED = "GRAPHSTATUS_COMPLETED",
    FAILED = "GRAPHSTATUS_FAILED",
  }
  
  export enum ExcecutionStatus {
    INITIALIZE = "EXCECUTION_INITIALIZE",
    PROCESSING = "EXCECUTION_PROCESSING",
    WAITING_FOR_INPUT = "EXCECUTION_WAITING_FOR_INPUT",
    COMPLETED = "EXCECUTION_COMPLETED",
    FAILED = "EXCECUTION_FAILED",
  }

  export type GraphType = {
    content_type: string;
    image_data: string;
    filename: string;
  };
  

  export const statusMessages: Record<LoraStatus, string> = {
    [LoraStatus.STARTING]: "Starting the process...",
    [LoraStatus.INTENT_DETECTED]: "Intent detected! Analyzing further...",
    [LoraStatus.RETRIEVING_USER_PREFERENCES]: "Retrieving user preferences...",
    [LoraStatus.RETRIEVING_PROJECT_DETAILS]: "Fetching project details...",
    [LoraStatus.GENERATING_DEPLOYMENT_PLAN]: "Generating the deployment plan...",
    [LoraStatus.GENERATED_DEPLOYMENT_PLAN]: "Deployment plan generated successfully!",
    [LoraStatus.GATHERING_DATA]: "Gathering additional data...",
    [LoraStatus.COMPLETED]: "Process completed successfully!",
    [LoraStatus.FAILED]: "Something went wrong. Please try again.",
  };

  export enum PipelineStageStatus {
    IN_PROGRESS = "IN_PROGRESS",
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    ABORTED = "ABORTED",
  }