import { TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useSession } from "../../hooks/session";

interface TabsHeaderProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

export function TabsHeader({ setIsModalOpen }: TabsHeaderProps) {
  const { session_id } = useSession();

  const handleDeploy = () => {
    // Show the modal popup
    setIsModalOpen(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/excecute/${session_id}`, {});
  };



  return (
    <div className="border-b border-white/[0.02]">
      <div className="flex items-center px-4 py-1">
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

        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleDeploy}
        >
          <ArrowUpRight />
          Deploy
        </Button>
      </div>

      {/* Modal Popup */}
      
    </div>
  );
}
