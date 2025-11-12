export const TMDB_API_KEY = 'cd6818f5882f0947dc3547a6ca8b882f'; 
export const TMDB_API_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export const PLACEHOLDER_IMAGE =
  'https://placehold.co/150x225/2d3748/e2e8f0?text=Filme';
export const PROFILE_PLACEHOLDER =
  'https://placehold.co/100x100/4a5568/e2e8f0?text=Perfil';

let memoryStore: { [key: string]: string } = {};

export const Storage = {
  getItem: async (key: string): Promise<string | null> => {
    return memoryStore[key] || null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    memoryStore[key] = value;
  },
};