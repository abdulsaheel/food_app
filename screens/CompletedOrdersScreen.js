import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';
// import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Ionicons } from '@expo/vector-icons';

// import { BASE_URL } from '../constants';
const BASE_URL = 'http://chat.atharvadsc.com:9056';

const CompletedOrdersScreen = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/completed-orders`);
        const data = await response.json();

        if (response.ok) {
          setCompletedOrders(data.completed_orders);
        } else {
          console.error('Error fetching completed orders:', data.error || 'Something went wrong');
        }
      } catch (error) {
        console.error('Error fetching completed orders:', error);
      }
    };

    fetchCompletedOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <List.Item
      title={`Order ID: ${item.id}`}
      description={`Items: ${item.items.join(', ')}`}
      left={() => <Ionicons name="md-checkmark" size={24} color="green" />}
      style={styles.orderItem}
      titleStyle={{ fontWeight: 'bold' }}
      descriptionStyle={{ color: theme.colors.text }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Orders</Text>
      <FlatList
        data={completedOrders}
        keyExtractor={order => order.id.toString()}
        renderItem={renderOrderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#f0f0f0',
  },
});

export default CompletedOrdersScreen;
