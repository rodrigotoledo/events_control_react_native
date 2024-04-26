import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
const SignUpScreen = ({navigation}) => {
  return (
    <View className="flex flex-1 justify-center items-center bg-gray-100">
      <View className="w-3/4 items-center justify-center">
        <Text className="text-3xl italic font-bold mb-4">Hostel Tribes</Text>
        <Text className="text-lg font-bold mb-4">Entre com seus dados</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mb-4"
          placeholder="Email"
          />
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mb-4"
          placeholder="Senha"
          secureTextEntry
        />

        <View className="flex flex-row justify-around w-full">
          <TouchableOpacity
            className="bg-slate-500 rounded-lg px-4 py-2"
            onPress={() => navigation.navigate('Events')}>
            <Text className="text-white font-bold">Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-slate-500 rounded-lg px-4 py-2" // Adicionando margem à esquerda
            onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-white font-bold">Registar</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default SignUpScreen;
