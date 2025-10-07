import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function Protected({children}:{children:any}) {
  const {authed} = useAuth();
  return authed ? children : <Navigate to="/login" replace />;
}
