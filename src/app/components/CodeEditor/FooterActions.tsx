import { Plus, Terminal, Zap } from "lucide-react";
import { Button } from "../ui/button";

export function FooterActions() {
    return (
      <div className="px-2 flex items-center justify-between border-t border-white/[0.02]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-neutral-400 hover:text-white"
          >
            <Terminal className="w-3 h-3 mr-1" />
            Terminal
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-neutral-400 hover:text-white"
          >
            <Zap className="w-3 h-3 mr-1" />
            Deplora
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    );
  }