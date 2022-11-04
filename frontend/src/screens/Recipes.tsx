import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {ImageSourcePropType, ScrollView, Text, View} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Recipe} from '../types/recipe';

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

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
              title={recipe.title}
              image={{
                uri: recipe.image,
              }}
              key={'recipe' + index}
              onPress={() => accessPage(recipe)}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
});
