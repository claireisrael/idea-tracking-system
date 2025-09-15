"use client";

import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../lib/appwrite";

export default function Home() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // See if user is already logged in when page loads
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.log("No active session");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const session = await loginUser(formData.email, formData.password);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log("✅ Login successful:", currentUser);
      } else {
        // Register
        const newUser = await registerUser(
          formData.email,
          formData.password,
          formData.name
        );
        console.log("✅ Registration successful:", newUser);

        // Auto-login after registration
        const session = await loginUser(formData.email, formData.password);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log(
          "✅ Auto-login after registration successful:",
          currentUser
        );
      }
    } catch (error) {
      console.error("❌ Authentication error:", error);
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setFormData({ email: "", password: "", name: "" });
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            width: "400px",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "20px", color: "#333", fontSize: "28px" }}>
            💡 Idea Tracker
          </h1>
          <p style={{ marginBottom: "30px", color: "#666" }}>
            {isLogin
              ? "Sign in to track your brilliant ideas"
              : "Create an account to get started"}
          </p>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "15px",
                  margin: "10px 0",
                  border: "2px solid #e1e8ed",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                required
              />
            )}

            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "15px",
                margin: "10px 0",
                border: "2px solid #e1e8ed",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              required
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "15px",
                  margin: "10px 0",
                  border: "2px solid #e1e8ed",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  paddingRight: "50px",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "20px",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                !loading && (e.target.style.transform = "scale(1.02)")
              }
              onMouseOut={(e) =>
                !loading && (e.target.style.transform = "scale(1)")
              }
            >
              {loading
                ? "⏳ Please wait..."
                : isLogin
                ? "🚀 Sign In"
                : "✨ Create Account"}
            </button>
          </form>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setFormData({ email: "", password: "", name: "" });
            }}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              marginTop: "20px",
              fontSize: "14px",
              textDecoration: "underline",
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up here"
              : "Already have an account? Sign in here"}
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
