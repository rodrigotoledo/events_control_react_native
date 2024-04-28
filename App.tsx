import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Events from './screens/Events';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';


const Stack = createStackNavigator();

const SignInSignUpStack = () => {
  return (
    <Stack.Navigator initialRouteName='SignIn'>
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
      <Stack.Screen
        name="Events"
        options={{headerShown: false}}
        component={Events}
      />
    </Stack.Navigator>
  );
};

const AuthenticatedTabsStack = () => {
  return (
    <Stack.Navigator initialRouteName='Events'>
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
    </Stack.Navigator>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedTabsStack /> : <SignInSignUpStack />}
    </NavigationContainer>
  );
};

export default App;
