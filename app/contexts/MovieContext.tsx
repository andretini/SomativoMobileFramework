// src/contexts/MovieContext.tsx
import React, { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MovieContextType, MovieDetails, UserMovie } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../libs/firebase';

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';

const MovieContext = createContext<MovieContextType | null>(null);

export const useMovies = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovies must be used within a MovieProvider');
  return ctx;
};

export const MovieProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [myMovies, setMyMovies] = useState<UserMovie[]>([]);
  const unsubRef = useRef<() => void>();

  // Start/stop realtime listener when user changes
  useEffect(() => {
    // cleanup previous listener
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = undefined;
    }

    if (!currentUser) {
      setMyMovies([]);
      return;
    }

    const col = collection(db, 'user_movies');
    const q = query(
      col,
      where('userId', '==', currentUser.id)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: UserMovie[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        items.push({
          id: data.id,
          title: data.title,
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date,
          userId: data.userId,
          userRating: data.userRating,
          // convert Firestore Timestamp -> number (ms) to match your type
          savedAt:
            typeof data.savedAt === 'number'
              ? data.savedAt
              : (data.savedAt?.toMillis?.() ?? Date.now()),
        });
      });
      setMyMovies(items);
    });

    unsubRef.current = unsub;
    return () => unsub();
  }, [currentUser]);

  const addMovieToUserList: MovieContextType['addMovieToUserList'] = async (
    movieDetails: MovieDetails,
    rating: number
  ) => {
    if (!currentUser) return { success: false, message: 'Usuário não logado.' };

    // Stable doc id so this acts like UPSERT for the user+movie
    const docId = `${currentUser.id}_${movieDetails.id}`;
    const ref = doc(db, 'user_movies', docId);

    await setDoc(
      ref,
      {
        // MovieDetails (exact field names)
        id: movieDetails.id,
        title: movieDetails.title,
        overview: movieDetails.overview,
        poster_path: movieDetails.poster_path,
        release_date: movieDetails.release_date,

        // user-scoped fields
        userId: currentUser.id,
        userRating: rating,
        savedAt: serverTimestamp(), // Firestore Timestamp (listener converts to number)
      },
      { merge: true }
    );

    return { success: true, message: 'Filme salvo com sucesso!' };
  };

  const value = useMemo<MovieContextType>(
    () => ({
      myMovies,
      addMovieToUserList,
    }),
    [myMovies]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};
