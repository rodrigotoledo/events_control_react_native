import React, { useEffect, useState, } from 'react';
import {FlatList, View, Text, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../axiosConfig'
import HeaderAuthenticated from '../components/HeaderAuthenticated';
import EventItem from '../components/Event';


const Events = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [participantEventIds, setParticipantEventIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(JSON.parse(response.data.events));
      setParticipantEventIds(response.data.participant_event_ids);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostEvent = async (selectedEventId) => {
    try {
      const response = await axios.post('/events/toggle_activation',
        { event_id: selectedEventId }
      );
      fetchEvents();
    } catch (error) {
      console.error('Error posting event:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const renderEventItem = ({ item: event }) => (
    <EventItem
      event={event}
      participantEventIds={participantEventIds}
      handlePostEvent={handlePostEvent}
    />
  );
  return (
    <SafeAreaView className="bg-white container h-screen pb-10 px-4">
      <HeaderAuthenticated />
      <View className="w-full flex flex-row space-x-2 items-center justify-center align-middle mb-4">
        <Text className="text-2xl text-slate-700">Lista de Eventos</Text>
      </View>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          isLoading ? <Text>Carregando...</Text> : <Text>Nenhum evento encontrado.</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Events;
