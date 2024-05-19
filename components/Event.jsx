import React, { useState, useRef } from 'react';
import { Animated, View, Text, Image, TouchableOpacity } from 'react-native';


const EventItem = ({ event, participantEventIds, handlePostEvent }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Valor animado inicial

  const handlePress = (eventId) => {
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

    handlePostEvent(eventId); // Chama a função passada como prop
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
          <View className="flex flex-row items-center justify-between space-x-1">
            <Text>Ocorrerá em: {event.formatted_scheduled_at}</Text>
            {event.can_participate && (
              <TouchableOpacity
                className={`bg-green-600 px-2 py-1 rounded ${participantEventIds.includes(event.id) ? 'bg-yellow-600' : 'bg-green-600'}`}
                onPress={() => handlePress(event.id)}
              >
                <Text className="font-bold text-white">
                  {participantEventIds.includes(event.id) ? "Sair" : "Participar"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default EventItem;
