import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import Config from 'react-native-config';
import { SliderBox } from "react-native-image-slider-box";
import { SafeAreaView, ScrollView, Animated, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from '../axiosConfig';
import HeaderAuthenticated from '../components/HeaderAuthenticated';


const Event = () => {
  const route = useRoute();
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const { eventId } = route.params;
  const queryClient = useQueryClient();


  const fetchEvent = async ({ queryKey }) => {
    const [_, eventId] = queryKey;
    const response = await axios.get(`/events/${eventId}`);
    return response.data;
  };

  const { isLoading: isLoadingEvent, isError: isErrorEvent, data: event, error: errorEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: fetchEvent,
  })

  const handleParticipateMutation = useMutation({
    mutationFn: () => {

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
      const response = axios.patch(`/events/${eventId}/toggle_activation`)
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['event', eventId]);
    },
    onError: (error) => {
      console.log(error)
    }
  })

  useFocusEffect(
    React.useCallback(() => {
      setError('');
    }, [])
  );

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${event.location}&key=${Config.GOOGLE_MAPS_APY_KEY}`);
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
    if(event !== undefined && event.location !== null){
      fetchCoordinates();
    }
  }, [event]);

  return (
    <SafeAreaView className="bg-white container h-screen pb-10 px-4">
      {!isLoadingEvent && (
        <>
          <HeaderAuthenticated title={event.title} />
          {!isLoadingEvent && (
            <View className="w-full">
              {event.can_participate && (
                <TouchableOpacity
                className={`bg-green-700 px-2 mb-2 self-start py-1 rounded ${event.in_event ? 'bg-yellow-600' : 'bg-green-700'}`}
                  onPress={() => handleParticipateMutation.mutate()}
                >
                  <Text className="font-bold text-white">
                    {event.in_event ? "Sair" : "Participar"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          </>
        )}

      <ScrollView>
        {isErrorEvent && <><Text className="text-red-500">Ops...</Text></>}
        {error !== '' && <><Text className="text-red-500">{error}</Text></>}
        {!isLoadingEvent && (
          <Animated.View style={{ opacity: fadeAnim }} className="border-b border-gray-300 mb-4 border">
            {event.images_url.length > 0 && (
              <View className="w-full rounded-md mb-2">
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
            <Text className="border-b border-gray-300 px-4 py-2 text-left">
              {event.description}
            </Text>
            <View className="border-b border-gray-300 px-4 py-2">
              <View className="w-full">
                <View className="flex justify-between">
                  <Text><Text className='font-bold'>Ocorrerá em:</Text> {event.formatted_scheduled_at}</Text>
                  {event.display_location && event.location && (
                    <>
                      <Text><Text className='font-bold'>Local:</Text> {event.location}</Text>
                      <MapView
                      className="w-full mt-1"
                      style={{ height: 200 }}
                      initialRegion={region}
                      region={region}
                      scrollEnabled={false}
                    >
                      {coordinates && (
                        <Marker
                          coordinate={coordinates}
                          title="Local"
                          description={event.location}
                        />
                      )}
                    </MapView>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Event;
