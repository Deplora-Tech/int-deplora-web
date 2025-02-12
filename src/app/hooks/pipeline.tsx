import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { ExcecutionStatus, PipelineStageStatus } from "../constants/Enums";
import { PipelineState, PipelineContextType } from "../types/PipelineTypes";
import { useSession } from "./session";

const PipelineContext = createContext<PipelineContextType | undefined>(
    undefined
);

export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [pipelineData, setPipelineData] = useState<PipelineState | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);

    const { session_id } = useSession();

    useEffect(() => {

        if (!session_id) return;

        try {
            const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL}/pipeline-ws/${session_id}`);
            websocketRef.current = websocket;

            websocket.onopen = () => {
                console.log("WebSocket connection for pipeline opened.");
            };

            websocket.onmessage = (event) => {
                // console.log("Pipeline event data:", event.data);
                const res = JSON.parse(event.data);

                setPipelineData((prevData) => {

                    const currentData = prevData ?? ({} as PipelineState);

                    if (res.status === ExcecutionStatus.INITIALIZE) {
                        let data = JSON.parse(res.data);
                        let stages = data["stages"].map((stage: any) => {
                            return {
                                'id': stage,
                                'name': stage,
                                'status': PipelineStageStatus.PENDING,
                                'logs': [
                                ],
                            };
                        });
                        data["stages"] = stages;
                        data["currentStage"] = 0;
                        setPipelineData(data);
                        console.log("Pipeline data:", data);
                    }
                    else if (res.status === ExcecutionStatus.PROCESSING) {
                        console.log("Pipeline processing data");
                        let data = JSON.parse(res.data);
                        let stages = currentData?.stages ?? [];
                        console.log("Current data:", currentData);

                        for (let updatedStage of data.stages) {
                            let stageIndex = stages.findIndex((stage) => stage.name === updatedStage.name);
                            if (stageIndex !== -1) {
                                stages[stageIndex] = updatedStage;
                            }
                        }

                        console.log("Updated stages:", stages);

                        setPipelineData({
                            ...pipelineData,
                            stages: stages,
                            currentStage: data.currentStage,
                            id: pipelineData?.id ?? "",
                            estimatedDuration: data?.estimatedDuration,
                            duration: data?.duration,
                            timestamp: data?.timestamp,
                        });
                    }
                    return currentData;
                });

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
                pipelineData: pipelineData ?? {} as PipelineState
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
