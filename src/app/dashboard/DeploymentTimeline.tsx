import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { History } from "lucide-react";

export function DeploymentTimeline() {
  return (
    <Card className="border-zinc-800 bg-black/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-cyan-500" />
          <h3 className="text-lg font-medium text-white">Deployment History</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((deployment) => (
            <div
              key={deployment}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/50 p-4"
            >
              <div>
                <h4 className="font-medium text-zinc-300">
                  Deployment #{deployment}
                </h4>
                <div className="mt-1 text-sm text-zinc-400">
                  Completed on Feb 1{deployment}, 2024
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-cyan-600 text-cyan-500"
              >
                Successful
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
