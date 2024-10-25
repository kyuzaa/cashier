import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Alert, Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import POSScreen from '../screens/pos/POSScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    console.log("DIPNCT");
    signOut();
    // Alert.alert(
    //   "Logout",
    //   "Apakah Anda yakin ingin keluar?",
    //   [
    //     {
    //       text: "Batal",
    //       style: "cancel"
    //     },
    //     {
    //       text: "Ya",
    //       onPress: () => signOut()
    //     }
    //   ]
    // );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1f2937', // bg-gray-800
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 80 : 60,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: 'Transaksi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="POS"
        component={POSScreen}
        options={{
          title: 'POS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="archive-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Logout"
        component={EmptyScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
        options={{
          title: 'Logout',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="exit-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Empty screen for logout tab
const EmptyScreen = () => null;