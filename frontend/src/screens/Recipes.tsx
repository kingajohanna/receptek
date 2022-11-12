import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, View, Platform} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Recipe} from '../types/recipe';
import ShareMenu, {ShareCallback, ShareData} from 'react-native-share-menu';
import {addRecipe, getRecipes} from '../constants/backend';
import {urlCheck} from '../utils/regex';

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const [recipes, setRecipes] = useState<Recipe[] | undefined>(undefined);

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

  return (
    <ScreenBackground title={Tabs.RECIPES}>
      <View style={{paddingTop: 20, width: '100%', flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            width: '100%',
          }}>
          {recipeStore.recipes.map((recipe, index) => (
            <RecipeListComponent
              recipe={recipe}
              key={'recipe' + index}
              onPress={() => accessPage(recipe)}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
});
