import React, { useState, useRef } from 'react';
import {SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { useMutation } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axiosConfig'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from '../components/Header';

const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState([]);
  const scrollViewRef = useRef();

  const handleSignUpMutation = useMutation({

    mutationFn: async () => {
      setErrors([])
      response = await axios.post('/users', {
        user: {
          email,
          name,
          phone,
          password,
          password_confirmation: passwordConfirmation,
        }
      })
      return response;
    },
    onSuccess: async (response) => {
      try {
        const token = response.data.token;
        await AsyncStorage.clear();
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user_name', response.data.user.name)
        await AsyncStorage.setItem('user_email', response.data.user.email)
        navigation.navigate('Events');
      } catch (error) {
        console.log(error);
        setErrors(['Erro desconhecido ao tentar criar o usuario'])
      }
    }, onError: (error) => {
       if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(['Erro desconhecido ao tentar criar o usuario']);
      }

      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  })

  const handleSinIn = async () => {
    navigation.navigate('SignIn');
  };

  useFocusEffect(
    React.useCallback(() => {
      setErrors([]);
    }, [])
  );

  return (
    <SafeAreaView className="bg-white container h-screen pb-10 px-4">
      <Header/>
      <View className="w-full flex flex-row space-x-2 items-center justify-center align-middle">
        <Text className="text-2xl text-slate-700">Faça seu cadastro</Text>
      </View>

      <ScrollView ref={scrollViewRef} className="my-2 ">
        <View className="space-y-4">
          {handleSignUpMutation.isError && (
            <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <Text className="font-bold">Ops. Alguns erros:</Text>
              {errors.map((errMsg, index) => (
                <View key={index}>
                  <Text>{errMsg}</Text>
                </View>
              ))}
            </View>
          )}


          {handleSignUpMutation.isLoading && <View><Text className="font-bold">Carregando...</Text></View>}
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
              onPress={() => { handleSignUpMutation.mutate()}}>
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
