import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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




const AcceptedOrdersScreen = () => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const navigation = useNavigation();

  const fetchAcceptedOrders = async () => {
    try {
      const data = await makeRequest('api/accepted-orders', 'GET');
  
      if (data) {
        setAcceptedOrders(data.accepted_orders);
      } else {
        console.error('Error fetching accepted orders: Data is undefined');
      }
    } catch (error) {
      console.error('Error fetching accepted orders:', error);
    }
  };
  
  const handleCancelOrder = async (orderId) => {
    try {
      const data = await makeRequest(`api/orders/${orderId}/cancel`, 'POST');
  
      if (data) {
        setAcceptedOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
      } else {
        console.error(`Error canceling order ${orderId}: Data is undefined`);
      }
    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
    }
  };
  
  const handleMarkOrderAsDone = async (orderId) => {
    try {
      const data = await makeRequest(`api/orders/${orderId}/in-progress`, 'POST');
  
      if (data) {
        setAcceptedOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
      } else {
        console.error(`Error marking order ${orderId} as done: Data is undefined`);
      }
    } catch (error) {
      console.error(`Error marking order ${orderId} as done:`, error);
    }
  };
  
  const onRefresh = () => {
    fetchAcceptedOrders();
  };

  useEffect(() => {
    const refreshInterval = setInterval(fetchAcceptedOrders, 1000); // Refresh every 60 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []); // Empty dependency array means this effect runs only once on mount

  const renderOrderItem = ({ item }) => (
    <LinearGradient colors={['#c7c7c7', '#e0e0e0', '#f5f5f5']  } style={{ padding: 20, justifyContent: 'center', alignItems: 'center',borderRadius:15,margin:15}}>
    <View>
    <View>
      <Text>Order ID: {item.id}</Text>
      <Text>Items: {item.items.join(', ')}</Text>
      <Text>Delivery Address: {item.delivery_address || 'Not specified'}</Text>
      <Text>Status: {item.status}</Text>
      <Ionicons name="md-checkmark-circle" size={24} color="green" style={{ marginVertical: 5 }} />
      <TouchableOpacity onPress={() => handleCancelOrder(item.id)}>
        <Text style={{ color: 'red', marginTop: 5 }}>Cancel Order</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMarkOrderAsDone(item.id)}>
        <Text style={{ color: 'blue', marginTop: 5 }}>In Progress</Text>
      </TouchableOpacity>
    </View>
    </View>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#90be6d', '#b8e994', '#f5f5f5']} style={styles.container}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Accepted Orders</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="md-refresh" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={acceptedOrders}
        keyExtractor={order => order.id.toString()}
        renderItem={renderOrderItem}
      />
      
          {/* <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
          /> */}
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('InProgressOrders')}
          
          style={{ flex: 1, alignItems: 'center', paddingVertical: 10, marginLeft: 5 }}
        >
          <View style={{
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  }}>
          <Text style={{ 
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
 }}>See In Progress Orders</Text>
          </View>
        </TouchableOpacity>
      </View>
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


export default AcceptedOrdersScreen;
