import { Client, Account, Databases, Query } from "appwrite";

// Setting up my Appwrite client instance connection
const client = new Client();

client
  .setEndpoint("https://appwrite.nrep.ug/v1")
  .setProject("6892271e0028b4fed84f");

// Creating the services I'll need for auth and database
export const account = new Account(client);
export const databases = new Databases(client);

// My database IDs - from environment variables only
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const IDEAS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_IDEAS_COLLECTION_ID;

// Tools for database queries
export { Query };
