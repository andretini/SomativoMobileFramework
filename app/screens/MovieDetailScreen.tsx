import React, { FC, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import { PLACEHOLDER_IMAGE, TMDB_IMAGE_URL } from '../constants';
import { useMovies } from '../contexts/MovieContext';
import { styles } from '../styles';
import { MovieDetailScreenProps } from '../types';

const MovieDetailScreen: FC<MovieDetailScreenProps> = ({ movie, onNavigate }) => {
  const { addMovieToUserList } = useMovies();
  
  const initialRating = 'userRating' in movie ? movie.userRating.toString() : '';
  const [rating, setRating] = useState<string>(initialRating);
  const [message, setMessage] = useState('');
  
  const handleSaveMovie = async () => {
    setMessage('');
    
    const userRating = parseFloat(rating.replace(',', '.').trim()); 

    if (isNaN(userRating) || userRating < 0 || userRating > 10) {
      setMessage('Por favor, insira uma nota válida de 0 a 10.');
      Alert.alert("Erro de Avaliação", "Por favor, insira uma nota válida de 0 a 10.");
      return;
    }
    
    const movieDetailsToSend = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
    };

    const result = await addMovieToUserList(movieDetailsToSend, userRating);
    
    if (result.success) {
      Alert.alert('Sucesso', result.message);
      onNavigate('MyMovies'); 
    } else {
      setMessage(result.message);
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.detailScrollContent}>
      <View style={styles.detailCard}>
        <Image
          style={styles.detailPoster}
          source={{
            uri: movie.poster_path
              ? `${TMDB_IMAGE_URL}${movie.poster_path}`
              : PLACEHOLDER_IMAGE,
          }}
          resizeMode="cover"
        />
        <View style={styles.detailInfo}>
          <Text style={styles.detailTitle}>{movie.title}</Text>
          <Text style={styles.detailOverview}>{movie.overview || "Sinopse não disponível."}</Text>

          <View style={styles.ratingBox}>
            <Text style={styles.ratingLabel}>Minha Avaliação (0-10):</Text>
            <TextInput
              style={styles.ratingInput}
              placeholder="8.5"
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
              maxLength={4}
            />
            {message ? <Text style={styles.messageText}>{message}</Text> : null}
            <Button 
                title="Salvar Filme e Avaliar" 
                onPress={handleSaveMovie} 
                style={{ backgroundColor: '#10b981' }} 
            />
          </View>
          <Button
            title="Voltar"
            variant="link"
            onPress={() => onNavigate('Search')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default MovieDetailScreen;