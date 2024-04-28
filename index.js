/**
 * @format
 */
if (__DEV__) {
  require('./ReactotronConfig');
}
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Config from 'react-native-config';
import axios from 'axios';

axios.defaults.baseURL = Config.API_ADDRESS;
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.interceptors.request.use(
  async config => {
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  error => {
    console.log('Error interceptors:', error);
    return Promise.reject(error);
  },
);

const RootComponent = () => (
  <App />
);

AppRegistry.registerComponent(appName, () => RootComponent);
