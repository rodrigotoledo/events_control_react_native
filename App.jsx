import React, {useEffect, useState} from 'react';
import './ignoreWarnings';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageListener from 'react-native-async-storage-listener';

import Events from './screens/Events';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Event from './screens/Event';

const Stack = createStackNavigator();
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const value = await AsyncStorage.getItem('authToken');
        setIsAuthenticated(value ? true : false);
      } catch (error) {
        console.log('Error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();

    const channels = StorageListener.getChannels();
    const subscriber = StorageListener.addSubscriber(async () => {
      try {
        const value = await AsyncStorage.getItem('authToken');
        setIsAuthenticated(value ? true : false);
      } catch (error) {
        console.log('Error:', error);
        setIsAuthenticated(false);
      }
    }, channels[0]);

    // Retorne uma função de limpeza para remover o assinante quando o componente for desmontado
    return () => StorageListener.removeSubscriber(subscriber);
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Events' : 'SignIn'}>
        <Stack.Group initialRouteName='SignIn' screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Event"
            options={{headerShown: false}}
            component={Event}
          />
          <Stack.Screen
            name="Events"
            options={{headerShown: false}}
            component={Events}
          />
          <Stack.Screen
            name="SignIn"
            options={{headerShown: false}}
            component={SignIn}
          />
          <Stack.Screen
            name="SignUp"
            options={{headerShown: false}}
            component={SignUp}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
