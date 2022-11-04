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
import {createStackNavigator} from '@react-navigation/stack';
import {RecipeDetails} from '../screens/RecipeDetails';
import {DrawerActions} from '@react-navigation/native';
import {Recipe} from '../types/recipe';

export type RecipeStackParamList = {
  Recipes: undefined;
  Recipe: {recipe: Recipe};
};

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator<RecipeStackParamList>();

function RecipeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Tabs.RECIPES}
        component={Recipes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Tabs.RECIPE}
        component={RecipeDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <SafeAreaProvider style={{backgroundColor: Colors.background}}>
      <Tab.Navigator
        activeColor={Colors.verdigris}
        inactiveColor={Colors.teal}
        initialRouteName={Tabs.RECIPENAVIGATOR}
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
          name={Tabs.RECIPENAVIGATOR}
          component={RecipeNavigator}
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
