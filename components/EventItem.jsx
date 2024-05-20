import React, { useRef } from 'react';
import {useNavigation} from '@react-navigation/native';
import { Animated, View, Text, Image, TouchableOpacity } from 'react-native';


const EventItem = ({ event }) => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const handleEventMoreInfo = (eventId) => {
    // Animação de fade
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate('Event', {eventId: eventId});
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }} className="border-b border-gray-300 mb-4 border">
      <View className="w-full">
        {event.cover_image_url !== false && (
          <Image source={{ uri: event.cover_image_url }} className="w-full h-48" />
        )}
        <Text className="px-4 py-2 text-left text-xl font-bold">
          {event.title}
        </Text>
      </View>
      <Text className="border-b border-gray-300 px-4 py-2 text-left">
        {event.description}
      </Text>
      <View className="border-b border-gray-300 px-4 py-2">
        <View className="w-full">
          <View className="flex space-y-2">
            <Text>Ocorrerá em: {event.formatted_scheduled_at}</Text>
            <TouchableOpacity
              className="bg-green-800 px-2 py-1 rounded self-start"
              onPress={() => handleEventMoreInfo(event.id)}
            >
              <Text className="font-bold text-white">
                Mais informações
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default EventItem;
