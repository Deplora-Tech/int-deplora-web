'use client';
import React, { useEffect, useState } from 'react';
import { Chat } from "../../components/chat";
import { CodeEditor } from "../../components/CodeEditor/CodeEditor";
import { ResizablePanel } from "../../components/resizable-panel";
import { useMessages } from "../../hooks/messages";
import { useParams } from 'next/navigation';
import PipelineDashboard from "../../components/PipelineDashboard/PipelineDashboard";
import { useSession } from '../../hooks/session';

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
            <style jsx>{`
                .modal {
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgb(0,0,0);
                    background-color: rgba(0,0,0,0.4);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background-color: #fefefe;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #888;
                    width: 80%;
                    max-width: 600px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    animation: animatetop 0.4s;
                }
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                }
                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
                @keyframes animatetop {
                    from {top: -300px; opacity: 0}
                    to {top: 0; opacity: 1}
                }
            `}</style>
        </div>
    );
}

export default Page;