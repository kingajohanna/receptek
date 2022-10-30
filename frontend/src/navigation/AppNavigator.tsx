import {Favourites} from '../screens/Favourites';
import {Recipes} from '../screens/Recipes';
import {Settings} from '../screens/Settings';
import {Colors} from '../theme/colors';
import {Tabs} from './tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: Colors.activeTab,
        tabBarInactiveTintColor: Colors.inactiveTab,
      })}>
      <Tab.Screen name={Tabs.FAVOURITES} component={Favourites} />
      <Tab.Screen name={Tabs.RECIPES} component={Recipes} />
      <Tab.Screen name={Tabs.SETTINGS} component={Settings} />
    </Tab.Navigator>
  );
};

/*
options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" color={color} size={size} />,
        }}
        */
