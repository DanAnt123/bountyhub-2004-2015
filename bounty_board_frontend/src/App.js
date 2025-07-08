import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import BountyList from "./pages/BountyList";
import PostBounty from "./pages/PostBounty";
import ClaimComplete from "./pages/ClaimComplete";
import Dashboard from "./pages/Dashboard";
import { logout as doLogout } from "./api";

// PUBLIC_INTERFACE
/**
 * Main App component including routing and UI layout.
 */
function App() {
  const [theme, setTheme] = useState("light");
  // Basic login state; consider using cookie/jwt for production
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!window.localStorage.getItem("bounty_is_loggedin")
  );

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  function handleAuth(loggedIn) {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      window.localStorage.setItem("bounty_is_loggedin", "1");
    } else {
      window.localStorage.removeItem("bounty_is_loggedin");
    }
  }

  return (
    <Router>
      <div className="App" style={{ minHeight: "100vh" }}>
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={() => {
            handleAuth(false);
            doLogout();
          }}
        />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/bounties" replace />}
          />
          <Route
            path="/bounties"
            element={<BountyList />}
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/bounties" replace />
              ) : (
                <AuthPage onAuth={handleAuth} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/bounties" replace />
              ) : (
                <AuthPage onAuth={handleAuth} />
              )
            }
          />
          <Route
            path="/post"
            element={isLoggedIn ? <PostBounty /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/claim"
            element={isLoggedIn ? <ClaimComplete /> : <Navigate to="/login" replace />}
          />
          <Route
            path="*"
            element={<div style={{padding:60}}>404 page</div>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
