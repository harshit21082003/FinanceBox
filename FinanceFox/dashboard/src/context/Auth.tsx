import { Toaster } from "@/components/ui/toaster";
import { VERIFY_USER_ROUTE } from "@/constants/urls";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, User } from "@/interfaces/Auth";
import { _get } from "@/utils/network";
import { get, set } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setAuth] = useState(false);

  const login = (token: string) => {
    set("token", token);
    fetchData();
  };

  const logout = () => {
    set("token", "");
    setUser(undefined);
    setAuth(false);
    navigate("/login");
  };

  const fetchData = async () => {
    setLoading(true);
    const token = get("token");

    if (token) {
      const resp = await _get(VERIFY_USER_ROUTE);
      const data = resp.data;
      if (data.success) {
        setUser({ email: data.data.email, _id: data.data._id });
        setAuth(true);
      } else {
        toast({
          title: "Error occured",
          description: data.errors[0],
          variant: "destructive",
        });
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      <Toaster />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
