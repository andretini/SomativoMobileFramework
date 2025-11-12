import React, { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { PROFILE_PLACEHOLDER, Storage } from '../constants';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUsersFromStorage = async (): Promise<User[]> => {
    const usersJson = await Storage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  };

  const saveUsersToStorage = async (users: User[]): Promise<void> => {
    await Storage.setItem('users', JSON.stringify(users));
  };

  const login: AuthContextType['login'] = async (email, password) => {
    const users = await getUsersFromStorage();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'E-mail ou senha inválidos.' };
  };

  const register: AuthContextType['register'] = async (name, email, password, profilePicUri) => {
    if (!name || !email || !password || !profilePicUri) {
      return { success: false, message: 'Todos os campos são obrigatórios.' };
    }
    const users = await getUsersFromStorage();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      profilePicUri: profilePicUri || PROFILE_PLACEHOLDER,
    };

    await saveUsersToStorage([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout: AuthContextType['logout'] = () => {
    setCurrentUser(null);
  };
  
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      login,
      register,
      logout,
      isLoading,
    }),
    [currentUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};