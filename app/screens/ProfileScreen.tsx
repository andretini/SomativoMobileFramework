import React, { FC } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../styles';
import { NavigationProps } from '../types';

const ProfileScreen: FC<NavigationProps> = () => {
  const { currentUser, logout, isLoading } = useAuth();

  if (isLoading || !currentUser) {
    return <ActivityIndicator size="large" color="#3b82f6" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>Perfil</Text>
      <View style={styles.profileCard}>
        <Image
          style={styles.profileImageLarge}
          source={{ uri: currentUser.profilePicUri }}
        />
        <Text style={styles.profileName}>{currentUser.name}</Text>
        <Text style={styles.profileEmail}>{currentUser.email}</Text>
        <Button
          title="Sair (Logout)"
          variant="danger"
          onPress={logout}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;