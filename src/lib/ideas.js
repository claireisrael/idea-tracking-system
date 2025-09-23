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
    //appwrite function to create new record in databse(in this case an idea will be created in the databse)
    const idea = await databases.createDocument(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      "unique()",
      {
        Title: ideaData.title,
        description: ideaData.description,
        status: ideaData.status,
        userId: userId,
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

// Fetch all ideas from the database for a specific user currently logedin 0r signed up
export const getIdeas = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch ideas");
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [
        Query.equal("userId", userId), // Only get ideas for this specific user
        Query.orderDesc("$createdAt"),
        Query.limit(100), // at least load 100 for now
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

// Look for ideas by searching in titles for a specific user
export const searchIdeas = async (searchTerm, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to search ideas");
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [
        Query.equal("userId", userId), // Only search within user's ideas
        Query.search("Title", searchTerm), //using "Title" to match the field name in the database
        Query.orderDesc("$createdAt"),
      ]
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

// Get ideas filtered by status for a specific user
export const getIdeasByStatus = async (status, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch ideas by status");
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [
        Query.equal("userId", userId), // Only get ideas for this specific user
        Query.equal("status", status),
        Query.orderDesc("$createdAt"),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching ideas by status:", error);
    throw error;
  }
};

// Calculate some basic stats for the dashboard for a specific user
export const getIdeasStats = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to get ideas stats");
    }

    const allIdeas = await getIdeas(userId); // Get only user's ideas

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
