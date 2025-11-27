import React, { useState, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { findQuizByCode } from '../constants/Data'; 

export default function JoinQuizScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleTextChange = (text, index) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text.toUpperCase();
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (index === 5 && text) {
      handleSubmit();
    }
  };

  const handleBackspace = (index) => {
    if (code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('').toUpperCase();

    if (fullCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-character quiz code.');
      return;
    }

    setLoading(true);

    try {
      const quiz = findQuizByCode(fullCode);

      if (!quiz) {
        Alert.alert(
          'Quiz Not Found',
          `No active quiz with code "${fullCode}". Try QZ42XX, QZ09YY, or QZ77ZZ.`,
          [{ text: 'OK' }]
        );
        return;
      }
      Alert.alert(
        '✅ Success!',
        `You’ve joined:\n"${quiz.name}"`,
        [
          { 
            text: 'Start Quiz', 
            onPress: () => {
              router.push({
                pathname: '/quiz',
                params: { 
                  quizId: quiz.id,
                  quizCode: quiz.code,
                  quizName: quiz.name,
                  classCode: quiz.classCode,
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
    } catch (error) {
      console.error('Join quiz error:', error);
      Alert.alert(
        '⚠️ Failed to Join',
        'Something went wrong. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: handleSubmit },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
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
            <Text style={styles.icon}>🎯</Text>
          </View>

          <Text style={styles.title}>Join a Quiz</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit quiz code provided by your instructor.
          </Text>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.filled : null,
                ]}
                value={digit}
                onChangeText={(text) => !loading && handleTextChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !loading) {
                    handleBackspace(index);
                  }
                }}
                keyboardType="default"
                maxLength={1}
                textAlign="center"
                autoFocus={index === 0}
                editable={!loading}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={[styles.clearText, loading && styles.clearDisabled]}>
              ❌ Clear
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.joinButton,
              loading && styles.joinButtonLoading
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.joinButtonText}>Join Quiz</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.tip}>
            ⚠️ Quiz codes are time-sensitive — make sure your lecturer has started it!
          </Text>

          <View style={styles.examples}>
            <Text style={styles.examplesTitle}>Try these demo codes:</Text>
            <View style={styles.codeList}>
              <Text style={styles.code}>• QZ42XX</Text>
              <Text style={styles.code}>• QZ09YY</Text>
              <Text style={styles.code}>• QZ77ZZ</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
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
    backgroundColor: '#f3e8ff',
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
    marginBottom: 24,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#a855f7',
    borderRadius: 8,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filled: {
    backgroundColor: '#ede9fe',
    borderColor: '#8b5cf6',
  },
  clearButton: {
    marginBottom: 16,
  },
  clearText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  clearDisabled: {
    color: '#ccc',
  },
  joinButton: {
    backgroundColor: '#a855f7',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#7e22ce',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonLoading: {
    backgroundColor: '#c4b5fd',
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
    marginBottom: 20,
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
    gap: 16,
  },
  code: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a855f7',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});