'use client';
import React, { useEffect, useState } from 'react';
import { Chat } from "../../components/chat";
import { CodeEditor } from "../../components/CodeEditor/CodeEditor";
import { ResizablePanel } from "../../components/resizable-panel";
import { useMessages } from "../../hooks/messages";
import {  useParams } from 'next/navigation';
import PipelineDashboard from "../../components/PipelineDashboard/PipelineDashboard"
import {useSession} from '../../hooks/session';

const Page = () => {
    const { fileContent, setMessageHistory } = useMessages();
    const [hasFiles, setHasFiles] = useState(false);
    const params = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setSessionId, session_id } = useSession();

    useEffect(() => {
        const { id } = params;
        if (typeof id === "string") {
            setSessionId(id);
            setMessageHistory();
            console.log("SETTING MESSAGE HISTORY");
        } else {
            console.error("Invalid ID:", id);
        }
    }, [params, session_id]);
    

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
            {isModalOpen ? (
            <div className="modal">
                <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                <PipelineDashboard />
                </div>
            </div>
            ) : null}
        </div>
    );
}

export default Page;