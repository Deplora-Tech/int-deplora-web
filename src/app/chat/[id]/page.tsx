'use client';
import React, { useEffect, useState } from 'react';
import { Chat } from "../../components/chat";
import { CodeEditor } from "../../components/CodeEditor/CodeEditor";
import { ResizablePanel } from "../../components/resizable-panel";
import { useMessages } from "../../hooks/messages";
import {  useParams } from 'next/navigation';
import PipelineDashboard from "../../components/PipelineDashboard/PipelineDashboard"

const Page = () => {
    const { fileContent, setMessageHistory } = useMessages();
    const [hasFiles, setHasFiles] = useState(false);
    const params = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const { id } = params;
    
        if (typeof id === "string") {
            setMessageHistory(id);
            console.log("SETTING MESSAGE HISTORY");
        } else {
            console.error("Invalid ID:", id);
        }
    }, [params]);
    

    useEffect(() => {
        if (fileContent && Object.keys(fileContent).length > 0) {
            setHasFiles(true);
        }
    }, [fileContent]);



    return (
        <div className="flex-1 flex min-h-0 p-4">
            <ResizablePanel>
                <Chat />
            </ResizablePanel>
            {hasFiles ? <CodeEditor setIsModalOpen={setIsModalOpen} /> : null}
            {isModalOpen ? <PipelineDashboard /> : null}
        </div>
    );
}

export default Page;