
export interface SessionContextType {
    session_id: string | null;
    setSessionId: (session_id: string) => void;
    project_id: string | null;
    setProjectId: (project_id: string) => void;
}