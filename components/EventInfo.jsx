import React, { useState, useRef, useEffect } from 'react';
import Config from 'react-native-config';
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView, Animated, View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from '../axiosConfig';

const EventInfo = ({ eventId }) => {
  const [address, setAddress] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ event, setEvent ] = useState(null);
  const [userEventIds, setUserEventIds] = useState([]);
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
      setUserEventIds(response.data.user_event_ids);
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
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${Config.GOOGLE_MAPS_APY_KEY}`);
        const { results } = response.data;
        if (results && results.length > 0) {
          const { geometry } = results[0];
          const { location } = geometry;
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
      const isParticipating = userEventIds.includes(eventId);
      const response = await axios.patch(`/events/${eventId}/toggle_activation`).then(() => {
        if (isParticipating) {
          setUserEventIds(prevIds => prevIds.filter(id => id !== eventId));
        } else {
          setUserEventIds(prevIds => [...prevIds, eventId]);
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
                    className={`bg-green-700 px-2 my-2 self-start py-1 rounded ${userEventIds.includes(event.id) ? 'bg-yellow-600' : 'bg-green-700'}`}
                    onPress={() => handlePress(event.id)}
                  >
                    <Text className="font-bold text-white">
                      {userEventIds.includes(event.id) ? "Sair" : "Participar"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {event.display_location && address && (
              <MapView
                className="w-full"
                style={{ height: 200 }}
                initialRegion={region}
                region={region}
                scrollEnabled={false}
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
              {event.images_url.length > 0 && (

                <View className="w-full rounded-md my-2">
                  <Text className="font-bold text-2xl my-2">Imagens</Text>
                  <SliderBox images={event.images_url}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE" dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 0,
                    }} />
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default EventInfo;
