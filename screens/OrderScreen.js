import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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




const OrderScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  const fetchIncomingOrders = async () => {
    try {
      const data = await makeRequest('api/incoming-orders', 'GET');
  
      if (data) {
        setOrders(data.incoming_orders);
      } else {
        console.error('Error fetching incoming orders: Data is undefined');
      }
    } catch (error) {
      console.error('Error fetching incoming orders:', error);
    }
  };
  

  useEffect(() => {
    fetchIncomingOrders();
    // Automatic refresh every 2 seconds
    const intervalId = setInterval(fetchIncomingOrders, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleShowAcceptedOrders = () => {
    navigation.navigate('AcceptedOrders');
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const data = await makeRequest(`api/orders/${orderId}/accept`, 'POST');
  
      if (data) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'Accepted' } : order
          )
        );
      } else {
        console.error(`Error accepting order ${orderId}: Data is undefined`);
      }
    } catch (error) {
      console.error(`Error accepting order ${orderId}:`, error);
    }
  };
  
  const handleRejectOrder = async (orderId) => {
    try {
      const data = await makeRequest(`api/orders/${orderId}/reject`, 'POST');
  
      if (data) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'Accepted' } : order
          )
        );
      } else {
        console.error(`Error accepting order ${orderId}: Data is undefined`);
      }
    } catch (error) {
      console.error(`Error accepting order ${orderId}:`, error);
    }
  };
  

  const handleRefresh = () => {
    fetchIncomingOrders();
  };

  const renderOrderItem = ({ item }) => (
    <LinearGradient colors={['#c7c7c7', '#e0e0e0', '#f5f5f5']  } style={{ padding: 20, justifyContent: 'center', alignItems: 'center',borderRadius:15,margin:15}}>

    <View>
      <Text style={styles.orderText}>Order ID: {item.id}</Text>
      <Text style={styles.orderText}>Items: {item.items.join(', ')}</Text>
      <Text style={styles.orderText}>Delivery Address: {item.delivery_address || 'Not specified'}</Text>
      <Text style={styles.orderText}>Status: {item.status}</Text>
      <Ionicons name="md-hourglass" size={24} color="orange" style={styles.hourglassIcon} />

      <TouchableOpacity onPress={() => handleAcceptOrder(item.id)}>
        <View style={styles.actionButton}>
          <Ionicons name="md-checkmark-circle" size={20} color="green" style={styles.actionIcon} />
          <Text style={styles.actionText}>Accept Order</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRejectOrder(item.id)}>
        <View style={styles.actionButton}>
          <Ionicons name="md-close-circle" size={20} color="red" style={styles.actionIcon} />
          <Text style={styles.rejectText}>Reject Order</Text>
        </View>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#f5f5f5']} style={{ padding: 20, height: '100%', justifyContent: 'center', alignItems: 'center' }}>

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Incoming Orders</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="md-refresh" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id.toString()}
        renderItem={renderOrderItem}
      />

       {/* New button to navigate to AcceptedOrdersScreen */}
       <TouchableOpacity onPress={handleShowAcceptedOrders}>
        <View style={styles.navigateButton}>
          <Text style={styles.navigateButtonText}>Show Accepted Orders</Text>
        </View>
      </TouchableOpacity>
    </View>
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

export default OrderScreen;
