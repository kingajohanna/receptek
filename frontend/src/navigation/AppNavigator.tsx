import {Favourites} from '../screens/Favourites';
import {Recipes} from '../screens/Recipes';
import {Settings} from '../screens/Settings';
import {Colors} from '../theme/colors';
import {Tabs} from './tabs';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {androidBottomPadding} from '../utils/androidHelper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Tab = createMaterialBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        activeColor={Colors.verdigris}
        inactiveColor={Colors.teal}
        initialRouteName={Tabs.RECIPES}
        shifting={true}
        barStyle={styles.tabBar}>
        <Tab.Screen
          name={Tabs.FAVOURITES}
          component={Favourites}
          options={{
            tabBarLabel: Tabs.FAVOURITES,
            tabBarIcon: ({color}) => (
              <Fontisto name="bookmark" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name={Tabs.RECIPES}
          component={Recipes}
          options={{
            tabBarLabel: Tabs.RECIPES,
            tabBarIcon: ({color}) => (
              <SimpleLineIcons name="notebook" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name={Tabs.SETTINGS}
          component={Settings}
          options={{
            tabBarLabel: Tabs.SETTINGS,
            tabBarIcon: ({color}) => (
              <SimpleLineIcons name="settings" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderWidth: 0.5,
    borderBottomWidth: 1,
    backgroundColor: Colors.gainsboro,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: 'transparent',
    overflow: 'hidden',
    paddingBottom: androidBottomPadding,
  },
});
