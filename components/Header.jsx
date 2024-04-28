import React from 'react';
import {View, Image, Text} from 'react-native';

const Header = () => {
  return (
    <View>
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

export default Header;
