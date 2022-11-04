import {useStore} from '../stores';
import {AppNavigator} from './AppNavigator';
import {AuthNavigator} from './AuthNavigator';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/auth';

export const RootNavigation = () => {
  const {userStore} = useStore();

  const [loggedIn, setLoggedIn] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  useEffect(() => {
    if (loggedIn) userStore.setIsLoggedIn(true);
    else userStore.setIsLoggedIn(false);
  }, [loggedIn]);

  return (
    <NavigationContainer>
      {loggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
