import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  ImageSourcePropType,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Recipe} from '../types/recipe';
import ShareMenu, {ShareCallback, ShareData} from 'react-native-share-menu';
import {addRecipeURL, addRecipe} from '../constants/backend';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const handleShare: ShareCallback = useCallback((share?: ShareData) => {
    console.log('*', share);
    if (!share) {
      return;
    }
    console.log('*', share);

    const {data, extraData} = share;
    console.log(extraData, data);

    if (data)
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
            onPress: async () => {
              const response = await addRecipe(
                Array.isArray(data) ? data[0] : data,
              );
              console.log(response);
            },
          },
        ],
      );
  }, []);

  useEffect(() => {
    console.log('kaki');
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    console.log('kaki');
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  const accessPage = (recipe: Recipe) =>
    navigation.navigate(Tabs.RECIPE, {recipe});

  return (
    <ScreenBackground title={Tabs.RECIPES}>
      <View style={{paddingTop: 20, width: '100%', flex: 1}}>
        <Button
          title="press"
          onPress={async () => {
            const token = await auth().currentUser?.getIdToken(true);
            console.log(token);

            const response = await fetch(addRecipeURL, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: token!,
              },
              body: JSON.stringify({
                url: 'www.google.com',
              }),
            });
            console.log(response);
          }}
        />
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
