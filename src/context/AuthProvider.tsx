import { createContext, useState, useContext, ReactNode } from "react";
import { message } from "antd";
import { apiLogin } from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem("isAuthenticated") === "true" // 从 localStorage 恢复状态
  );

  // 登录函数
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    if (username && password) {
      await apiLogin({ username, password });
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true"); // 保存登录状态到 localStorage
      message.success("Login successful");
      return true;
    } else {
      message.error("Invalid username or password");
      return false;
    }
  };

  // 登出函数
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // 清除登录状态
    message.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
