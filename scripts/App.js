import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
// Screens
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import LandingScreen from './screens/LandingScreen';
import MapScreen from './screens/MapScreen';
import ReportScreen from './screens/ReportScreen';

// Navigation types
export type RootStackParamList = {
  Landing: undefined;
  Auth: undefined;
  Main: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Map: undefined;
  Report: undefined;
};

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0QJY16vSNzSW108VBTYOZ-bK2kU2PT8E",
  authDomain: "lakwatsafe.firebaseapp.com",
  projectId: "lakwatsafe",
  storageBucket: "lakwatsafe.firebasestorage.app",
  messagingSenderId: "646168608601",
  appId: "1:646168608601:web:b3668f68af892a1dc1d648",
  measurementId: "G-8F100R29RP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

interface TabNavigatorScreenOptionsProps {
  route: {
    name: keyof TabParamList;
  };
}

function TabNavigator(): React.JSX.Element {
  const getTabBarIcon = (routeName: keyof TabParamList) => {
    return ({ focused }: TabIconProps) => {
      let iconName: string;
      
      if (routeName === 'Dashboard') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (routeName === 'Map') {
        iconName = focused ? 'map' : 'map-outline';
      } else if (routeName === 'Report') {
        iconName = focused ? 'warning' : 'warning-outline';
      } else {
        iconName = 'help-outline';
      }
      
      return <Icon name={iconName} size={24} color={focused ? '#4A90E2' : 'gray'} />;
    };
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }: TabNavigatorScreenOptionsProps) => ({
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
    </Tab.Navigator>
  );
}

export default function App(): React.JSX.Element | null {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return null; // Add a proper loading screen if needed
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}