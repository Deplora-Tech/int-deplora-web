// write a projects provides hook that returns the projects
import { createContext, useEffect, useState } from "react";
import { useSession } from "./session";
import { getProjects } from "../api/api";
import { useUser } from "./user";

type Project = {
  id: string;
  name: string;
  userId: string;
  description: string;
  created_at: string;
  updated_at: string;
};

const ProjectsContext = createContext<Project[] | undefined>(undefined);

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { session_id } = useSession();
  const { user } = useUser();

  useEffect(() => {
    if (!session_id || !user) return;

    const fetchProjects = async () => {
      try {
        if (!user) return;
        const response = await getProjects(user.id);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [session_id, user]);

  return { projects };
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { projects } = useProjects();
  if (!projects) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  );
};
