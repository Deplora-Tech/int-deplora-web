import { Card, CardContent } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { AlertCircle, CheckCircle2, PlayCircle } from "lucide-react";

export function DeploymentExecution() {
  return (
    <Card className="border-zinc-800 bg-black/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-cyan-500" />
          <h3 className="text-lg font-medium text-white">Current Deployment</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/50 p-4">
            <div>
              <h4 className="font-medium text-zinc-300">Status</h4>
              <div className="mt-1 text-sm text-zinc-400">
                In Progress - Stage 2/4
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-cyan-500" />
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-25rem)] rounded-lg border border-zinc-800 bg-black/50 p-4">
            <pre className="font-mono text-sm text-zinc-400">
              {`[2024-02-15 13:55:23] Starting deployment...
[2024-02-15 13:55:24] Initializing Terraform...
[2024-02-15 13:55:25] Creating ECS cluster...
[2024-02-15 13:55:26] Configuring load balancer...
[2024-02-15 13:55:27] Setting up security groups...
[2024-02-15 13:55:28] Deploying containers...
[2024-02-15 13:55:29] Configuring auto-scaling...
[2024-02-15 13:55:30] Setting up monitoring...`}
            </pre>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
