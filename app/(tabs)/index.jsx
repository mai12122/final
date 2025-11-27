import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import {
  Search as SearchIcon,
  Bell as BellIcon,
  BookOpen as ClassIcon,
  Zap as QuizIcon,
  Flame as FlameIcon,
  Trophy as TrophyIcon,
  AlertCircle as AlertIcon,
} from 'lucide-react-native'; 

import { joinClass, joinQuiz, getJoinedClasses, getJoinedQuizzes } from '../../../lesson03/utils/storage';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

export default function StudentHomeScreen() {
    const [classes, setClasses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUpcomingAlert, setShowUpcomingAlert] = useState(false);
    const [upcomingLessons, setUpcomingLessons] = useState([]);
    const [studentName, setStudentName] = useState("Student");
    const [profileImage, setProfileImage] = useState('https://d.ibtimes.com/en/full/4464408/stray-kids-felix.jpg?w=1600&h=1200&q=88&f=c43706df5e2f56272f7f56dba1c82bea');
    const streakDays = 7;
    const avgScore = 84;

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try {
                    const user = await AsyncStorageLib.getItem("user");
                    if (user) {
                        const userData = JSON.parse(user);
                        setStudentName(userData.displayName || "Student");
                        if (userData.profileImage) {
                            setProfileImage(userData.profileImage);
                        }
                    }
                } catch (error) {
                    console.error("Error loading user data:", error);
                }

                try {
                    const loadedClasses = await getJoinedClasses();
                    const loadedQuizzes = await getJoinedQuizzes();
                    setClasses(loadedClasses);
                    setQuizzes(loadedQuizzes);
                    const upcoming = loadedClasses.slice(0, 3); 
                    if (upcoming.length > 0) {
                        setUpcomingLessons(upcoming);
                        setShowUpcomingAlert(true);
                    }
                } catch (error) {
                    console.error("Error loading classes/quizzes:", error);
                }
            };
            load();
        }, [])
    );

    const handleJoinClass = async (classData) => {
        const success = await joinClass(classData);
        if (success) {
            setClasses(prev => [classData, ...prev]);
            Alert.alert('✅ Success', `Joined ${classData.name}`);
        } else {
            Alert.alert('ℹ️ Already Joined', 'You are already in this class.');
        }
    };

    const handleJoinQuiz = async (quizData) => {
        const success = await joinQuiz(quizData);
        if (success) {
            setQuizzes(prev => [quizData, ...prev]);
            Alert.alert('🎯 Success', `Joined ${quizData.name}`);
        } else {
            Alert.alert('ℹ️ Already Joined', 'You have already joined this quiz.');
        }
    };

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.lecturer && c.lecturer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredQuizzes = quizzes.filter(q =>
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.classCode && q.classCode.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const allItems = [
        ...filteredClasses.map(c => ({ ...c, type: 'class', status: null })),
        ...filteredQuizzes.map(q => ({ 
            ...q, 
            type: 'quiz', 
            status: 'Live'  
        })),
    ].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));

    return (
        <SafeAreaView style={styles.container}>
            {/* Upcoming Lessons Alert */}
            {showUpcomingAlert && upcomingLessons.length > 0 && (
                <View style={styles.upcomingAlertContainer}>
                    <View style={styles.alertHeader}>
                        <AlertIcon size={20} color="#F59E0B" strokeWidth={2} />
                        <Text style={styles.alertTitle}>Upcoming Lessons</Text>
                        <TouchableOpacity onPress={() => setShowUpcomingAlert(false)}>
                            <Text style={styles.alertClose}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.upcomingList}
                    >
                        {upcomingLessons.map((lesson, index) => (
                            <View key={lesson.code || index} style={styles.upcomingCard}>
                                <Text style={styles.upcomingLessonName} numberOfLines={1}>
                                    {lesson.name}
                                </Text>
                                <Text style={styles.upcomingLessonBy} numberOfLines={1}>
                                    by {lesson.lecturer || 'Instructor'}
                                </Text>
                                <Text style={styles.upcomingTime}>Today</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <Image 
                        key={profileImage}
                        source={{ uri: profileImage }} 
                        style={styles.avatar}
                        onError={() => console.log('Image failed to load:', profileImage)}
                    />
                </TouchableOpacity>

                <View style={styles.searchContainer}>
                    <SearchIcon size={18} color="#888" strokeWidth={2} />
                    <TextInput 
                        placeholder="Search classes or quizzes" 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* 🔔 Notifications button */}
                <TouchableOpacity 
                    style={styles.bellButton}
                    onPress={() => router.push('/(tabs)/notifications')} 
                >
                    <BellIcon size={22} color="#444" strokeWidth={2} />
                </TouchableOpacity>
            </View>

            <View style={styles.headerSection}>
                <Text style={styles.welcomeText}>
                    Hi, <Text style={styles.nameText}>{studentName}</Text>
                </Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBadge}>
                        <FlameIcon size={16} color="#FF6B35" strokeWidth={2.5} />
                        <Text style={styles.statLabel}>{streakDays}d streak</Text>
                    </View>
                    <View style={styles.statBadge}>
                        <TrophyIcon size={16} color="#2563EB" strokeWidth={2.5} />
                        <Text style={styles.statLabel}>{avgScore}% avg</Text>
                    </View>
                </View>
            </View>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.joinClassButton]}
                        onPress={() => router.push('/joinClass')}
                    >
                        <Text style={styles.actionButtonText}>➕ Join Class</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.joinQuizButton]}
                        onPress={() => router.push('/joinQuiz')}
                    >
                        <Text style={styles.actionButtonText}>🎯 Join Quiz</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>
                    {allItems.length > 0 ? ' Classes & Quizzes' : 'Get Started'}
                </Text>

                <View style={styles.classesList}>
                    {allItems.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No classes or quizzes yet.</Text>
                            <Text style={styles.emptySubtitle}>
                                Join a class or quiz! Your streak and progress will show up here!
                            </Text>
                        </View>
                    ) : (
                        allItems.map(item => (
                            <TouchableOpacity 
                                key={item.id || item.code}
                                style={styles.classCard}
                                onPress={() => {
                                    if (item.type === 'class') {
                                        router.push({
                                            pathname: '/class',
                                            params: { classId: item.code, className: item.name }
                                        });
                                    } else {
                                        router.push({
                                            pathname: '/quiz',
                                            params: { quizId: item.code, quizName: item.name }
                                        });
                                    }
                                }}
                                activeOpacity={0.92}
                            >
                                <View style={item.type === 'class' ? styles.classIconBg : styles.quizIconBg}>
                                    {item.type === 'class' ? (
                                        <ClassIcon size={20} color="#fff" strokeWidth={2} />
                                    ) : (
                                        <QuizIcon size={20} color="#fff" strokeWidth={2} />
                                    )}
                                </View>

                                <View style={styles.classInfo}>
                                    <Text style={styles.className} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.metaText} numberOfLines={1}>
                                        {item.type === 'class' 
                                            ? `by ${item.lecturer || '—'}` 
                                            : `Class: ${item.classCode || '—'}`}
                                    </Text>
                                </View>

                                {item.status === 'Live' && (
                                    <View style={styles.liveBadge}>
                                        <Text style={styles.liveText}>● Live</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EAECF0',
        elevation: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 14,
        borderWidth: 2,
        borderColor: '#F1F5F9',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 42,
        marginHorizontal: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        marginLeft: 10,
    },
    bellButton: {
        padding: 6,
        marginLeft: 6,
    },
    headerSection: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    nameText: {
        fontWeight: '800',
        color: '#1E40AF',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statLabel: {
        fontSize: 13,
        color: '#475569',
        marginLeft: 5,
        fontWeight: '500',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    joinClassButton: {
        backgroundColor: '#3B82F6', 
    },
    joinQuizButton: {
        backgroundColor: '#10B981', 
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 18,
        paddingLeft: 4,
    },
    classesList: {
        marginBottom: 24,
    },
    classCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    classIconBg: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    quizIconBg: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    metaText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 3,
    },
    liveBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    liveText: {
        color: '#D97706',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 30,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    upcomingAlertContainer: {
        backgroundColor: '#FEF3C7',
        borderBottomWidth: 1,
        borderBottomColor: '#F59E0B',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#D97706',
        marginLeft: 8,
        flex: 1,
    },
    alertClose: {
        fontSize: 20,
        color: '#D97706',
        fontWeight: '700',
    },
    upcomingList: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    upcomingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        marginRight: 10,
        minWidth: 140,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    upcomingLessonName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    upcomingLessonBy: {
        fontSize: 11,
        color: '#64748B',
        marginBottom: 6,
    },
    upcomingTime: {
        fontSize: 11,
        fontWeight: '600',
        color: '#D97706',
    },
});
