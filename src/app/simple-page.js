"use client";

import { useState } from "react";

export default function SimplePage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple demo login
    setUser({ name: email.split("@")[0], email });
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
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
          <h1 style={{ marginBottom: "20px", color: "#333" }}>
            💡 Idea Tracker
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                margin: "10px 0",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
              }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                margin: "10px 0",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <header
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#333" }}>💡 Idea Tracker</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>
            Welcome back, {user.name}! 👋
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <main
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>💭</div>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Your idea vault is empty
        </h2>
        <p style={{ marginBottom: "30px", color: "#666" }}>
          Every great innovation starts with a single idea. What's yours?
        </p>
        <button
          onClick={() => alert("🎉 Idea creation feature coming soon!")}
          style={{
            padding: "15px 30px",
            background: "#51cf66",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚀 Create Your First Idea
        </button>
      </main>
    </div>
  );
}
