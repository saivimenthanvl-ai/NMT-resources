import { Routes, Route, Navigate } from "react-router-dom";
import Protected from "./auth/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Protected><Home/></Protected>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
