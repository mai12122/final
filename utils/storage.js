import AsyncStorage from '@react-native-async-storage/async-storage';

const CLASSES_KEY = '@joined_classes';
const QUIZZES_KEY = '@joined_quizzes';

export const joinClass = async (classData) => {
  try {
    const existing = await getJoinedClasses();
    const exists = existing.some(c => c.code === classData.code);
    if (exists) return false;

    const updated = [classData, ...existing];
    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error joining class:', error);
    return false;
  }
};

export const getJoinedClasses = async () => {
  try {
    const data = await AsyncStorage.getItem(CLASSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading classes:', error);
    return [];
  }
};

export const leaveClass = async (code) => {
  try {
    const existing = await getJoinedClasses();
    const updated = existing.filter(c => c.code !== code);
    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error leaving class:', error);
    return false;
  }
};

export const joinQuiz = async (quizData) => {
  try {
    const existing = await getJoinedQuizzes();
    const exists = existing.some(q => q.code === quizData.code);
    if (exists) return false;

    const updated = [quizData, ...existing];
    await AsyncStorage.setItem(QUIZZES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error joining quiz:', error);
    return false;
  }
};

export const getJoinedQuizzes = async () => {
  try {
    const data = await AsyncStorage.getItem(QUIZZES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return [];
  }
};

export const exitQuiz = async (code) => {
  try {
    const existing = await getJoinedQuizzes();
    const updated = existing.filter(q => q.code !== code);
    await AsyncStorage.setItem(QUIZZES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error exiting quiz:', error);
    return false;
  }
};