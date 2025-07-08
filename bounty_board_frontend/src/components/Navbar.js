import React from "react";
import { Link, useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * Render site main navigation bar.
 * @param {{isLoggedIn: boolean, onLogout: Function}} props
 */
function Navbar({ isLoggedIn, onLogout }) {
  const nav = useNavigate();
  return (
    <nav
      className="navbar"
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        padding: "12px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 600,
      }}
    >
      <div style={{ marginLeft: 24, fontSize: 22, color: "#fbc02d" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#fbc02d" }}>
          🤑 BountyHub
        </Link>
      </div>
      <div style={{ marginRight: 24 }}>
        <Link to="/bounties" style={{ marginRight: 18 }}>Bounties</Link>
        {isLoggedIn && (
          <>
            <Link to="/post" style={{ marginRight: 18 }}>Post</Link>
            <Link to="/dashboard" style={{ marginRight: 18 }}>Dashboard</Link>
            <button
              style={{
                background: "var(--button-bg)",
                color: "var(--button-text)",
                fontWeight: "bold",
                marginLeft: 8,
                border: 0,
                borderRadius: 6,
                padding: "7px 16px",
                cursor: "pointer",
              }}
              onClick={() => {
                onLogout();
                nav("/login");
              }}
            >
              Logout
            </button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

