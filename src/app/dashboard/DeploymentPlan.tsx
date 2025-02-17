import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";

export function DeploymentPlan() {
  return (
    <Card className="border-zinc-800 bg-black/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
            <h4 className="mb-2 font-medium text-zinc-300">Cloud Provider</h4>
            <Badge className="bg-cyan-500 text-black hover:bg-cyan-400">
              AWS
            </Badge>
            <div className="mt-2 text-sm text-zinc-400">
              Region: us-east-1
              <br />
              Services: ECS, RDS, ElastiCache
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
            <h4 className="mb-2 font-medium text-zinc-300">Configuration</h4>
            <div className="space-y-2 font-mono text-sm text-zinc-400">
              <div>├── terraform/</div>
              <div>├── kubernetes/</div>
              <div>└── ansible/</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
