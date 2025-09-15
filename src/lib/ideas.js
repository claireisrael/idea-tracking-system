import { databases, DATABASE_ID, IDEAS_COLLECTION_ID, Query } from "./appwrite";
import { Permission, Role } from "appwrite";

// Add a new idea to the database
export const createIdea = async (ideaData, userId) => {
  try {
    console.log("Database Configuration:", {
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      endpoint: "https://appwrite.nrep.ug/v1",
      envDatabaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      envCollectionId: process.env.NEXT_PUBLIC_APPWRITE_IDEAS_COLLECTION_ID,
    });

    console.log("Creating document with data:", ideaData);

    const idea = await databases.createDocument(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      "unique()",
      {
        Title: ideaData.title,
        description: ideaData.description,
        status: ideaData.status,
        userId: userId,
        createdAt: new Date().toISOString(),
        attachments: ideaData.attachments || "",
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
    return idea;
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error;
  }
};

// Fetch all ideas from the database
export const getIdeas = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.limit(100), // Keeping it to 100 for now
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }
};

// Edit an existing idea
export const updateIdea = async (ideaId, ideaData) => {
  try {
    const idea = await databases.updateDocument(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      ideaId,
      {
        Title: ideaData.title,
        description: ideaData.description,
        status: ideaData.status,
        attachments: ideaData.attachments || "",
      }
    );
    return idea;
  } catch (error) {
    console.error("Error updating idea:", error);
    throw error;
  }
};

// Remove an idea from the database
export const deleteIdea = async (ideaId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, IDEAS_COLLECTION_ID, ideaId);
    return true;
  } catch (error) {
    console.error("Error deleting idea:", error);
    throw error;
  }
};

// Look for ideas by searching in titles
export const searchIdeas = async (searchTerm) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [Query.search("title", searchTerm), Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error searching ideas:", error);
    throw error;
  }
};

// Get ideas filtered by category
export const getIdeasByCategory = async (category) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [Query.equal("category", category), Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching ideas by category:", error);
    throw error;
  }
};

// Get ideas filtered by status
export const getIdeasByStatus = async (status) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [Query.equal("status", status), Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching ideas by status:", error);
    throw error;
  }
};

// Calculate some basic stats for the dashboard
export const getIdeasStats = async () => {
  try {
    const allIdeas = await getIdeas();

    const stats = {
      total: allIdeas.length,
      "in-progress": allIdeas.filter((idea) => idea.status === "in-progress")
        .length,
      Completed: allIdeas.filter((idea) => idea.status === "Completed").length,
      "on-hold": allIdeas.filter((idea) => idea.status === "on-hold").length,
      byStatus: {
        "in-progress": allIdeas.filter((idea) => idea.status === "in-progress")
          .length,
        Completed: allIdeas.filter((idea) => idea.status === "Completed")
          .length,
        "on-hold": allIdeas.filter((idea) => idea.status === "on-hold").length,
      },
      byPriority: {
        high: allIdeas.filter((idea) => idea.priority === "high").length,
        medium: allIdeas.filter((idea) => idea.priority === "medium").length,
        low: allIdeas.filter((idea) => idea.priority === "low").length,
      },
      byCategory: {},
    };

    // Count how many ideas in each category
    allIdeas.forEach((idea) => {
      stats.byCategory[idea.category] =
        (stats.byCategory[idea.category] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Error getting ideas stats:", error);
    throw error;
  }
};
