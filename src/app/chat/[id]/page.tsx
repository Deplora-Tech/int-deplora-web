'use client';
import React, { useEffect, useState } from 'react';
import { Chat } from "../../components/chat";
import { CodeEditor } from "../../components/CodeEditor/CodeEditor";
import { ResizablePanel } from "../../components/resizable-panel";
import { useMessages } from "../../hooks/messages";
import { useParams } from 'next/navigation';

import { Button } from "../../components/ui/button";
import PipelineDashboard from "../../components/PipelineDashboard/PipelineDashboard";


const Page = () => {
  const { fileContent, setMessageHistory } = useMessages();
  const [hasFiles, setHasFiles] = useState(false);
  const params = useParams();

  useEffect(() => {
    const { id } = params;
    setMessageHistory(id);
    console.log("SETTING MESSAGE HISTORY");
  }, [params]);

  useEffect(() => {
    if (fileContent && Object.keys(fileContent).length > 0) {
      setHasFiles(true);
    }
  }, [fileContent]);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex min-h-0 p-4">
      {isModalOpen && (
        <div
          className="fixed bg-blue-700 p-40 bg-opacity-50 flex items-center justify-center z-50 w-full max-h-[50dvh]"
          onClick={handleCloseModal} // Close modal on background click
          onKeyUp={(e) => {
            if (e.key === 'Escape') {
              handleCloseModal();
            }
          }}
        >
          <div
            className="bg-neutral-100 rounded-lg p-4 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCloseModal();
              }
            }}
          >
            <PipelineDashboard />
            <Button
              size="sm"
              className="mt-4 bg-red-500 hover:bg-red-600 text-white"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      <ResizablePanel>
        <Chat />
      </ResizablePanel>
      {hasFiles ? <CodeEditor setIsModalOpen={setIsModalOpen} /> : null}


    </div>
  );
}

export default Page;
