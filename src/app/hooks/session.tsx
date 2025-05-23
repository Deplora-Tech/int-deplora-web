import { createContext, useContext, useState } from "react";
import {GitRepo, SessionContextType} from "../types/SessionType"

const SessionContext = createContext<SessionContextType | undefined>(undefined);



export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const  [session_id, setSessionId] = useState<string | null>(null);
    const [project, setProject] = useState<GitRepo | null>(null);
    const [client_id, setClientId] = useState<string | null>(null);


    return (
        <SessionContext.Provider value={{ session_id, setSessionId , project, setProject, client_id, setClientId }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}