
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { joinClass } from '../utils/storage'; 
import { CLASS_CATALOG, findClassByCode } from '../constants/Data'; 

export default function JoinClassroomScreen() {
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const handleJoin = async () => {
    const code = classCode.trim();

    if (!code) {
      Alert.alert('Invalid Code', 'Please enter a class code.');
      return;
    }

    setLoading(true);

    try {
      const targetClass = findClassByCode(code);

      if (!targetClass) {
        Alert.alert(
          'Class Not Found',
          `No class found with code "${code}". Try FEC201, CS305, or MATH202.`,
          [{ text: 'OK' }]
        );
        return;
      }

      const success = await joinClass(targetClass);

      if (success) {
        Alert.alert(
          '✅ Success!',
          `You’ve joined:\n${targetClass.name}`,
          [
            { 
              text: 'Go to Class', 
              onPress: () => {
                router.push({
                  pathname: '/class',
                  params: { 
                    classId: targetClass.code,
                    className: targetClass.name,
                  },
                });
              },
              style: 'default',
            },
            {
              text: 'Home',
              onPress: () => router.replace('/(tabs)/home'),
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert(
          'ℹ️ Already Enrolled',
          `You’re already in ${targetClass.name}.`,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Join class error:', error);
      Alert.alert(
        '⚠️ Failed to Join',
        'Something went wrong. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: handleJoin },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🎓</Text>
          </View>

          <Text style={styles.title}>Join a Classroom</Text>
          <Text style={styles.subtitle}>
            Enter the class code provided by your instructor
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. FEC201"
              value={classCode}
              onChangeText={setClassCode}
              autoCapitalize="characters"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={handleJoin}
              maxLength={10}
              editable={!loading}
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity 
              style={[
                styles.joinButton, 
                loading && styles.joinButtonLoading
              ]} 
              onPress={handleJoin}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.joinButtonText}>Joining...</Text>
              ) : (
                <Text style={styles.joinButtonText}>Join</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.tip}>
            💡 Tip: Ask your lecturer for the class code — it's usually 5–7 letters/numbers.
          </Text>

          <View style={styles.examples}>
            <Text style={styles.examplesTitle}>Try these demo codes:</Text>
            <View style={styles.codeList}>
              <Text style={styles.code}>• FEC201</Text>
              <Text style={styles.code}>• CS305</Text>
              <Text style={styles.code}>• MATH202</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 20,
  //   paddingVertical: 16,
  //   backgroundColor: '#fff',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#e5e7eb',
  //   elevation: 1,
  // },
  // headerTitle: {
  //   fontSize: 20,
  //   fontWeight: '700',
  //   color: '#1e293b',
  // },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  joinButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonLoading: {
    backgroundColor: '#93c5fd',
    opacity: 0.9,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tip: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    marginBottom: 30,
  },
  examples: {
    alignItems: 'center',
  },
  examplesTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  codeList: {
    flexDirection: 'row',
    gap: 20,
  },
  code: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});