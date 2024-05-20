import React from 'react';
import { SafeAreaView} from 'react-native';
import { useRoute } from '@react-navigation/native';
import HeaderAuthenticated from '../components/HeaderAuthenticated';
import EventInfo from '../components/EventInfo';


const Event = () => {
  const route = useRoute();
  const { eventId } = route.params;

  return (
    <SafeAreaView className="bg-white container h-screen pb-10 px-4">
      <HeaderAuthenticated />
      <EventInfo eventId={eventId} />
    </SafeAreaView>
  );
};

export default Event;
