import React, { useEffect, useState, } from 'react';
import {FlatList, View, Text, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../axiosConfig'
import HeaderAuthenticated from '../components/HeaderAuthenticated';
import EventItem from '../components/EventItem';


const Events = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
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
    />
  );
  return (
    <SafeAreaView className="bg-white container h-screen pb-10 px-4">
      <HeaderAuthenticated />
      <View className="w-full items-center justify-center align-middle mb-4">
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
