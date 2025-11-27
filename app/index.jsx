import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

const Home = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth');
      } else {

        router.replace('/home');
      }
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' }}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
};

export default Home;