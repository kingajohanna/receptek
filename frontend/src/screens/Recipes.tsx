import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, View, Platform, StyleSheet} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Recipe} from '../types/recipe';
import ShareMenu, {ShareCallback, ShareData} from 'react-native-share-menu';
import {addRecipe} from '../constants/backend';
import {urlCheck} from '../utils/regex';
import {FAB} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SearchModal} from '../components/SearchModal';
import {all} from '../stores/RecipeStore';

export enum Time {
  fast = 'fast',
  medium = 'medium',
  slow = 'slow',
}

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const [recipes, setRecipes] = useState(recipeStore.recipes);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(all);
  const [cuisine, setCuisine] = useState(all);
  const [time, setTime] = useState<Time | undefined>(undefined);

  const refRBSheet = useRef() as React.MutableRefObject<RBSheet>;

  const reset = () => {
    setText('');
    setCategory('');
    setCuisine('');
    setTime(undefined);
  };

  const handleShare: ShareCallback = useCallback((share?: ShareData) => {
    if (!share) {
      return;
    }

    const {data} = share;
    const url = Array.isArray(data) ? data[0] : data;

    if (url.match(urlCheck) && Platform.OS === 'ios')
      addRecipe(url).then(() => recipeStore.setRecipes());
    else {
      Alert.alert(
        'Add recipe',
        'Do you want to add this recipe to your collection?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              addRecipe(url).then(() => recipeStore.setRecipes());
            },
          },
        ],
      );
    }
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  });

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  });

  const accessPage = (recipe: Recipe) =>
    navigation.navigate(Tabs.RECIPE, {recipe});

  useEffect(() => {
    const keys: string[] = [];
    const values: string[] = [];

    if (text) {
      keys.push('title');
      values.push(text);
    }
    if (category !== all) {
      keys.push('category');
      values.push(category);
    }

    if (cuisine !== all) {
      keys.push('cuisine');
      values.push(cuisine);
    }

    const filteredRecipes = (keysEvery: string[], valuesEvery: string[]) =>
      recipeStore.recipes.filter(item =>
        keysEvery.every(key =>
          valuesEvery.some(val =>
            item[key]?.toLowerCase().includes(val.toLowerCase()),
          ),
        ),
      );

    return setRecipes(filteredRecipes(keys, values));
  }, [text, category, cuisine, time, recipeStore.recipes]);

  return (
    <ScreenBackground title={Tabs.RECIPES}>
      <FAB
        icon="magnify"
        style={styles.fab}
        onPress={() => refRBSheet.current!.open()}
      />
      <View style={{width: '100%', flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            width: '100%',
          }}>
          {recipes.map((recipe, index) => (
            <RecipeListComponent
              recipe={recipe}
              key={'recipe' + index}
              onPress={() => accessPage(recipe)}
            />
          ))}
        </ScrollView>
        <SearchModal
          refRBSheet={refRBSheet}
          onChangeText={setText}
          text={text}
          time={time}
          setTime={setTime}
          category={category}
          setCategory={setCategory}
          cuisine={cuisine}
          setCuisine={setCuisine}
          reset={reset}
          search={reset}
        />
      </View>
    </ScreenBackground>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
