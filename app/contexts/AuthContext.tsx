// src/contexts/AuthContext.tsx
import React, { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContextType, User } from '../types';
import { auth, db } from '../libs/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { PROFILE_PLACEHOLDER } from '../constants';

const Ctx = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within an AuthProvider');
  return c;
};

const toUser = async (fbUser: any): Promise<User> => {
  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref);
  const extra = snap.exists() ? snap.data() : {};
  return {
    id: fbUser.uid,
    name: fbUser.displayName ?? extra.name ?? '',
    email: fbUser.email ?? '',
    password: '', // do not store password in state
    profilePicUri: fbUser.photoURL ?? extra.profilePicUri ?? PROFILE_PLACEHOLDER,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);
      if (fbUser) setCurrentUser(await toUser(fbUser));
      else setCurrentUser(null);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = await toUser(cred.user);
      setCurrentUser(user);
      return { success: true, user };
    } catch (e: any) {
      return { success: false, message: e.message || 'E-mail ou senha inválidos.' };
    }
  };

  const register: AuthContextType['register'] = async (name, email, password, profilePicUri) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(user, {
        displayName: name,
        photoURL: profilePicUri || PROFILE_PLACEHOLDER,
      });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        profilePicUri: profilePicUri || PROFILE_PLACEHOLDER,
        createdAt: Date.now(),
      });

      const mapped = await toUser(user);
      setCurrentUser(mapped);
      return { success: true, user: mapped };
    } catch (e: any) {
      return { success: false, message: e.message || 'Falha no cadastro.' };
    }
  };

  const logout: AuthContextType['logout'] = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({ currentUser, login, register, logout, isLoading }),
    [currentUser, isLoading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};