import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';  
import { View, Animated } from 'react-native'; 
import OrderScreen from './screens/OrderScreen';
import axios from 'axios';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import AcceptedOrdersScreen from './screens/AcceptedOrdersScreen';
import InProgressOrdersScreen from './screens/InProgressOrdersScreen';
import CompletedOrdersScreen from './screens/CompletedOrdersScreen';
const BASE_URL = 'http://chat.atharvadsc.com:9056';


const makeRequest = async (endpoint, method = 'GET', data = null, params = null) => {
  try {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      'Access-Control-Allow-Origin': '*', // Replace '*' with the allowed origin(s)
      'Content-Type': 'application/json',
    };

    let requestOptions = {
      method,
      headers,
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    if (params) {
      url += '?' + new URLSearchParams(params).toString();
    }

    const response = await fetch(url, requestOptions);

    if (response.ok) {
      return response.json();
    } else {
      console.error(`Request failed with status ${response.status}`);
      // Handle error cases here
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    // Handle the error
    console.error(`Error in ${method} request to ${endpoint}:`, error);
    throw error; // Rethrow the error for further handling, if needed
  }
};



const Stack = createStackNavigator();

const AnimatedIcon = Animated.createAnimatedComponent(Icon); // Create an animated version of the Icon component

const HomeScreen = ({ navigation }) => {
  const [isNewOrder, setNewOrder] = useState(false);
  const bellAnimation = new Animated.Value(0); // Initialize animated value

  const navigateTo = (screenName) => {
    // Reset the new order flag when navigating to a different screen
    setNewOrder(false);
    navigation.navigate(screenName);
  };

  const checkForNewOrders = async () => {
    try {
      const data = await makeRequest('api/incoming-orders', 'GET');
  
      if (data) {
        // Check if the response contains an "id"
        const hasNewOrders = data.incoming_orders && data.incoming_orders.some(order => order.id !== undefined);
  
        setNewOrder(hasNewOrders);
  
        // Trigger bell animation if there are new orders
        if (hasNewOrders) {
          Animated.sequence([
            Animated.timing(bellAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(bellAnimation, { toValue: 0, duration: 500, useNativeDriver: true }),
          ]).start();
        }
      } else {
        console.error('Error fetching incoming orders: Data is undefined');
      }
    } catch (error) {
      console.error('Error checking for new orders:', error);
    }
  };
  
  useEffect(() => {
    // Check for new orders on component mount and at regular intervals
    checkForNewOrders();
    const intervalId = setInterval(checkForNewOrders, 5000); // Check every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#f5f5f5']} style={{ padding: 20, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: '100%', borderRadius: 10, overflow: 'hidden', height: '90%' }}>
        <Card.Content style={{ alignItems: 'center', height: '95%' }}>
          <Title style={{ color: '#000000', marginBottom: 20 }}>Delivery App Dashboard</Title>

           {/* Show a notification symbol when there are new orders */}
           <Button
            mode="contained"
            onPress={() => navigateTo('Order')}
            style={{ marginTop: 20,
              backgroundColor: isNewOrder ? '#e74c3c' : '#3498db',
            flexDirection: 'row', alignItems: 'center', height: '20%', width: '90%' }}
            labelStyle={{ color: '#fff' }}
          >
            {/* Notification bell icon with animation */}
{isNewOrder ? (
  <AnimatedIcon
    name="bell"
    size={20}
    color="#fff"
    style={{  transform: [{ scale: bellAnimation }],marginRight: 10 }}
  />
) : (
  <Icon name="alert-triangle" size={20} color="#fff" style={{ marginRight: 10 }} />
)}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="alert-triangle" size={20} color="#fff" style={{ marginRight: 10 }} />
            </View>
            Incoming Orders
          </Button>


          <Button
            mode="contained"
            onPress={() => navigateTo('AcceptedOrders')}
            style={{ marginTop: 20, backgroundColor: '#2ecc71', flexDirection: 'row', alignItems: 'center', height: '20%', width: '90%' }}
            labelStyle={{ color: '#fff' }}
          >
            <Icon name="check" size={20} color="#fff" style={{ marginRight: 10 }} />
            <View style={{ width: 20 }}></View> 
            Accepted Orders
          </Button>
          <Button
            mode="contained"
            onPress={() => navigateTo('InProgressOrders')}
            style={{ marginTop: 20, backgroundColor: '#f39c12', flexDirection: 'row', alignItems: 'center', height: '20%', width: '90%' }}
            labelStyle={{ color: '#fff' }}
          >
            <Icon name="clock" size={20} color="#fff" style={{ marginRight: 10 }} />
            <View style={{ width: 20 }}></View> 
            In Progress Orders
          </Button>
          <Button
            mode="contained"
            onPress={() => navigateTo('CompletedOrders')}
            style={{ marginTop: 20, backgroundColor: '#27ae60', flexDirection: 'row', alignItems: 'center', height: '20%', width: '90%' }}
            labelStyle={{ color: '#fff' }}
          >
            <Icon name="check-circle" size={20} color="#fff" style={{ marginRight: 10 }} />
            <View style={{ width: 20 }}></View> 
            Completed Orders
          </Button>
        </Card.Content>
      </Card>
    </LinearGradient>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Theobrama Foods" component={HomeScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="AcceptedOrders" component={AcceptedOrdersScreen} />
        <Stack.Screen name="InProgressOrders" component={InProgressOrdersScreen} />

        <Stack.Screen name="CompletedOrders" component={CompletedOrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
