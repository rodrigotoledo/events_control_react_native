import React, { useState, useRef } from 'react';
import {SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import axios from 'axios';
axios.defaults.baseURL = Config.API_ADDRESS;
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import { faker } from '@faker-js/faker';

const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(faker.internet.email());
  const [name, setName] = useState(faker.internet.userName());
  const [phone, setPhone] = useState('123123');
  const [password, setPassword] = useState('password');
  const [passwordConfirmation, setPasswordConfirmation] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  const scrollViewRef = useRef();

  const handleSignUp = async () => {
    try {
      const response = await axios.post('/participants', {
        participant: {
          email,
          name,
          phone,
          password,
          password_confirmation: passwordConfirmation,
        }
      });

      const token = response.data.token;
      await AsyncStorage.clear();
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('participant_name', response.data.participant.name)
      await AsyncStorage.setItem('participant_email', response.data.participant.email)
      navigation.navigate('Events');

    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors && error.response.status === 422) {
        setErrors(error.response.data.errors);
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      } else {
        setErrors([{ message: 'Erro desconhecido ao tentar criar o participante.' }]);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleSinIn = async () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView className="bg-white container h-screen pb-10 px-4">
      <Header/>
      <View className="w-full flex flex-row space-x-2 items-center justify-center align-middle">
        <Text className="text-2xl text-slate-700">Faça seu cadastro</Text>
      </View>

      <ScrollView ref={scrollViewRef} className="my-2 ">
        <View className="space-y-4">
          {errors && errors.length > 0 && (
            <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <Text className="font-bold">Ops. Alguns erros:</Text>
              <View>
                {errors.map((error, index) => (
                  <Text key={index}>{error}</Text>
                ))}
              </View>
            </View>
          )}

          {isLoading && <View><Text className="font-bold">Carregando...</Text></View>}
          <View >
            <Text>Email:</Text>
            <TextInput
              className="border border-slate-600 rounded-md p-2"
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Entre com seu email"
              keyboardType='email-address'
              autoComplete='email'
              />
          </View>

          <View >
            <Text>Nome:</Text>
            <TextInput
              className="border border-slate-600 rounded-md p-2"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Entre com seu nome"
              autoComplete='name'
              />
          </View>

          <View >
            <Text>Telefone:</Text>
            <TextInput
              className="border border-slate-600 rounded-md p-2"
              value={phone}
              onChangeText={(text) => setPhone(text)}
              placeholder="Entre com seu telefone"
              keyboardType='phone-pad'
              autoComplete='tel'
              />
          </View>

          <View>
            <Text>Senha:</Text>
            <TextInput
              className="border border-slate-600 rounded-md p-2"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              placeholder="Entre com sua senha"
              />
          </View>

          <View>
            <Text>Confirme sua senha:</Text>
            <TextInput
              className="border border-slate-600 rounded-md p-2"
              value={passwordConfirmation}
              onChangeText={(text) => setPasswordConfirmation(text)}
              secureTextEntry
              placeholder="Confirme sua senha"
              />
          </View>

          <View className="flex space-x-2 flex-row justify-center">

            <TouchableOpacity
              className="bg-yellow-800 rounded-md p-4 border-0"
              onPress={handleSignUp}>
              <Text className="text-center text-white">Cadastre-se</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-yellow-800 rounded-md p-4 border-0"
              onPress={handleSinIn}>
              <Text className="text-center text-white">Voltar e Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default SignUp;
