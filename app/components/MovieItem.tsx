import React, { FC } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PLACEHOLDER_IMAGE, TMDB_IMAGE_URL } from '../constants';
import { MovieDetails, UserMovie } from '../types';

interface MovieItemProps {
    item: MovieDetails | UserMovie;
    onPress: (item: MovieDetails | UserMovie) => void;
    isSaved?: boolean;
}

const MovieItem: FC<MovieItemProps> = ({ item, onPress, isSaved = false }) => {
  const isUserMovie = isSaved && 'userRating' in item;
  const userMovie = item as UserMovie;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/D';
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={isUserMovie ? styles.savedMovieItem : styles.movieItem}>
      <Image
        style={styles.moviePoster}
        source={{
          uri: item.poster_path
            ? `${TMDB_IMAGE_URL}${item.poster_path}`
            : PLACEHOLDER_IMAGE,
        }}
        resizeMode="cover"
      />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        
        {isUserMovie ? (
          <>
            <Text style={styles.movieRating}>
              Sua Nota: {userMovie.userRating.toFixed(1).replace('.', ',')}/10
            </Text>
            <Text style={styles.movieDate}>
              Salvo em: {formatDate(userMovie.savedAt)}
            </Text>
          </>
        ) : (
          <Text style={styles.movieRelease}>
            Lançamento: {item.release_date || 'N/D'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    movieItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        alignItems: 'center',
      },
      savedMovieItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
      },
      moviePoster: {
        width: 60,
        height: 90,
        borderRadius: 5,
        backgroundColor: '#e5e7eb',
      },
      movieDetails: {
        marginLeft: 10,
        flex: 1,
      },
      movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
      },
      movieRelease: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 4,
      },
      movieRating: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10b981',
        marginTop: 4,
      },
      movieDate: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 4,
      },
});

export default MovieItem;