import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Github, Users } from "lucide-react";

export function ProjectHeader() {
  return (
    <div className="border-b border-zinc-800 bg-black/50 p-6 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white">
            Project: Cloud Deploy Automation
          </h2>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>ID: PRJ-2024-001</span>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="outline" className="border-cyan-600 text-cyan-500">
              Active
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-zinc-800 bg-black/50 text-white hover:bg-zinc-900"
          >
            <Github className="h-4 w-4" />
            Repository
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-zinc-800 bg-black/50 text-white hover:bg-zinc-900"
          >
            <Users className="h-4 w-4" />
            Team (5)
          </Button>
        </div>
      </div>
    </div>
  );
}
