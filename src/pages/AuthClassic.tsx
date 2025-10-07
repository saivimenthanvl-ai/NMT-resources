import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./auth-classic.css"; // CSS below

export default function AuthClassic() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (password !== confirm) throw new Error("Passwords do not match");
        await signup(email, password);
      }
      navigate("/");
    } catch (e: any) {
      setErr(e?.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-bg-grad">
      <div className="wrapper">
        <div className="title-text">
          <div className={`title login ${mode === "login" ? "active" : ""}`}>Login Form</div>
          <div className={`title signup ${mode === "signup" ? "active" : ""}`}>Signup Form</div>
        </div>

        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" id="login" checked={mode === "login"} readOnly />
            <input type="radio" id="signup" checked={mode === "signup"} readOnly />
            <label
              htmlFor="login"
              className={`slide login ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </label>
            <label
              htmlFor="signup"
              className={`slide signup ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Signup
            </label>
            <div className="slider-tab" style={{ left: mode === "signup" ? "50%" : 0 }} />
          </div>

          <div
            className="form-inner"
            style={{ marginLeft: mode === "signup" ? "-50%" : "0%" }}
          >
            {/* LOGIN */}
            <form className="login" onSubmit={onSubmit}>
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pass-link"><a href="#">Forgot password?</a></div>

              {err && <div className="auth-error">{err}</div>}

              <div className="field btn">
                <div className="btn-layer" />
                <input type="submit" value={busy ? "Logging in…" : "Login"} disabled={busy} />
              </div>

              <div className="signup-link">
                Not a member?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); }}>
                  Signup now
                </a>
              </div>
            </form>

            {/* SIGNUP */}
            <form className="signup" onSubmit={onSubmit}>
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              {err && <div className="auth-error">{err}</div>}

              <div className="field btn">
                <div className="btn-layer" />
                <input type="submit" value={busy ? "Signing up…" : "Signup"} disabled={busy} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
