import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MovieProvider } from './contexts/MovieContext';
import BottomNav from './navigation/BottomNav';
import LoginScreen from './screens/LoginScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import MyMoviesScreen from './screens/MyMoviesScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import SearchScreen from './screens/SearchScreen';
import { styles } from './styles';
import { MovieDetails, ScreenName, UserMovie } from './types';

const App: FC = () => {
  const { currentUser, isLoading } = useAuth();
  
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | UserMovie | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (currentUser && (currentScreen === 'Login' || currentScreen === 'Register')) {
      setCurrentScreen('Search');
    } else if (!currentUser && currentScreen !== 'Register') {
      setCurrentScreen('Login');
    }
  }, [currentUser, isLoading, currentScreen]);

  const navigate = (screenName: ScreenName) => {
    setCurrentScreen(screenName);
  };

  const renderScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )
    }

    if (!currentUser) {
      switch (currentScreen) {
        case 'Register':
          return <RegisterScreen onNavigate={navigate} />;
        case 'Login':
        default:
          return <LoginScreen onNavigate={navigate} />;
      }
    }

    switch (currentScreen) {
      case 'Search':
        return <SearchScreen onNavigate={navigate} onSelectMovie={setSelectedMovie} />;
      case 'Details':
        // Assertiva de tipo para garantir que selectedMovie não é null
        if (!selectedMovie) return <SearchScreen onNavigate={navigate} onSelectMovie={setSelectedMovie} />; 
        return <MovieDetailScreen movie={selectedMovie} onNavigate={navigate} />;
      case 'MyMovies':
        return <MyMoviesScreen onNavigate={navigate} onSelectMovie={setSelectedMovie} />;
      case 'Profile':
        return <ProfileScreen onNavigate={navigate} />;
      default:
        return <SearchScreen onNavigate={navigate} onSelectMovie={setSelectedMovie} />;
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderScreen()}
      {currentUser && (
        <BottomNav currentScreen={currentScreen} onNavigate={navigate} />
      )}
    </View>
  );
};

const AppWrapper: FC = () => {
  return (
    <AuthProvider>
      <MovieProvider>
        <App />
      </MovieProvider>
    </AuthProvider>
  );
}

export default AppWrapper;