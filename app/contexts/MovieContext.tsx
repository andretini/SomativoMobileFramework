import React, { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { Storage } from '../constants';
import { MovieContextType, UserMovie } from '../types';
import { useAuth } from './AuthContext';

const MovieContext = createContext<MovieContextType | null>(null);
export const useMovies = () => {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error('useMovies must be used within a MovieProvider');
    }
    return context;
};

export const MovieProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [myMovies, setMyMovies] = useState<UserMovie[]>([]);

  const getAllMoviesFromStorage = async (): Promise<UserMovie[]> => {
    const moviesJson = await Storage.getItem('user_movies');
    return moviesJson ? JSON.parse(moviesJson) : [];
  };

  const saveAllMoviesToStorage = async (movies: UserMovie[]): Promise<void> => {
    await Storage.setItem('user_movies', JSON.stringify(movies));
  };

  const loadUserMovies = async () => {
    if (!currentUser) {
      setMyMovies([]);
      return;
    }
    const allMovies = await getAllMoviesFromStorage();
    const userMovies = allMovies.filter((m) => m.userId === currentUser.id);
    setMyMovies(userMovies);
  };

  const addMovieToUserList: MovieContextType['addMovieToUserList'] = async (movieDetails, rating) => {
    if (!currentUser) return { success: false, message: "Usuário não logado." };

    const allMovies = await getAllMoviesFromStorage();
    
    const newMovie: UserMovie = {
      ...movieDetails,
      userId: currentUser.id,
      userRating: rating,
      savedAt: Date.now(),
    };

    const existingIndex = allMovies.findIndex(
      (m) => m.id === movieDetails.id && m.userId === currentUser.id
    );

    let newMoviesList: UserMovie[];
    if (existingIndex > -1) {
      allMovies[existingIndex] = newMovie;
      newMoviesList = allMovies;
    } else {
      newMoviesList = [...allMovies, newMovie];
    }

    await saveAllMoviesToStorage(newMoviesList);
    await loadUserMovies(); 
    return { success: true, message: "Filme salvo com sucesso!" };
  };

  useEffect(() => {
    loadUserMovies();
  }, [currentUser]);

  const value = useMemo<MovieContextType>(
    () => ({
      myMovies,
      addMovieToUserList,
    }),
    [myMovies, currentUser]
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};