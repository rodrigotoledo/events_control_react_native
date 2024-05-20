import React, { useState, useEffect } from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderAuthenticated = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [participantName, setParticipantName] = useState(null);
  const [participantEmail, setParticipantEmail] = useState(null);

  const fetchParticipantData = async () => {
    try {
      const participantName = await AsyncStorage.getItem('participant_name');
      const participantEmail = await AsyncStorage.getItem('participant_email');
      setParticipantName(participantName);
      setParticipantEmail(participantEmail);
    } catch (error) {
      console.error('Error fetching participant data:', error);
    }
  };

  useEffect(() => {
    fetchParticipantData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchParticipantData();
    });

    // Return a função de limpeza para remover o listener quando a tela for desmontada
    return unsubscribe;
  }, [navigation]);


  const handleLogout =  async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('SignIn');
  };

  return (
    <View>
      <View className="fixed flex flex-row justify-between mt-2 mr-2">
        {participantName && (
          <View className="mr-10">
            <Text>Nome: <Text className="font-bold">{participantName}</Text></Text>
            <Text>E-mail: <Text className="font-bold">{participantEmail}</Text></Text>
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
          source={require('../assets/logo.jpeg')}
          className="h-48 w-48 "
          resizeMode="contain"
          />
          <Text className="text-4xl text-slate-700">Hostel Tribes</Text>
      </View>
    </View>
  );
};

export default HeaderAuthenticated;
