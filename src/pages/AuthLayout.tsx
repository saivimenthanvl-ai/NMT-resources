import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "./auth.css";

export default function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">{title}</h1>

        {/* top tabs */}
        <div className="auth-tabs">
          <Link className={`auth-tab ${isLogin ? "active" : ""}`} to="/login">Login</Link>
          <Link className={`auth-tab ${!isLogin ? "active" : ""}`} to="/signup">Signup</Link>
          <span
            className="auth-tab-slider"
            style={{ left: isLogin ? "4px" : "calc(50% + 4px)" }}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
