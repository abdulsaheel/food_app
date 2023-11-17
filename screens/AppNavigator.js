// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrderScreen from './OrderScreen';
import AcceptedOrdersScreen from './AcceptedOrdersScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="AcceptedOrdersScreen" component={AcceptedOrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
