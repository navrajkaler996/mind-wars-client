import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PublicRoute = ({ children }) => {
  const { player } = useContext(AuthContext);

  console.log(player);
  if (player) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
