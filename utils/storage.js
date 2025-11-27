import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const LOCAL_NOTIF_KEY = 'local_notifications_v1';

async function pushLocalNotificationEntry(entry) {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_NOTIF_KEY);
    const current = raw ? JSON.parse(raw) : [];
    const next = [entry, ...current];
    await AsyncStorage.setItem(LOCAL_NOTIF_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('pushLocalNotificationEntry', e);
  }
}

async function scheduleLocalNotification(title, body) {
  try {
    // schedule a quick local notification for immediate feedback
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: 1 },
    });
  } catch (e) {
    console.warn('scheduleLocalNotification', e);
  }
}

const CLASSES_KEY = '@joined_classes';
const QUIZZES_KEY = '@joined_quizzes';

export const joinClass = async (classData) => {
  try {
    const existing = await getJoinedClasses();
    const exists = existing.some(c => c.code === classData.code);
    if (exists) return false;

    const updated = [classData, ...existing];
    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(updated));
    // create a local notification entry and schedule a quick local notification
    const entry = { id: `class-${Date.now()}`, title: 'Joined class', body: `${classData.name}`, time: new Date().toLocaleString(), unread: true };
    pushLocalNotificationEntry(entry);
    scheduleLocalNotification(entry.title, `You joined ${classData.name}`);
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
    const entry = { id: `quiz-${Date.now()}`, title: 'Joined quiz', body: `${quizData.name}`, time: new Date().toLocaleString(), unread: true };
    pushLocalNotificationEntry(entry);
    scheduleLocalNotification(entry.title, `You joined ${quizData.name}`);
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