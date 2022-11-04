import * as React from 'react';
import {Text, View} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {Tabs} from '../navigation/tabs';

export const Favourites = () => {
  return (
    <ScreenBackground title={Tabs.FAVOURITES}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Favourites!</Text>
      </View>
    </ScreenBackground>
  );
};
