import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css'
const App: React.FC = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

export default App;