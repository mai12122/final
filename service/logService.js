import { config, databases, ID } from "./appwriteConfig";
import { Query } from "appwrite";

export const getLogs = async() => {
  try {
    const response = await databases.listDocuments(config.db, config.col.log)
    return response
  } catch (error) {
    throw error
  }
}


export const getLogByUserId = async(userId) => {
  try {
    const response = await databases.listDocuments(config.db, config.col.log, [
      Query.equal('userId', userId)
    ])
    return response
  } catch (error) {
    throw error
  }
}

export const addLog = async (title, userId) => {
   try {
     const newLog = await databases.createDocument(
           config.db,
           config.col.log,
           ID.unique(),
           { title, completed: false, userId}
       )
       return newLog
   } catch (error) {
       throw error
   }
}

export const removeLog = async (id) => {
   try {
       await databases.deleteDocument(config.db,
config.col.log, id)
   } catch (error) {
       throw error
   }
}


export const toggleLog = async (id, completed) => {
   try {
       const updatedLog = await databases.updateDocument(
           config.db,
           config.col.log,
           id,
           { completed: !completed }
       )
       return updatedLog
   } catch (error) {
       throw error
   }
}

export const getLogById = async (id) => {
    const response = await databases.getDocument(config.db, config.col.log, id);
    return response;
};

export const updateLog = async (id, data) => {
    const updatedLog = databases.updateDocument(
        config.db,
        config.col.log,
        id, 
        data
    )
    return updatedLog;
};

