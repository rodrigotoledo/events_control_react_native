import React, { useState, useEffect } from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  stretch: {
    width: 100,
    resizeMode: 'contain',
  },
});

const HeaderAuthenticated = () => {
  const [authToken, setAuthToken] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token !== undefined) {
        setAuthToken(token);
      }
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setAuthToken(null);
    navigation.navigate('SignIn');
  };

  return (
    <View>
      {authToken &&
      <View className="fixed flex items-end right-0 mt-2 mr-2">
        <TouchableOpacity className=" bg-yellow-600 p-2 top-0 w-auto rounded-md" onPress={handleLogout}><Text className="text-white">Sair</Text></TouchableOpacity>
      </View>
      }
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
