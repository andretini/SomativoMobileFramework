import React, { FC, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import { PLACEHOLDER_IMAGE, TMDB_IMAGE_URL } from '../constants';
import { useMovies } from '../contexts/MovieContext';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../styles';
import { MovieDetailScreenProps, MovieDetails } from '../types';

const MovieDetailScreen: FC<MovieDetailScreenProps> = ({ movie, onNavigate }) => {
  const { addMovieToUserList } = useMovies();
  const { currentUser } = useAuth();

  const initialRating = 'userRating' in movie ? String(movie.userRating ?? '') : '';
  const [rating, setRating] = useState(initialRating);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const posterUri = useMemo(
    () => (movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE),
    [movie.poster_path]
  );

  const handleSaveMovie = async () => {
    if (!currentUser) {
      Alert.alert('Login necessário', 'Faça login para salvar filmes.');
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    setMessage('');

    // Normalize "8,5" -> 8.5
    const normalized = rating.replace(',', '.').trim();
    const parsed = Number(normalized);

    // guard + clamp
    const userRating = Number.isFinite(parsed) ? Math.max(0, Math.min(10, parsed)) : NaN;

    if (Number.isNaN(userRating)) {
      const m = 'Por favor, insira uma nota válida de 0 a 10.';
      setMessage(m);
      Alert.alert('Erro de Avaliação', m);
      setIsSaving(false);
      return;
    }

    const movieDetailsToSend: MovieDetails = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    };

    try {
      const result = await addMovieToUserList(movieDetailsToSend, userRating);
      if (result.success) {
        Alert.alert('Sucesso', result.message);
        onNavigate('MyMovies');
      } else {
        setMessage(result.message);
        Alert.alert('Erro', result.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.detailScrollContent}>
      <View style={styles.detailCard}>
        <Image style={styles.detailPoster} source={{ uri: posterUri }} resizeMode="cover" />
        <View style={styles.detailInfo}>
          <Text style={styles.detailTitle}>{movie.title}</Text>
          <Text style={styles.detailOverview}>{movie.overview || 'Sinopse não disponível.'}</Text>

          <View style={styles.ratingBox}>
            <Text style={styles.ratingLabel}>Minha Avaliação (0-10):</Text>
            <TextInput
              style={styles.ratingInput}
              placeholder="8.5"
              value={rating}
              onChangeText={setRating}
              keyboardType="decimal-pad"
              maxLength={4}
            />
            {!!message && <Text style={styles.messageText}>{message}</Text>}
            <Button
              title={isSaving ? 'Salvando…' : 'Salvar Filme e Avaliar'}
              onPress={handleSaveMovie}
              disabled={isSaving || !currentUser}
              style={{ opacity: isSaving || !currentUser ? 0.7 : 1, backgroundColor: '#10b981' }}
            />
          </View>

          <Button title="Voltar" variant="link" onPress={() => onNavigate('Search')} />
        </View>
      </View>
    </ScrollView>
  );
};

export default MovieDetailScreen;
