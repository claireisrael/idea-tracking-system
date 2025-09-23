"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        router.push("/login");
      } catch (error) {
        console.error("❌ Logout error:", error);
        // Even if logout fails, redirect to login
        router.push("/login");
      }
    };

    handleLogout();
  }, [logout, router]);

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
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <h1 style={{ marginBottom: "20px", color: "#333", fontSize: "28px" }}>
          👋 Logging Out
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Please wait while we log you out...
        </p>
      </div>
    </div>
  );
}
