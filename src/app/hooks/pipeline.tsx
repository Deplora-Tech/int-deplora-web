import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { ExcecutionStatus } from "../constants/Enums";
import type { PipelineData, PipelineContextType } from "../types/PipelineTypes";
import { useMessages } from "./messages";

const PipelineContext = createContext<PipelineContextType | undefined>(
    undefined
);

export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);

    const { session_id } = useMessages();

    useEffect(() => {
        try {
            const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL}/pipeline-ws/${session_id}`);
            websocketRef.current = websocket;

            websocket.onopen = () => {
                console.log("WebSocket connection for pipeline opened.");
            };

            websocket.onmessage = (event) => {
                const res = JSON.parse(event.data);

                if (Object.values(ExcecutionStatus).includes(res.status)) {
                    console.log("Pipeline execution stage:", res.status);
                }

                if (res.status === ExcecutionStatus.INITIALIZE) {
                    let data = JSON.parse(res.data);
                    data["currentStage"] = 0;
                    setPipelineData(data);
                    console.log("Pipeline dataaaa:", data);
                }
            };

            websocket.onclose = () => {
                console.log("WebSocket connection for pipeline closed.");
            };

            websocket.onerror = (error) => {
                console.log("WebSocket error for pipeline:", error);
            };

            return () => {
                websocket.close();
            };
        }

        catch (error) {
            console.error("Error in pipeline websocket:", error);
        }
    }, [session_id]);


    return (
        <PipelineContext.Provider
            value={{
                pipelineData: pipelineData ?? {} as PipelineData
            }}
        >
            {children}
        </PipelineContext.Provider>
    );
};

export const usePipeline = () => {
    const context = useContext(PipelineContext);
    if (!context) {
        throw new Error("usePipeline must be used within a PipelineProvider");
    }
    return context;
};
