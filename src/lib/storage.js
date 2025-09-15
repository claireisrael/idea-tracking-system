import { Client, Storage, ID } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://appwrite.nrep.ug/v1")
  .setProject("6892271e0028b4fed84f");

export const storage = new Storage(client);

// My storage bucket ID
export const STORAGE_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "68b69aaa00336b7f1657";

// Upload files to Appwrite storage
export const uploadFile = async (file, onProgress) => {
  try {
    console.log("📁 Uploading file to storage:", file.name);

    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file,
      undefined,
      onProgress
    );

    console.log("✅ File uploaded successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    throw error;
  }
};

// Get file preview URL
export const getFileView = (fileId) => {
  try {
    return storage.getFileView(STORAGE_BUCKET_ID, fileId);
  } catch (error) {
    console.error("❌ Error getting file view:", error);
    return null;
  }
};

// Get file download URL
export const getFileDownload = (fileId) => {
  try {
    return storage.getFileDownload(STORAGE_BUCKET_ID, fileId);
  } catch (error) {
    console.error("❌ Error getting file download:", error);
    return null;
  }
};

// Remove file from storage
export const deleteFile = async (fileId) => {
  try {
    console.log("🗑️ Deleting file from storage:", fileId);
    await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    console.log("✅ File deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    throw error;
  }
};
