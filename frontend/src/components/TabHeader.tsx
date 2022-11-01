import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ViewProps,
} from 'react-native';
import {Colors} from '../theme/colors';

type ScreenBackgroundProps = {
  title: string;
} & ViewProps;

/**
 *    base background, with header and optinal error message
 */
export const ScreenBackground: React.FC<ScreenBackgroundProps> = props => (
  <SafeAreaView
    style={{
      backgroundColor: Colors.gainsboro,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    }}>
    <View style={styles.background}>
      <Text style={styles.text}>{props.title}</Text>
    </View>
    {props.children}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.gainsboro,
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: Colors.gainsboro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});
