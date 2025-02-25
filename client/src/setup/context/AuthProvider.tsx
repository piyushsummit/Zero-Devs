import React, { createContext, useState, ReactNode } from "react";
export interface AuthInterface {
  name: string;
  id: string;
  email: string;
  accessToken: string;
}
export interface AuthContextProps {
  auth: AuthInterface;
  setAuth: React.Dispatch<React.SetStateAction<AuthInterface>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
  auth: {
    name: "",
    id: "",
    email: "",
    accessToken: "",
  },
  setAuth: () => null,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const storedAuthDetails = localStorage.getItem("auth");
  const prevAuthDetails = storedAuthDetails
    ? JSON.parse(storedAuthDetails)
    : null;

  const [auth, setAuth] = useState<AuthInterface>(prevAuthDetails);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
