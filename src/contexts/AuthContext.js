"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Make sure to wrap your app with <AuthProvider>"
    );
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.log("No active session");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Check if there's already an active session
      try {
        const currentUser = await account.get();
        if (currentUser) {
          console.log("🔄 Active session detected, clearing it first...");
          await account.deleteSession("current");
        }
      } catch (sessionError) {
        // No active session, that's fine
        console.log("No active session to clear");
      }

      // Now create new session
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      console.log("✅ Login successful:", currentUser);
      return currentUser;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const newUser = await account.create("unique()", email, password, name);
      // Auto-login after registration
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      console.log("✅ Registration successful:", currentUser);
      return currentUser;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // If there's no session, that's actually fine - they're already logged out
      if (
        !error.message.includes("session") &&
        !error.message.includes("401")
      ) {
        throw error;
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
