import React, { createContext } from "react";
import { IUserClient } from "../types/IUserClient";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user/getUser";

export interface IAuthContext {
  error: Error | null;
  isLoading: boolean;
  user?: IUserClient | null;
  isAuthenticated: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<unknown, Error>>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
    staleTime: Infinity,
    retry: 0,
  });
  let isAuthenticated;

  if (isSuccess) {
    isAuthenticated = !!user.id;
  }
  console.log("user", user);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated as boolean,
        user,
        isLoading,
        error,
        refetch,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
