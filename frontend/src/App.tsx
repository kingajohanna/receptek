import { RootNavigation } from './navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 8,
  },
  emoji: {
    fontSize: 82,
    marginBottom: 24,
  },
});
