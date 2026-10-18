import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth";
import "./AuthScreen.css";

const AuthScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const isRegister = location.pathname === "/register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextEmail = email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail);
    const passwordOk = password.length >= 6;
    setInvalidEmail(!emailOk);
    setInvalidPassword(!passwordOk);

    if (!emailOk || !passwordOk) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const message = isRegister
      ? await signUp(nextEmail, password)
      : await signIn(nextEmail, password);
    setSubmitting(false);

    if (message) {
      setInvalidEmail(true);
      setInvalidPassword(true);
      setError(message);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className={isRegister ? "auth-screen auth-register" : "auth-screen auth-login"}>
      <div className="auth-hero">
        <span>{isRegister ? "New account" : "Sharelist"}</span>
        <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
        <p>{isRegister ? "Save lists on this device after you register." : "Log in to open your lists."}</p>
      </div>

      <form onSubmit={submit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            className={invalidEmail ? "invalid" : undefined}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setInvalidEmail(false);
            }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="At least 6 characters"
            className={invalidPassword ? "invalid" : undefined}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setInvalidPassword(false);
            }}
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : isRegister ? "Register" : "Log in"}
        </button>
      </form>

      {isRegister ? (
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      ) : (
        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      )}
    </main>
  );
};

export default AuthScreen;
