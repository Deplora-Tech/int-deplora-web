import { TabsList, TabsTrigger } from "../ui/tabs";

export function TabsHeader() {
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
        </div>
      </div>
    );
  }
  