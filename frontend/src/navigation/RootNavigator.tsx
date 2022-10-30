import {useStore} from '../stores';
import {AppNavigator} from './AppNavigator';
import {AuthNavigator} from './AuthNavigator';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React from 'react';

export const RootNavigation = observer(() => {
  const {userStore} = useStore();

  return (
    <NavigationContainer>
      {userStore.isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
});
