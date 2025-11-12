import React, { FC } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../components/Button';
import MovieItem from '../components/MovieItem';
import { useMovies } from '../contexts/MovieContext';
import { styles } from '../styles';
import { MovieDetails, NavigationProps, UserMovie } from '../types';

interface MyMoviesScreenProps extends NavigationProps {
    onSelectMovie: (movie: MovieDetails | UserMovie) => void;
}

const MyMoviesScreen: FC<MyMoviesScreenProps> = ({ onSelectMovie, onNavigate }) => {
  const { myMovies } = useMovies();

  const handleSelect = (movie: MovieDetails | UserMovie) => {
    onSelectMovie(movie);
    onNavigate('Details');
  }

  return (
    <View style={styles.screenPadding}>
      <Text style={styles.headerTitle}>Meus Filmes ({myMovies.length})</Text>
      
      {myMovies.length === 0 ? (
        <View style={styles.emptyList}>
          <Text style={styles.emptyText}>
            Você ainda não adicionou nenhum filme à sua lista.
          </Text>
          <Button
            title="Buscar Filmes Agora"
            variant="secondary"
            onPress={() => onNavigate('Search')}
          />
        </View>
      ) : (
        <ScrollView style={styles.resultsList}>
          {myMovies.slice().sort((a, b) => b.savedAt - a.savedAt).map((item) => (
            <MovieItem item={item} key={`${item.id}-${item.savedAt}`} onPress={handleSelect} isSaved={true} />
          ))}
          <View style={{ height: 100 }} /> 
        </ScrollView>
      )}
    </View>
  );
};

export default MyMoviesScreen;