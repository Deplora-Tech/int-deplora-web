
export interface SessionContextType {
    session_id: string | null;
    setSessionId: (session_id: string) => void;
}