import { TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useSession } from "../../hooks/session";
import { GitCommit } from "lucide-react";
import { useMessages } from "@/app/hooks/messages";

interface TabsHeaderProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

export function TabsHeader({ setIsModalOpen }: TabsHeaderProps) {
  const { session_id } = useSession();
  const { setMessageHistory } = useMessages();

  const handleDeploy = () => {
    // Show the modal popup
    setIsModalOpen(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute/${session_id}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to post status");
          return;
        }
        setMessageHistory();
      })
      .catch((err) => {
        console.error("Error posting status:", err);
      });
  };

  return (
    <div className="border-b border-white/[0.02]">
      <div className="flex justify-between px-4 py-1">
        <TabsList className="h-9 bg-transparent border-none">
          <TabsTrigger
            value="code"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
          >
            Code
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="text-sm data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
          >
            Preview
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-2 p-2">
          <Button
            onClick={handleDeploy}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-teal-400 hover:bg-blue-600 text-white grayscale"
          >
            <GitCommit className="w-4 h-4 mr-2" />
            Commit to Repository
          </Button>

          <Button
            onClick={handleDeploy}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-teal-400 hover:bg-blue-600 text-white"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Modal Popup */}
    </div>
  );
}
