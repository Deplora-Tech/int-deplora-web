// write a organizations provides hook that returns the organizations
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./session";
import { getOrganizations, createOrganization } from "../api/api";
import { useUser } from "./user";

type Organization = {
  id: string;
  name: string;
  client_id: string;
  description: string;
};

const organizationsContext = createContext<{
  organizations: Organization[];
  createOrg: (name: string, description: string) => Promise<void>;
  org: Organization | null;
  setOrg: (org: Organization | null) => void;
}>({} as any);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [org, setOrg] = useState<Organization | null>({
    id: "1",
    name: "Default Organization",
    client_id: "1",
    description: "This is the default organization",
  });
  const { user } = useUser();

  const createOrg = async (name: string, description: string) => {
    try {
      const response = await createOrganization({
        client_id: user?.id || "1",
        name,
        description,
      });
      const data = await response.json();
      setOrganizations((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  useEffect(() => {
    const orgId = localStorage.getItem("org");
    if (orgId) {
      setOrg(organizations.find((o) => o.id === orgId) || null);
    }
    const fetchOrganizations = async () => {
      try {
        if (!user) return;
        const response = await getOrganizations(user.id);
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, [user]);

  if (!organizations) {
    throw new Error(
      "useOrganizations must be used within a OrganizationProvider"
    );
  }
  return (
    <organizationsContext.Provider
      value={{ organizations, createOrg, setOrg, org }}
    >
      {children}
    </organizationsContext.Provider>
  );
};

export const useOrganizations = () => {
  const context = useContext(organizationsContext);
  if (!context) {
    throw new Error(
      "useOrganizations must be used within a OrganizationProvider"
    );
  }
  return context;
};
