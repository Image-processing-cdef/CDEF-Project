import {
  Account,
  AppwriteException,
  Client,
  Databases,
  ID,
  Storage,
} from "appwrite";
import { Operations} from "../types/image_operations";

export const databaseID = import.meta.env.VITE_APPWRITE_DATABASE;
export const collectionID = import.meta.env.VITE_APPWRITE_COLLECTION;
const bucketID = import.meta.env.VITE_APPWRITE_BUCKET;
const resizing = import.meta.env.VITE_APPWRITE_RESIZING_COLLECTION;
const restoration = import.meta.env.VITE_APPWRITE_RESTORATION_COLLECTION;
const adjustments = import.meta.env.VITE_APPWRITE_ADJUSTMENT_COLLECTION;
const operationsID = import.meta.env.VITE_APPWRITE_OPERATIONS_COLLECTION;

export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

export const storage = new Storage(client);

const databases = new Databases(client);

export const createImageMetadata = async (
  file_id: string,
  operations: Operations
) => {
  try {
    const restorationDoc = await databases.createDocument(
      databaseID,
      restoration, // collection ID for restoration
      ID.unique(),
      {
        upscale: operations.restoration.upscale,
        polish: operations.restoration.polish,
      }
    );

    const resizingDoc = await databases.createDocument(
      databaseID,
      resizing, // collection ID for resizing
      ID.unique(),
      {
        width: operations.resizing.width,
        height: operations.resizing.height,
        smart_cropping: operations.resizing.smart_cropping,
      }
    );

    const adjustmentsDoc = await databases.createDocument(
      databaseID,
      adjustments, // collection ID for adjustments
      ID.unique(),
      {
        hdr: operations.adjustments.hdr,
      }
    );

    const operations_doc = await databases.createDocument(
      databaseID,
      operationsID, // collection ID for operations
      ID.unique(),
      {
        restoration: restorationDoc.$id, // Relation ID for restoration
        resizing: resizingDoc.$id, // Relation ID for resizing
        adjustment: adjustmentsDoc.$id, // Relation ID for adjustments
        background_removal: operations.background_removal,
        object_detection: operations.object_detection,
        image_compression: operations.image_compression,
      }
    );

    // Creating final image metadata document
    const response = await databases.createDocument(
      databaseID,
      collectionID,
      file_id,
      {
        file_id,
        operations: operations_doc.$id,
        progress_state: "initiated",
      }
    );
    console.log(response);

    return response;
  } catch (error) {
    const appwriteError = error as AppwriteException;
    console.warn("Error creating image metadata:", appwriteError.message);
    return null;
  }
};

export const saveImage = async (operations: Operations, file: File) => {
  const id = ID.unique();
  try {
    await createImageMetadata(id, operations);
    await addToBucket(file, id);
    return id;
  } catch (error) {
    console.warn("Error saving image:", error);
  }
};

export const fetchImageStatus = async (id: string) => {
  const documentID = id;
  try {
    const response = await databases.getDocument(
      databaseID,
      collectionID,
      documentID
    );

    const output_image_url =
      response.progress_state === "completed"
        ? response.output_image_url
        : null;
    const object_image_url =
      response.progress_state === "completed"
        ? response.object_image_url
        : null;

    return {
      status: response.progress_state,
      output_image_url,
      object_image_url,
    };
  } catch (error) {
    const appwriteError = error as AppwriteException;
    console.warn("Error fetching image status:", appwriteError.message);
    return null;
  }
};

export const imageCleanup = async (file_id: string) => {
  try {
    const response = await databases.deleteDocument(
      databaseID,
      collectionID,
      file_id
    );
    const bucketCleanup = await storage.deleteFile(bucketID, file_id);

    return {
      response,
      bucketCleanup,
    };
  } catch (error) {
    const appwriteError = error as AppwriteException;
    console.warn("Error deleting image metadata:", appwriteError.message);
    return null;
  }
};

export const addToBucket = async (file: File, file_id: string) => {
  try {
    const result = await storage.createFile(
      bucketID, // bucketId
      file_id, // fileId
      file
    );
    return result;
  } catch (error) {
    const appwriteError = error as AppwriteException;
    console.warn("Error uploading file to bucket:", appwriteError.message);
    return null;
  }
};

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


