import React from "react";
import { useMessages } from "@/app/hooks/messages";

export default function PreviewContent() {
  const { graph } = useMessages();
  console.log(graph);
  const imageUrl = graph?.image_data
    ? `data:image/png;base64,${graph.image_data}`
    : null;
  console.log(imageUrl);

  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 scrollbar-hide">
      {imageUrl ? (
        <img src={imageUrl} alt="Graph" className="w-full object-contain" />
      ) : (
        <div className="flex flex-1 items-center justify-center h-full w-full">
          <span className="text-neutral-500">No graph to display</span>
        </div>
      )}
    </div>
  );
}
