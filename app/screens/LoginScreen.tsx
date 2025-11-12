import React, { FC, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../styles';
import { NavigationProps } from '../types';

const LoginScreen: FC<NavigationProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message!);
      Alert.alert("Erro de Login", result.message!);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Rate My Movie (RN)</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Entrar" onPress={handleLogin} />
        <Button
          title="Não tem conta? Cadastre-se"
          variant="link"
          onPress={() => onNavigate('Register')}
        />
      </View>
    </View>
  );
};

export default LoginScreen;