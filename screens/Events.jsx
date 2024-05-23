import React from 'react';
import { useQuery } from '@tanstack/react-query'
import {FlatList, View, Text, SafeAreaView} from 'react-native';
import axios from '../axiosConfig'
import HeaderAuthenticated from '../components/HeaderAuthenticated';
import EventItem from '../components/EventItem';

const fetchEvents = async () => {
  const response = await axios.get('/events');
  return response.data;
};

const renderEventItem = ({ item: event }) => (
  <EventItem
    event={event}
  />
);

const Events = () => {

  const { isLoading, isError, data: events, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

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
