import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {faker} from '@faker-js/faker';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setUser = async () => {
      const fakeUserInfo = {
        user: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
      };
      const fakeUserInfoString = JSON.stringify(fakeUserInfo);
      AsyncStorage.setItem('userInfo', fakeUserInfoString);

      // Obtém os dados simulados do AsyncStorage logo em seguida
      AsyncStorage.getItem('userInfo').then(value => {
        const parsedUserInfo = JSON.parse(value);
        setUserInfo(parsedUserInfo);
      });
    };

    const fetchEvents = async () => {
      try {
        // Simula a busca de eventos da API
        // const response = await fetch('https://sua-api.com/events');
        // const data = await response.json();
        // Usando dados falsos com o Faker
        const data = Array.from({length: 5}, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.words(),
          cover: faker.image.urlLoremFlickr({category: 'technics'}),
          description: faker.lorem.paragraph(),
        }));
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        setLoading(false);
      }
    };

    setUser();
    fetchEvents();
  }, []);

  const handleSignUp = eventId => {
    // Lógica para se inscrever no evento com o ID 'eventId'
    console.log('Inscrição no evento com ID:', eventId);
  };

  return (
    <SafeAreaView>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <View className="flex flex-col items-center h-full">
          {userInfo && (
            <View className="m-10">
              <Text className="text-lg font-bold">
                Nome: {userInfo.user.name}
              </Text>
              <Text className="text-lg font-bold">
                E-mail: {userInfo.user.email}
              </Text>
            </View>
          )}
          <ScrollView className="w-full p-4">
            {events.map(event => (
              <View
                key={event.id}
                className="my-4 justify-center items-center pb-4 bg-slate-200">
                <Text className="text-2xl">{event.title}</Text>
                <Image
                  source={{uri: event.cover}}
                  className="w-48 h-48 rounded-lg"
                />
                <Text>{event.description}</Text>
                <TouchableOpacity
                  className="bg-slate-500 p-4 rounded-full"
                  onPress={() => handleSignUp(event.id)}>
                  <Text className="text-white font-bold">Inscrever-se</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default EventsScreen;
