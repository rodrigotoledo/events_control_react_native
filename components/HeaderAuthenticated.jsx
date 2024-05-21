import React, { useState, useEffect } from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderAuthenticated = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const fetchUserData = async () => {
    try {
      const userName = await AsyncStorage.getItem('user_name');
      const userEmail = await AsyncStorage.getItem('user_email');
      setUserName(userName);
      setUserEmail(userEmail);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });

    // Return a função de limpeza para remover o listener quando a tela for desmontada
    return unsubscribe;
  }, [navigation]);


  const handleLogout =  async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('SignIn');
  };

  return (
    <View className="bg-white">
      <View className="fixed flex flex-row justify-between mt-2 mr-2">
        {userName && (
          <View className="mr-10">
            <Text>Nome: <Text className="font-bold">{userName}</Text></Text>
            <Text>E-mail: <Text className="font-bold">{userEmail}</Text></Text>
          </View>
        )}
        <View className="space-x-1 flex flex-row">
          {route.name !== 'Events' && (
          <TouchableOpacity onPress={() => navigation.navigate('Events')} className="bg-green-700 top-0 p-2 rounded-md w-auto">
            <Text className="text-white">Voltar</Text>
          </TouchableOpacity>
          )}
          <TouchableOpacity className="bg-gray-600 p-2 top-0 w-auto rounded-md" onPress={handleLogout}>
            <Text className="text-white">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-full justify-center items-center">
        <Image
          source={require('../assets/logo.png')}
          className="h-48 w-48 "
          resizeMode="contain"
          />
          <Text className="text-4xl text-slate-700">Events Control</Text>
      </View>
    </View>
  );
};

export default HeaderAuthenticated;
