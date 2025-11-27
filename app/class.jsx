import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { findClassByCode } from '../constants/Data';
import { leaveClass } from '../utils/storage';
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
  const mockLectures = [
    { id: 'l1', title: 'Introduction to Algorithms', meta: '12 min • Watched' },
    { id: 'l2', title: 'Time Complexity Analysis', meta: '18 min • Not started' },
    { id: 'l3', title: 'Sorting Algorithms', meta: '25 min • Not started' },
  ];

  const mockAssignments = [
    { id: 'a1', title: 'Homework 1: Big-O Practice', due: 'Today', status: 'Submitted', color: '#16a34a' },
    { id: 'a2', title: 'Quiz 1: Algorithm Basics', due: 'In 2 days', status: 'Pending', color: '#ea580c' },
    { id: 'a3', title: 'Project: Sorting Visualizer', due: 'In 1 week', status: 'Not started', color: '#4f46e5' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.heroImage}>
          <Text style={styles.heroText}>🎓</Text>
        </View>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{classData.name}</Text>
            <Text style={styles.subtitle}>by {classData.lecturer}</Text>
          </View>
          <TouchableOpacity
            style={styles.leaveBtn}
            onPress={() => {
              Alert.alert(
                'Leave class',
                'Are you sure you want to leave this class?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        const ok = await leaveClass(classCode);
                        if (ok) {
                          Alert.alert('Left', 'You have left the class');
                          router.push('/');
                        } else {
                          Alert.alert('Error', 'Could not leave the class');
                        }
                      } catch (e) {
                        console.warn('leaveClass', e);
                        Alert.alert('Error', 'Unexpected error');
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.leaveTxt}>Leave</Text>
          </TouchableOpacity>
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
        {/* render active content */}
        {activeTab === 'overview' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What will I learn?</Text>
            <Text style={styles.description}>
              This course offers a solid foundation in {classData.name.split(':')[1]?.trim() || 'this subject'}.
              You'll get lectures, exercises and projects. Taught by {classData.lecturer}.
            </Text>
          </View>
        )}

        {activeTab === 'lectures' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lectures</Text>
            {mockLectures.map(l => (
              <View key={l.id} style={styles.rowItem}>
                <Ionicons name="play-circle" size={20} color="#3b82f6" />
                <View style={styles.rowContent}>
                  <Text style={styles.rowTitle}>{l.title}</Text>
                  <Text style={styles.rowMeta}>{l.meta}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'assignments' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assignments</Text>
            {mockAssignments.map(a => (
              <TouchableOpacity
                key={a.id}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/assignment', params: { classId: classCode } })}
              >
                <View style={[styles.cardBadge, { backgroundColor: a.color + '22' }]}>
                  <Ionicons name="document-text" size={18} color={a.color} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{a.title}</Text>
                  <Text style={styles.cardMeta}>{a.status} • {a.due}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.deadline}>{a.due}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (activeTab === 'assignments') {
              router.push({ pathname: '/assignment', params: { classId: classCode } });
            } else if (activeTab === 'lectures') {
              Alert.alert('Coming Soon', 'Lecture videos will be available soon.');
            } else {
              router.push('/notifications');
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {activeTab === 'assignments' ? 'View Assignments' : 'View All'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowContent: {
    marginLeft: 12,
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  rowMeta: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eef2ff',
  },
  cardBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardMeta: {
    color: '#6b7280',
    marginTop: 6,
    fontSize: 13,
  },
  cardRight: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  deadline: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
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
  leaveBtn: {
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginLeft: 12,
  },
  leaveTxt: {
    color: '#dc2626',
    fontWeight: '700',
  },
});