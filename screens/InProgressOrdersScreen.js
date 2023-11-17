import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity,StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import axios from 'axios';

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




const InProgressOrdersScreen = () => {
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInProgressOrders = useCallback(async () => {
    try {
      const data = await makeRequest('api/in-progress-orders', 'GET');

      if (data) {
        setInProgressOrders(data.orders);
      } else {
        console.error('Error fetching in-progress orders: Data is undefined');
      }
    } catch (error) {
      console.error('Error fetching in-progress orders:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleMarkAsDone = async (orderId) => {
    try {
      const data = await makeRequest(`api/orders/${orderId}/completed`, 'POST');

      if (data) {
        // Update the order status locally
        setInProgressOrders(prevOrders =>
          prevOrders.map(order => (order.id === orderId ? { ...order, status: 'Completed' } : order))
        );
      } else {
        console.error(`Error marking order ${orderId} as done: Data is undefined`);
      }
    } catch (error) {
      console.error(`Error marking order ${orderId} as done:`, error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const data = await makeRequest(`api/orders/${orderId}/cancel`, 'POST');

      if (data) {
        // Remove the canceled order from the local state
        setInProgressOrders(prevOrders =>
          prevOrders.filter(order => order.id !== orderId)
        );
      } else {
        console.error(`Error canceling order ${orderId}: Data is undefined`);
      }
    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
    }
  };



  const onRefresh = () => {
    setRefreshing(true);
    fetchInProgressOrders();
  };

  // Fetch in-progress orders initially and set up auto-refresh interval
  useEffect(() => {
    fetchInProgressOrders();
    const intervalId = setInterval(fetchInProgressOrders, 3000); // Auto-refresh every 60 seconds

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchInProgressOrders]);

  const renderOrderItem = ({ item }) => (
    <Card style={{ marginVertical: 10, borderRadius: 8 }}>
      <Card.Content>
        <Text>Order ID: {item.id}</Text>
        <Text>Items: {item.items.join(', ')}</Text>
        <Text>Delivery Address: {item.delivery_address || 'Not specified'}</Text>
        <Text>Status: {item.status}</Text>
        <Ionicons name="md-time" size={24} color="blue" style={{ marginVertical: 5 }} />

        {item.status === 'In-Progress' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, color: 'green', }}>
            <Button color="green" onPress={() => handleMarkAsDone(item.id)}>
            <Text style={{ color: 'green', fontWeight: 'bold' }}>Mark as Done</Text>
            </Button>

            <Button color="red" onPress={() => handleCancelOrder(item.id)}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel Order</Text>
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <LinearGradient colors={['#90be6d', '#b8e994', '#f5f5f5']} style={styles.container}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Orders in Progress</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="md-refresh" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>
      <FlatList
        FlatList
        data={inProgressOrders}
        keyExtractor={order => order.id.toString()}
        renderItem={renderOrderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      

      </View>
      {/* ... (your existing code for buttons and navigation) */}
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 2,
    backgroundColor: '#ffff',
    width:'100%',
    borderRadius:15,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  orderContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10, 

  },
  orderText: {
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  hourglassIcon: {
    marginVertical: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  actionIcon: {
    marginRight: 5,
  },
  actionText: {
    color: 'green',
    fontWeight: 'bold',
  },
  rejectText: {
    color: 'red',
    fontWeight: 'bold',
  },
  navigateButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default InProgressOrdersScreen;
