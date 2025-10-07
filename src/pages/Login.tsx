import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      nav("/");
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Login Form">
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field field-password">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="ghost"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="row-right">
          <Link to="#" className="muted">Forgot password?</Link>
        </div>

        {err && <div className="error">{err}</div>}

        <button className="btn-grad" disabled={busy}>
          {busy ? "Logging in…" : "Login"}
        </button>

        <p className="below">
          Not a member? <Link to="/signup" className="link-strong">Signup now</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
