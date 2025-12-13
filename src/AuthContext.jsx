import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");
    const storedToken = localStorage.getItem("token");

    if (storedPlayer && storedToken) {
      setPlayer(JSON.parse(storedPlayer));
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("player");
    localStorage.removeItem("token");
    setPlayer(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ player, token, setPlayer, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
