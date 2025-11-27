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
  Calendar as CalendarIcon,
} from 'lucide-react-native'; 

import { getJoinedClasses } from '../../utils/storage';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

export default function AssignmentsScreen() {
    const [assignments, setAssignments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [studentName, setStudentName] = useState("Student");
    const [profileImage, setProfileImage] = useState('https://d.ibtimes.com/en/full/4464408/stray-kids-felix.jpg?w=1600&h=1200&q=88&f=c43706df5e2f56272f7f56dba1c82bea');

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
                    const mockAssignments = loadedClasses.flatMap(c => [
                        {
                            id: `${c.code}-assign1`,
                            name: c.name,
                            title: 'Assignment 1',
                            deadline: '11.02.2025',
                            classCode: c.code,
                            lecturer: c.lecturer,
                        },
                        {
                            id: `${c.code}-assign2`,
                            name: c.name,
                            title: 'Assignment 2',
                            deadline: '11.02.2025',
                            classCode: c.code,
                            lecturer: c.lecturer,
                        }
                    ]);
                    setAssignments(mockAssignments);
                } catch (error) {
                    console.error("Error loading assignments:", error);
                }
            };
            load();
        }, [])
    );

    const filteredAssignments = assignments.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
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
                        placeholder="Search assignments" 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity 
                    style={styles.bellButton}
                    onPress={() => router.push('/(tabs)/notifications')} 
                >
                    <BellIcon size={22} color="#444" strokeWidth={2} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.assignmentsList}>
                    {filteredAssignments.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No assignments yet.</Text>
                            <Text style={styles.emptySubtitle}>
                                Join a class to see assignments!
                            </Text>
                        </View>
                    ) : (
                        filteredAssignments.map(assignment => (
                            <TouchableOpacity 
                                key={assignment.id}
                                style={styles.assignmentCard}
                                activeOpacity={0.85}
                                onPress={() => {
                                    Alert.alert(`${assignment.name}`, `${assignment.title}\nDeadline: ${assignment.deadline}`);
                                }}
                            >
                                <View style={styles.cardContent}>
                                    <Text style={styles.assignmentTitle} numberOfLines={2}>
                                        {assignment.name}
                                    </Text>
                                    <View style={styles.deadlineContainer}>
                                        <CalendarIcon size={14} color="#6B7280" strokeWidth={2} />
                                        <Text style={styles.deadlineText}>Deadline: {assignment.deadline}</Text>
                                    </View>
                                </View>
                                <View style={styles.thumbnailContainer}>
                                    <View style={styles.thumbnail} />
                                </View>
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
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    assignmentsList: {
        marginBottom: 24,
    },
    assignmentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    cardContent: {
        flex: 1,
        marginRight: 12,
    },
    assignmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
    deadlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    deadlineText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    thumbnailContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
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
});