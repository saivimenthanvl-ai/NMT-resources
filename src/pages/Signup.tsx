import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthLayout from "./AuthLayout";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) return setErr("Passwords do not match");
    setBusy(true);
    try {
      await signup(email.trim(), password);
      nav("/");
    } catch (e: any) {
      setErr(e?.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Signup Form">
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
            autoComplete="new-password"
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

        <div className="field">
          <input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {err && <div className="error">{err}</div>}

        <button className="btn-grad" disabled={busy}>
          {busy ? "Signing up…" : "Signup"}
        </button>

        <p className="below">
          Already have an account? <Link to="/login" className="link-strong">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
