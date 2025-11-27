import { account, ID } from './appwriteConfig';

export const register = async (email, password, name) => {
  try {
    await account.create({ userId: ID.unique(), email, password, name });
    return await login(email, password);
  } catch (err) {
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    try {
      await account.deleteSessions();
    } catch (err) {

    }
    const session = await account.createEmailPasswordSession({ email, password });
    return session;

  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (err) {
    console.error(err);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch {
    return null;
  }
};
