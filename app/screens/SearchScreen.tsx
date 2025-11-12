import { FC, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import MovieItem from '../components/MovieItem';
import { TMDB_API_KEY, TMDB_API_URL } from '../constants';
import { styles } from '../styles';
import { MovieDetails, NavigationProps, UserMovie } from '../types';

interface SearchScreenProps extends NavigationProps {
    onSelectMovie: (movie: MovieDetails | UserMovie) => void;
}

const SearchScreen: FC<SearchScreenProps> = ({ onSelectMovie, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isApiConfigured = TMDB_API_KEY !== 'SUA_CHAVE_API_TMDB_AQUI';

  const searchMovies = async () => {
    if (query.trim() === '') {
        Alert.alert("Atenção", "Por favor, digite um termo de busca.");
        setResults([]);
        return;
    }
    if (!isApiConfigured) {
        Alert.alert("Configuração Necessária", "Por favor, configure sua chave de API do TMDb em src/constants.ts.");
        setResults([]);
        return;
    }
    
    setIsLoading(true);
    setResults([]); 
    try {
      const response = await fetch(
        `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&language=pt-BR`
      );
      const data = await response.json();
      const filteredResults: MovieDetails[] = (data.results || [])
        .filter((movie: MovieDetails) => movie.poster_path && movie.title);
        
      setResults(filteredResults);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro de Busca', 'Não foi possível buscar os filmes. Verifique sua conexão.');
    }
    setIsLoading(false);
  };
  
  const handleSelect = (movie: MovieDetails | UserMovie) => {
    onSelectMovie(movie);
    onNavigate('Details');
  }

  return (
    <View style={styles.screenPadding}>
      <Text style={styles.headerTitle}>Buscar Filmes</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome do filme..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMovies}
        />
        <Button title="Buscar" onPress={searchMovies} style={styles.searchButton} />
      </View>
      
      {!isApiConfigured && (
        <Text style={styles.errorText}>⚠️ Configure a chave TMDB\_API\_KEY em src/constants.ts.</Text>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loading} />
      ) : (
        <ScrollView style={styles.resultsList}>
          {results.length > 0 ? (
            results.map((item) => (
              <MovieItem item={item} key={item.id} onPress={handleSelect} isSaved={false} />
            ))
          ) : (
            <Text style={styles.emptyText}>
                {query.length > 0 ? "Nenhum resultado encontrado." : "Use a barra de busca acima para encontrar filmes."}
            </Text>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
};

export default SearchScreen;