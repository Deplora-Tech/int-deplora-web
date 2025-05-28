// write a hook for user that returns the user

import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

const Context = createContext<User | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser({
          id: "1",
          name: "John Doe",
          email: "jo",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return <Context.Provider value={user}>{children}</Context.Provider>;
};

export const useUser = () => {
  const user = useContext(Context);
  return { user };
};
