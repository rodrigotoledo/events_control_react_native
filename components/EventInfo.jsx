import React, { useState, useRef, useEffect } from 'react';
import Config from 'react-native-config';
import { ScrollView, Animated, View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from '../axiosConfig';

const EventInfo = ({ eventId }) => {
  const [address, setAddress] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ event, setEvent ] = useState(null);
  const [participantEventIds, setParticipantEventIds] = useState([]);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Valor animado inicial
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${eventId}`);
      let eventParsed = JSON.parse(response.data.event)
      setEvent(eventParsed)
      if(eventParsed.display_location) {
        setAddress(eventParsed.location);
      }
      setParticipantEventIds(response.data.participant_event_ids);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchEvent();
  }, []);

  useEffect(() => {
    // Aqui você faria uma solicitação para obter as coordenadas do endereço usando um serviço de geocodificação
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${Config.GOOGLE_MAPS_APY_KEY}`);
        const { results } = response.data;
        if (results && results.length > 0) {
          const { geometry } = results[0];
          const { location } = geometry;
          console.log(location)
          setCoordinates({ latitude: location.lat, longitude: location.lng });
          setRegion(prevRegion => ({
            ...prevRegion,
            latitude: location.lat,
            longitude: location.lng,
          }));
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    if(address !== null){
      fetchCoordinates();
    }
  }, [address]);


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

    handleParticipateEvent(eventId); // Chama a função passada como prop
  };

  const handleParticipateEvent = async (eventId) => {
    try {
      const isParticipating = participantEventIds.includes(eventId);
      const response = await axios.post('/events/toggle_activation',
        { event_id: eventId }
      ).then(() => {
        if (isParticipating) {
          setParticipantEventIds(prevIds => prevIds.filter(id => id !== eventId));
        } else {
          setParticipantEventIds(prevIds => [...prevIds, eventId]);
        }
      });
    } catch (error) {
      console.error('Error posting event:', error);
    }
  };

  return (
    <ScrollView>
      {isLoading ? (
        <View><Text>Carregando...</Text></View>
      ) : (
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
              <View className="flex justify-between">
                <Text><Text className='font-bold'>Ocorrerá em:</Text> {event.formatted_scheduled_at}</Text>
                {event.display_location && address && (
                  <Text><Text className='font-bold'>Local:</Text> {event.location}</Text>
                )}
                {event.can_participate && (
                  <TouchableOpacity
                    className={`bg-green-700 px-2 my-2 self-start py-1 rounded ${participantEventIds.includes(event.id) ? 'bg-yellow-600' : 'bg-green-700'}`}
                    onPress={() => handlePress(event.id)}
                  >
                    <Text className="font-bold text-white">
                      {participantEventIds.includes(event.id) ? "Sair" : "Participar"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {event.display_location && address && (
              <MapView
                style={{ height: 150, width: '100%', borderWidth: 1 }}
                initialRegion={region}
                region={region}
              >
                {coordinates && (
                  <Marker
                    coordinate={coordinates}
                    title="Local"
                    description={address}
                  />
                )}
              </MapView>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default EventInfo;
