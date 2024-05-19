import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

axios.defaults.baseURL = Config.API_ADDRESS;

axios.interceptors.request.use(
  async config => {
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    config.headers['ngrok-skip-browser-warning'] = 'any-value';
    return config;
  },
  error => {
    console.log('Error interceptors:', error);
    return Promise.reject(error);
  },
);

export default axios;
