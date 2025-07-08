import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, register } from "../api";

// PUBLIC_INTERFACE
/**
 * AuthPage handles both login and register UI.
 */
function AuthPage({ onAuth }) {
  const nav = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(email, pw);
        onAuth(true);
        nav("/bounties");
      } else {
        await register(email, pw);
        onAuth(true);
        nav("/bounties");
      }
    } catch (err) {
      setError(isLogin ? "Invalid credentials" : "Registration failed");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 340,
        margin: "50px auto",
        background: "var(--bg-secondary)",
        borderRadius: 20,
        boxShadow: "0 2px 20px #eee",
        padding: 32,
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: 5 }}>
        {isLogin ? "Login" : "Create an Account"}
      </h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          required
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          minLength={6}
          required
          value={pw}
          onChange={e => setPw(e.target.value)}
          style={inputStyle}
        />
        {error && (
          <div style={{ color: "indianred", margin: "10px 0" }}>{error}</div>
        )}
        <button
          style={{
            ...inputStyle,
            background: "var(--button-bg)",
            color: "var(--button-text)",
            fontWeight: 700,
            marginTop: 8,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
          type="submit"
          disabled={loading}
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <div style={{ marginTop: 16, fontSize: 14 }}>
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <a href="/register" style={{ color: "#3e4247" }}>Register</a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#3e4247" }}>Login</a>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  margin: "12px 0",
  padding: 12,
  borderRadius: 8,
  border: "1px solid var(--border-color)",
  fontSize: 16,
};

export default AuthPage;

