export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  profilePicUri: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
}

export interface UserMovie extends MovieDetails {
  userId: string;
  userRating: number;
  savedAt: number;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (name: string, email: string, password: string, profilePicUri: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
}

export interface MovieContextType {
  myMovies: UserMovie[];
  addMovieToUserList: (movieDetails: MovieDetails, rating: number) => Promise<{ success: boolean; message: string }>;
}

export type ScreenName = 'Login' | 'Register' | 'Search' | 'Details' | 'MyMovies' | 'Profile';

export interface NavigationProps {
  onNavigate: (screen: ScreenName) => void;
  onSelectMovie?: (movie: MovieDetails | UserMovie) => void;
}

export interface MovieDetailScreenProps extends NavigationProps {
  movie: MovieDetails | UserMovie;
}
