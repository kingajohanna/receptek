import {RootNavigation} from './navigation/RootNavigator';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import {useStore} from './stores';

export default function App() {
  const {recipeStore} = useStore();

  useEffect(() => {
    recipeStore.setRecipes();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
