import { Favourites } from '../screens/Favourites';
import { Recipes } from '../screens/Recipes';
import { Settings } from '../screens/Settings';
import { Colors } from '../theme/colors';
import { Tabs } from './tabs';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: Colors.activeTab,
        tabBarInactiveTintColor: Colors.inactiveTab,
      })}
    >
      <Tab.Screen
        name={Tabs.FAVOURITES}
        component={Favourites}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Tabs.RECIPES}
        component={Recipes}
        options={{
          tabBarIcon: ({ color, size }) => <AntDesign name="book" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={Tabs.SETTINGS}
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
