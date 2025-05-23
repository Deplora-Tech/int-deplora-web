import { CostSummary } from "../types/cost";

export const mockCostData: CostSummary = {
  totalCost: 67.95,
  groups: [
    {
      id: "artifacts",
      name: "artifacts",
      cost: 2.36,
      resources: [
        {
          id: "aws_codebuild_project.app",
          name: "aws_codebuild_project.app",
          cost: 0.60,
          children: [
            {
              id: "linux_general1.small",
              name: "Linux (general1.small)",
              quantity: 120,
              units: "Minutes",
              cost: 0.60
            }
          ]
        },
        {
          id: "aws_ecr_repository.app",
          name: "aws_ecr_repository.app",
          cost: 1.00,
          children: [
            {
              id: "storage",
              name: "Storage",
              quantity: 10,
              units: "GB / Month",
              cost: 1.00
            }
          ]
        },
        {
          id: "aws_s3_bucket.artifacts",
          name: "aws_s3_bucket.artifacts",
          cost: 0.76,
          children: [
            {
              id: "general_purpose_storage",
              name: "General Purpose Storage Usage",
              quantity: 10,
              units: "GB / Month",
              cost: 0.23
            },
            {
              id: "standard_infrequent_access",
              name: "Standard Infrequent Access Storage Usage",
              quantity: 10,
              units: "GB / Month",
              cost: 0.13
            },
            {
              id: "intelligent_archive",
              name: "Intelligent Archive Storage Usage",
              quantity: 10,
              units: "GB / Month",
              cost: 0.04
            },
            {
              id: "intelligent_deep_archive",
              name: "Intelligent Deep Archive Storage Usage",
              quantity: 10,
              units: "GB / Month",
              cost: 0.01
            },
            {
              id: "intelligent_frequent_access",
              name: "Intelligent Frequent Access Storage Usage",
              quantity: 10,
              units: "GB / Month",
              cost: 0.23
            },
            {
              id: "intelligent_infrequent_access",
              name: "Intelligent Infrequent Access Storage Usage",
              quantity: 10,
              units: "GB / Month",
              cost: 0.13
            }
          ]
        },
      ],
    },
    {
      id: "dev",
      name: "dev",
      cost: 65.59,
      resources: [
        {
          id: "aws_ecs_service.app",
          name: "aws_ecs_service.app",
          cost: 65.59,
        },
      ],
    },
  ],
};