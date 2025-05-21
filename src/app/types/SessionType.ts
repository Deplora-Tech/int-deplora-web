
export interface SessionContextType {
    session_id: string | null;
    setSessionId: (session_id: string) => void;
    project: GitRepo | null;
    setProject: (project: GitRepo) => void;
    client_id: string | null;
    setClientId: (client_id: string) => void;
}

export type GitRepo = {
    id: string;
    repo_url: string;
    branch: string;
    name: string;
};