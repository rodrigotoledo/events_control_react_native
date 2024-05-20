import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import axios from '../axiosConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';

const SignIn = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('/sign_in', data);
      const token = response.data.token;
      await AsyncStorage.clear();
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('participant_name', response.data.participant.name)
      await AsyncStorage.setItem('participant_email', response.data.participant.email)
      navigation.navigate('Events');
    } catch (error) {
      setError('Falha ao entrar');
    }
  };

  const handleSinUp = async () => {
    navigation.navigate('SignUp');
  };

  return (
    <View className="flex justify-center items-center h-full bg-white">
      <Header />
      <View className="w-full flex flex-row space-x-2 items-center justify-center align-middle">
        <Text className="text-2xl text-slate-700">Entre com suas informações</Text>
      </View>

      <View className="w-full flex space-y-4 px-10">
        {error !== '' && <Text className="text-red-500">{error}</Text>}
        <View>
          <Text>Email:</Text>
          <TextInput
            className="border border-slate-600 rounded-md p-2"
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Digite seu email"
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text>Senha:</Text>
          <TextInput
            className="border border-slate-600 rounded-md p-2"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            placeholder="Digite sua senha"
          />
        </View>

        <View className="flex space-x-2 flex-row justify-center">

          <TouchableOpacity
            className="bg-yellow-800 rounded-md p-4 border-0"
            onPress={handleLogin}>
            <Text className="text-center text-white">Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-yellow-800 rounded-md p-4 border-0"
            onPress={handleSinUp}>
            <Text className="text-center text-white">Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
