import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Recipe} from '../types/recipe';
import {FAB} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SearchModal} from '../components/SearchModal';
import {all} from '../stores/RecipeStore';

export enum Time {
  fast = 'fast',
  moderate = 'moderate',
  slow = 'slow',
}

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);

  const [recipes, setRecipes] = useState(recipeStore.recipes);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(all);
  const [cuisine, setCuisine] = useState(all);
  const [time, setTime] = useState<Time | undefined>(undefined);

  const refRBSheet = useRef() as React.MutableRefObject<RBSheet>;

  const reset = () => {
    setText('');
    setCategory(all);
    setCuisine(all);
    setTime(undefined);
    setRecipes(recipeStore.recipes);
  };

  const accessPage = (recipe: Recipe) =>
    navigation.navigate(Tabs.RECIPE, {recipe});

  useEffect(() => {
    if (
      category === all &&
      cuisine === all &&
      text === '' &&
      time === undefined
    )
      return setRecipes(recipeStore.recipes);

    const keys: string[] = [];
    const values: string[] = [];

    if (category !== all) {
      keys.push('category');
      values.push(category);
    }

    if (cuisine !== all) {
      keys.push('cuisine');
      values.push(cuisine);
    }

    if (text) {
      keys.push('title');
      values.push(text);
    }

    if (time) {
      keys.push('speed');
      values.push(time);
    }

    const filter = (recipe: Recipe) => {
      for (let i = 0; i < keys.length; i++) {
        if (
          !recipe[keys[i]] ||
          !recipe[keys[i]].toLowerCase().includes(values[i].toLowerCase())
        ) {
          return false;
        }
      }
      return true;
    };

    const filteredRecipes = recipeStore.recipes.filter(filter);

    return setRecipes(filteredRecipes);
  }, [text, category, cuisine, time, recipeStore.recipes]);

  const renderItem = ({item}) => (
    <RecipeListComponent recipe={item} onPress={() => accessPage(item)} />
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await recipeStore.refresh();
    setRefreshing(false);
  };

  return (
    <ScreenBackground title={Tabs.RECIPES}>
      <FAB
        icon="magnify"
        style={styles.fab}
        onPress={() => refRBSheet.current!.open()}
      />
      <View style={{width: '100%', flex: 1}}>
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={item => item._id!}
          refreshing={refreshing}
          onRefresh={() => onRefresh()}
        />
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
          search={() => refRBSheet.current!.close()}
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
