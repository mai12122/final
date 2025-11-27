import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Image, ScrollView } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const AnuwatLogo = require('../../assets/images/anuwat.png');

const AuthScreen = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true); 
  const [emailOrUsername, setEmailOrUsername] = useState('nara123@gmail.com');
  const [password, setPassword] = useState('password123'); 
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [userType, setUserType] = useState('lecturer'); 

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(emailOrUsername, password);
        router.replace('/home');
      } else {
        if (password !== confirmPassword) {
          alert("Passwords don't match");
          return;
        }
        await register(emailOrUsername, password, name, username, dateOfBirth, userType);
        router.replace('/home');
      }
    } catch (err) {
      alert(err.message || 'Authentication failed');
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    if (isLogin) {
      setName('');
      setUsername('');
      setConfirmPassword('');
      setDateOfBirth('');
    } else {
      setEmailOrUsername('');
      setPassword('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={AnuwatLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.roleToggle}>
          <Pressable 
            style={[styles.toggleButton, userType === 'lecturer' && styles.activeToggle]}
            onPress={() => setUserType('lecturer')}
          >
            <Text style={[styles.toggleText, userType === 'lecturer' && styles.activeToggleText]}>
              Lecturer
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.toggleButton, userType === 'student' && styles.activeToggle]}
            onPress={() => setUserType('student')}
          >
            <Text style={[styles.toggleText, userType === 'student' && styles.activeToggleText]}>
              Student
            </Text>
          </Pressable>
        </View>

        {isLogin ? (
          <View style={styles.loginForm}>
            <Text style={styles.label}>USERNAME OR EMAIL</Text>
            <TextInput
              placeholder="enter name or email"
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />

            <Pressable style={styles.signInButton} onPress={handleSubmit}>
              <Text style={styles.signInButtonText}>SIGN IN</Text>
            </Pressable>

            <Pressable onPress={() => {}}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Pressable>

            <Pressable onPress={toggleView} style={styles.registerLink}>
              <Text style={styles.registerText}>Don’t have an account? </Text>
              <Text style={styles.registerLinkText}>Register</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.registerFormContainer}>
            <Text style={styles.sectionTitle}>Get Started Now</Text>
            <Text style={styles.sectionSubtitle}>Enter your Credentials to Create your account</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                placeholder="name"
                value={name}
                onChangeText={setName}
                style={styles.fieldInput}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                placeholder="xyz@xyz.com"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                style={styles.fieldInput}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.doubleFieldRow}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Username</Text>
                <TextInput
                  placeholder="username"
                  value={username}
                  onChangeText={setUsername}
                  style={[styles.halfInput, { marginRight: 6 }]}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <TextInput
                  placeholder="DD/MM/YYYY"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  style={[styles.halfInput, { marginLeft: 6, marginRight: 0 }]}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.doubleFieldRow}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  placeholder="enter ur password"
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.halfInput, { marginRight: 6 }]}
                  secureTextEntry
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Confirm Password</Text>
                <TextInput
                  placeholder="confirm it"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={[styles.halfInput, { marginLeft: 6, marginRight: 0 }]}
                  secureTextEntry
                />
              </View>
            </View>

            <Pressable style={styles.createAccountButton} onPress={handleSubmit}>
              <Text style={styles.createAccountButtonText}>Create account</Text>
            </Pressable>

            <Pressable onPress={toggleView} style={styles.backToLogin}>
              <Text style={styles.backToLoginText}>Already have an account? Sign in</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, 
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75, 
  },
  roleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginForm: {
    marginTop: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#F9FAFB',
  },
  signInButton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#2563EB',
    fontSize: 14,
    marginBottom: 20,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLinkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },

  registerFormContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  fieldRow: { marginBottom: 14 },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F9FAFB',
  },
  doubleFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  halfField: { flex: 1 },
  halfInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F9FAFB',
  },
  createAccountButton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  createAccountButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backToLogin: { alignItems: 'center' },
  backToLoginText: {
    color: '#2563EB',
    fontSize: 14,
  },
});