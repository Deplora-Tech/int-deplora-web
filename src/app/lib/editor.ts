export const detectFileType = (fileName: string) => {
  if (fileName.endsWith(".json")) return "json";
  if (fileName.endsWith(".tf")) return "terraform";
  if (fileName === "Dockerfile") return "dockerfile";
  if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) return "yaml";
  if (fileName === "jenkinsfile") return "jenkinsfile";
  return "plaintext"; // Default
};

export const tokenizeContent = (content: string, fileType: string) => {
  switch (fileType) {
    case "dockerfile":
      // Split Dockerfile into meaningful tokens
      return content.split(/(\s+|["'=]|#.*$)/gm).filter(Boolean);

    case "terraform":
      // Split Terraform files into meaningful tokens
      return content
        .split(/(\s+|[{}[\]:,;"'=]|#.*$|\/\/.*$|\/\*.*\*\/)/gm)
        .filter(Boolean);

    case "yaml":
      // Split YAML files into meaningful tokens
      return content.split(/(\s+|[{}[\]:,|"']|#.*$)/gm).filter(Boolean);

    case "json":
      // Split JSON files (already handled similarly)
      return content.split(/(\s+|[{}[\]:,])/).filter(Boolean);

    default:
      // Default tokenization for unsupported file types
      return content.split(/\s+/).filter(Boolean);
  }
};

export const FILE_CONTENT = {
  Dockerfile: `
  # Use the official Node.js image
  FROM node:16
  
  # Set the working directory
  WORKDIR /app
  
  # Copy package.json and install dependencies
  COPY package.json .
  RUN npm install
  
  # Copy the rest of the app
  COPY . .
  
  # Expose the application port
  EXPOSE 3000
  
  # Run the application
  CMD ["npm", "start"]
  `,
  "main.tf": `
  provider "aws" {
    region = "us-west-2"
  }
  
  resource "aws_instance" "example" {
    ami           = "ami-123456"
    instance_type = "t2.micro"
  
    tags = {
      Name = "example-instance"
    }
  }
  `,
  "config.yaml": `
  version: "3.8"
  services:
    app:
      image: "node:16"
      volumes:
        - .:/app
      ports:
        - "3000:3000"
      environment:
        NODE_ENV: "production"
  `,
  "cloudformation.json": `
  {
    "AWSTemplateFormatVersion": "2010-09-09",
    "Resources": {
      "MyEC2Instance": {
        "Type": "AWS::EC2::Instance",
        "Properties": {
          "InstanceType": "t2.micro",
          "ImageId": "ami-123456"
        }
      }
    }
  }
  `,
  "kubernetes.yaml": `
  apiVersion: v1
  kind: Pod
  metadata:
    name: example-pod
    labels:
      app: example
  spec:
    containers:
    - name: example-container
      image: nginx:latest
      ports:
      - containerPort: 80
  `,
  "jenkinsfile": `
  groovy
    pipeline {
    agent any
    stages {
    stage("Build") {
      steps {
        sh "docker build -t APP_NAME ."
        sh "aws ecr get-login-password --region AWS_REGION | docker login --username AWS --password-stdin AWS_ACCOUNT_ID.dkr.ecr {AWS_REGION.amazonaws.com"
        sh "docker tag APP_NAME:latest AWS_ACCOUNT_ID.dkr.ecr.AWS_REGION.amazonaws.com/APP_NAME:latest"
        sh "docker push AWS_ACCOUNT_ID.dkr.ecr.AWS_REGION.amazonaws.com/APP_NAME:latest"
      }
    }
    stage("Deploy") {
      steps {
        sh "aws ecs update-service --cluster APP_NAME --service APP_NAME --task-definition APP_NAME-task"
      }
    }
  }
}
`,
};
