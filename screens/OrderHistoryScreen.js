import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://chat.atharvadsc.com:9056';

const makeRequest = async (endpoint, method = 'GET', data = null, params = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}/${endpoint}`,
      data,
      params,
    };

    const response = await axios(config);

    // Axios does not have a property 'ok'. Check if the status code is in the 2xx range for success.
    if (response.status >= 200 && response.status < 300) {
      return response.data;
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



const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Make a GET request to your API to retrieve order history
    const fetchOrderHistory = async () => {
      try {
        const data = await makeRequest('api/orders/history', 'GET');
    
        if (data) {
          setOrders(data.orders);
        } else {
          console.error('Error fetching order history: Data is undefined');
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };
    

    fetchOrderHistory();
  }, []);

  return (

     <LinearGradient colors={['#90be6d', '#b8e994', '#f5f5f5']} style={{ padding: 20, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    width:'100%',
    height:'100%'
  }}>
      <Text>Order History Screen</Text>
      <FlatList
        data={orders}
        keyExtractor={order => order.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Order ID: {item.id}</Text>
            <Text>Items: {item.items.join(', ')}</Text>
            <Text>Delivery Address: {item.delivery_address}</Text>
            <Text>Status: {item.status}</Text>
          </View>
          
        )}
      />
    </View>
    </LinearGradient>

  );
};

export default OrderHistoryScreen;
