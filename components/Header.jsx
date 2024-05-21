import React from 'react';
import {View, Image, Text} from 'react-native';

const Header = () => {
  return (
    <View className="bg-white">
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

export default Header;
