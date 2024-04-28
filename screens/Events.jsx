import React, { useEffect, useState } from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import axios from 'axios';
import HeaderAuthenticated from '../components/HeaderAuthenticated';
axios.defaults.baseURL = Config.API_ADDRESS;

const Events = () => {
  const [token, setToken] = useState(false)
  const [events, setEvents] = useState([]);
  const [participantEventIds, setParticipantEventIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events', {
        headers: {
          Authorization: token // Adicionando o token no cabeçalho
        }
      });
      setEvents(JSON.parse(response.data.events));
      setParticipantEventIds(response.data.participant_event_ids);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false); // Definindo isLoading como false após a resposta da API
    }
  };

  const handlePostEvent = async (selectedEventId) => {
    try {
      const response = await axios.post('/events/toggle_activation',
        { event_id: selectedEventId },
        {
          headers: {
            Authorization: token // Adicionando o token no cabeçalho
          }
        }
      );
      fetchEvents();
    } catch (error) {
      console.error('Error posting event:', error);
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const value = await AsyncStorage.getItem('authToken');
      setToken(value);
    };

    getToken();
    fetchEvents();
  }, []);

  return (
    <SafeAreaView className="bg-white container h-screen pb-10 px-4">
      <HeaderAuthenticated />
      <View className="w-full flex flex-row space-x-2 items-center justify-center align-middle">
        <Text className="text-2xl text-slate-700">Lista de Eventos</Text>
      </View>
      <ScrollView className="my-2">
        <View className="space-y-4">
          {isLoading ? (
            <Text>Carregando...</Text>
          ) : (
            events.map(event => (
              <View
                key={event.id}
                className="border-b border-gray-300 mb-4 border">
                <View className="w-full">
                  {event.cover_image_url !== false &&
                    <Image source={{ uri: event.cover_image_url }} className="w-full h-48" />
                  }
                  <Text className="px-4 py-2 text-left text-xl font-bold">
                    {event.title}
                  </Text>
                </View>
                <Text className="border-b border-gray-300 px-4 py-2 text-left">
                  {event.description}
                </Text>
                <View className="border-b border-gray-300 px-4 py-2">
                  <View className="w-full">

                    {/* Remova a propriedade "flex" do contêiner */}
                    <View className="flex flex-row items-center justify-between space-x-1">
                      <Text className="">Ocorerá em: {event.formatted_scheduled_at}</Text>
                      <TouchableOpacity
                        className={`bg-green-600 px-2 py-1 rounded  ${participantEventIds.includes(event.id) ? 'bg-yellow-600' : 'bg-green-600'}`}
                        onPress={() => handlePostEvent(event.id)}>
                        <Text className="font-bold text-white">{participantEventIds.includes(event.id) ? "Sair" : "Participar"}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Events;
