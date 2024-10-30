import { Account, AppwriteException, Client , Storage } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

export const storage = new Storage(client);


export const getUserData = async () => {
  try {
    const account = new Account(client);
    const user = await account.get();
    return user;
  } catch (error) {
    const appwriteError = error as AppwriteException;
    // Log the error if needed, or handle it silently
    console.warn('Error fetching user data:', appwriteError.message); 
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
    console.warn('Login failed:', appwriteError.message);
    return null; // Return null or an object indicating failure
  }
};

export const logout = async () => {
  try {
    const account = new Account(client);
    return await account.deleteSession('current');
  } catch (error) {
    const appwriteError = error as AppwriteException;
    // Handle logout error without throwing
    console.warn('Logout failed:', appwriteError.message);
    return null; // Return null or an object indicating failure
  }
};

export const register = async (email: string, password: string) => {
  try {
    const account = new Account(client);
    return await account.create('unique()', email, password);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    // Handle registration error without throwing
    console.warn('Registration failed:', appwriteError.message);
    return null; // Return null or an object indicating failure
  }
};

export default client;
