import React, { FC, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import { PROFILE_PLACEHOLDER } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../styles';
import { NavigationProps } from '../types';

const RegisterScreen: FC<NavigationProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [profilePicUri] = useState(PROFILE_PLACEHOLDER);

  const handleImagePicker = () => {
    Alert.alert("Foto Padrão", "A foto de perfil padrão será usada para o cadastro, pois o seletor de imagens está desativado na simulação.");
  };

  const handleRegister = async () => {
    setError('');
    
    if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos.');
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
    }

    const result = await register(name, email, password, profilePicUri);
    if (!result.success) {
      setError(result.message!);
      Alert.alert("Erro de Cadastro", result.message!);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro</Text>

        <Image
          style={styles.profileImage}
          source={{ uri: profilePicUri }}
        />
        <Button
          title="Usar Foto Padrão"
          variant="secondary"
          onPress={handleImagePicker}
          style={{ marginBottom: 15 }}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
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
        
        <Button title="Cadastrar" onPress={handleRegister} />
        <Button
          title="Já tem conta? Faça login"
          variant="link"
          onPress={() => onNavigate('Login')}
        />
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;