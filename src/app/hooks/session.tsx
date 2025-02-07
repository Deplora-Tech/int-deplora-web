import { createContext, useContext, useState } from "react";
import {SessionContextType} from "../types/SessionType"

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const  [session_id, setSessionId] = useState<string | null>(null);

    return (
        <SessionContext.Provider value={{ session_id, setSessionId }}>
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