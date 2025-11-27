import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { findClassByCode } from '../constants/Data';
import React, { useState } from 'react';

export default function ClassDetailScreen() {
  const { classId } = useLocalSearchParams();
  const router = useRouter();

  const classCode = Array.isArray(classId) ? classId[0] : classId;
  const classData = classCode ? findClassByCode(classCode) : null;

  const [activeTab, setActiveTab] = useState('overview');

  if (!classData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Class Not Found</Text>
          <Text style={styles.errorSubtitle}>
            No class found with code "{classCode}".
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  const content = {
    overview: (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What will I learn?</Text>
        <Text style={styles.description}>
          This course offers a solid foundation in {classData.name.split(':')[1]?.trim() || 'this subject'}.
          You'll gain work-ready skills through lectures, coding exercises, and real-world projects.
          Taught by {classData.lecturer}.
        </Text>
      </View>
    ),
    lectures: (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lectures</Text>
        <View style={styles.lectureItem}>
          <Ionicons name="play-circle-outline" size={20} color="#3b82f6" />
          <View style={styles.lectureInfo}>
            <Text style={styles.lectureTitle}>Introduction to Algorithms</Text>
            <Text style={styles.lectureMeta}>12 min • Watched</Text>
          </View>
        </View>
        <View style={styles.lectureItem}>
          <Ionicons name="play-circle-outline" size={20} color="#94a3b8" />
          <View style={styles.lectureInfo}>
            <Text style={styles.lectureTitle}>Time Complexity Analysis</Text>
            <Text style={styles.lectureMeta}>18 min • Not started</Text>
          </View>
        </View>
        <View style={styles.lectureItem}>
          <Ionicons name="play-circle-outline" size={20} color="#94a3b8" />
          <View style={styles.lectureInfo}>
            <Text style={styles.lectureTitle}>Sorting Algorithms</Text>
            <Text style={styles.lectureMeta}>25 min • Not started</Text>
          </View>
        </View>
      </View>
    ),
    assignments: (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assignments</Text>
        <View style={styles.assignmentItem}>
          <View style={[styles.assignmentStatus, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
          </View>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>Homework 1: Big-O Practice</Text>
            <Text style={styles.assignmentMeta}>Due today • Submitted</Text>
          </View>
        </View>
        <View style={styles.assignmentItem}>
          <View style={[styles.assignmentStatus, { backgroundColor: '#ffedd5' }]}>
            <Ionicons name="time-outline" size={16} color="#ea580c" />
          </View>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>Quiz 1: Algorithm Basics</Text>
            <Text style={styles.assignmentMeta}>Due in 2 days • Pending</Text>
          </View>
        </View>
        <View style={styles.assignmentItem}>
          <View style={[styles.assignmentStatus, { backgroundColor: '#e0e7ff' }]}>
            <Ionicons name="document-text-outline" size={16} color="#4f46e5" />
          </View>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>Project: Sorting Visualizer</Text>
            <Text style={styles.assignmentMeta}>Due in 1 week • Not started</Text>
          </View>
        </View>
      </View>
    ),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.heroImage}>
          <Text style={styles.heroText}>🎓</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>{classData.name}</Text>
          <Text style={styles.subtitle}>by {classData.lecturer}</Text>
        </View>
        <View style={styles.tabs}>
          {['overview', 'lectures', 'assignments'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {content[activeTab]}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (activeTab === 'assignments') {
              router.push('/joinQuiz');
            } else if (activeTab === 'lectures') {
              Alert.alert('Coming Soon', 'Lecture videos will be available soon.');
            } else {
              router.push('/notifications');
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {activeTab === 'assignments' ? 'Join New Quiz' : 'View All'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heroImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  heroText: {
    fontSize: 60,
    color: '#1e40af',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  lectureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lectureInfo: {
    marginLeft: 12,
    flex: 1,
  },
  lectureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  lectureMeta: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  assignmentStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  assignmentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  assignmentMeta: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  // Action Button
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});