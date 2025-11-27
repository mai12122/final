import{ Client, Databases, ID } from "appwrite";
import { Account } from 'appwrite';

const client = new Client();
export const account = new Account(client)
client
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

export const config = {
    db: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    col: {
        log: process.env.EXPO_PUBLIC_APPWRITE_COL_LOG_ID,
    },
};

export {ID};