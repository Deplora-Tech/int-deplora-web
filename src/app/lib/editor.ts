export const detectFileType = (fileName: string) => {
  if (fileName.endsWith(".json")) return "json";
  if (fileName.endsWith(".tf")) return "terraform";
  if (fileName === "Dockerfile") return "dockerfile";
  if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) return "yaml";
  if (fileName === "jenkinsfile") return "jenkinsfile";
  return "plaintext";
};

export const tokenizeContent = (content: string, fileType: string) => {
  switch (fileType) {
    case "dockerfile":
      return content.split(/(\s+|["'=]|#.*$)/gm).filter(Boolean);

    case "terraform":
      return content
        .split(/(\s+|[{}[\]:,;"'=]|#.*$|\/\/.*$|\/\*.*\*\/)/gm)
        .filter(Boolean);

    case "yaml":
      return content.split(/(\s+|[{}[\]:,|"']|#.*$)/gm).filter(Boolean);

    case "json":
      return content.split(/(\s+|[{}[\]:,])/).filter(Boolean);

    default:
      return content.split(/\s+/).filter(Boolean);
  }
};

export const FILE_CONTENT = {
  "terraform/variables.tf":
    '# Variable definitions with detailed descriptions …or the ECS cluster"\n  default     = "t2.micro"\n}\n',
  "terraform/main.tf":
    '# Core Terraform configuration\nprovider "aws" {\n  …sign_public_ip = true\n  }\n\n  desired_count = 2\n}\n',
  Dockerfile:
    '# Use a lightweight base image tailored for the ap…nd to start the application\nCMD ["npm", "start"]\n',
  Jenkinsfile:
    "pipeline {\n    agent any\n\n    stages {\n        sta…ion my-task-def'\n            }\n        }\n    }\n}\n",
};
