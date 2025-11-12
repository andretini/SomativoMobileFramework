import React, { FC } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ScreenName } from '../types';

interface BottomNavProps {
    currentScreen: ScreenName;
    onNavigate: (screen: ScreenName) => void;
}

const BottomNav: FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const NavItem: FC<{ screen: ScreenName; label: string }> = ({ screen, label }) => {
    const isActive = currentScreen === screen;
    const color = isActive ? '#3b82f6' : '#6b7280';
    
    const icons: Record<ScreenName, string> = {
      Search: '🔍',
      MyMovies: '🔖',
      Profile: '👤',
      Login: '🏠',
      Register: '📝',
      Details: '⭐',
    };

    return (
      <TouchableOpacity
        onPress={() => onNavigate(screen)}
        style={styles.navItem as ViewStyle}
      >
        <Text style={{ fontSize: 24, color }}>{icons[screen]}</Text>
        <Text style={{ fontSize: 12, color, fontWeight: isActive ? 'bold' : 'normal' } as TextStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bottomNav as ViewStyle}>
      <NavItem screen="Search" label="Buscar" />
      <NavItem screen="MyMovies" label="Meus Filmes" />
      <NavItem screen="Profile" label="Perfil" />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
});

export default BottomNav;