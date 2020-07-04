import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';
import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  {
    /* implementar melhor depois */
  }
  /* if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  } */

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
