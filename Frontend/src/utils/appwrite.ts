import {
  Account,
  AppwriteException,
  Client,
  Databases,
  ID,
  Storage,
} from "appwrite";
import { Operations } from "../types/image_operations";

const databaseID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const bucketID = import.meta.env.VITE_APPWRITE_BUCKET;

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

export const storage = new Storage(client);

const databases = new Databases(client);

export const createImageMetadata = async (
  file_id: string,
  operations: Operations
) => {
  try {
    const response = await databases.createDocument(
      databaseID,
      collectionID,
      file_id,
      {
        file_id,
        operations,
        created_at: Date.now(),
        progress_state: "initiated",
      }
    );
    return response;
  } catch (error) {
    const appwriteError = error as AppwriteException;
    console.warn("Error creating image metadata:", appwriteError.message);
    return null;
  }
};

export const saveImage = ( operations : Operations , file : File) =>{
  const id = ID.unique();
  try {
    createImageMetadata(id, operations);
    addToBucket(file, id);
    return id;
  }
  catch (error) {
    console.warn("Error saving image:", error);
  }
}


export const addToBucket = async (file : File , file_id : string) => {
  try{
    const result = await storage.createFile(
      bucketID, // bucketId
      file_id, // fileId
      file,
  );
  return result;
  }
  catch (error) {
    const appwriteError = error as AppwriteException;
    console.warn("Error uploading file to bucket:", appwriteError.message);
    return null;
  }
}


export const getUserData = async () => {
  try {
    const account = new Account(client);
    const user = await account.get();
    return user;
  } catch (error) {
    const appwriteError = error as AppwriteException;
    // Log the error if needed, or handle it silently
    console.warn("Error fetching user data:", appwriteError.message);
    return null; // Return null to indicate the user is not logged in
  }
};

export const login = async (email: string, password: string) => {
  try {
    const account = new Account(client);
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    // Handle login error without throwing
    console.warn("Login failed:", appwriteError.message);
    return null; // Return null or an object indicating failure
  }
};

export const logout = async () => {
  try {
    const account = new Account(client);
    return await account.deleteSession("current");
  } catch (error) {
    const appwriteError = error as AppwriteException;
    // Handle logout error without throwing
    console.warn("Logout failed:", appwriteError.message);
    return null; // Return null or an object indicating failure
  }
};

export const register = async (email: string, password: string) => {
  try {
    const account = new Account(client);
    return await account.create("unique()", email, password);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    // Handle registration error without throwing
    console.warn("Registration failed:", appwriteError.message);
    return null; // Return null or an object indicating failure
  }
};

export default client;
