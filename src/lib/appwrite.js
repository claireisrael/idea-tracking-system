import { Client, Account, Databases, Query } from "appwrite";

// Setting up my Appwrite client connection
const client = new Client();

client
  .setEndpoint("https://appwrite.nrep.ug/v1")
  .setProject("6892271e0028b4fed84f");

// Creating the services I'll need for auth and database
export const account = new Account(client);
export const databases = new Databases(client);

// My database IDs - using env vars with fallbacks
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "68ac438700031c62fd5b";
export const IDEAS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_IDEAS_COLLECTION_ID ||
  "68ac444a000ed01d8405";

// Need this for database queries
export { Query };

// Function to check if someone is logged in
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

// Login function - had to handle session conflicts
export const loginUser = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    // Sometimes there's already a session, so I clear it first
    if (
      error.message.includes("session is active") ||
      error.message.includes("session is prohibited")
    ) {
      console.log("🔄 Active session detected, clearing it first...");
      try {
        await account.deleteSession("current");
        console.log("✅ Old session cleared, attempting login again...");
        return await account.createEmailPasswordSession(email, password);
      } catch (clearError) {
        console.log("⚠️ Could not clear session:", clearError.message);
        throw error; // Throw original error
      }
    }
    throw error;
  }
};

// Register new users - auto login after registration
export const registerUser = async (email, password, name) => {
  try {
    const user = await account.create("unique()", email, password, name);
    // Log them in right after creating account
    await loginUser(email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logoutUser = async () => {
  try {
    // Delete the current session
    await account.deleteSession("current");
    console.log("✅ Session deleted successfully");
  } catch (error) {
    console.log(
      "⚠️ Session delete error (might already be logged out):",
      error.message
    );
    // If there's no session, that's actually fine - they're already logged out
    if (!error.message.includes("session") && !error.message.includes("401")) {
      throw error;
    }
  }
};
