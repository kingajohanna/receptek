import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useState} from 'react';
import {
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

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');

  const handleShare: ShareCallback = useCallback((share?: ShareData) => {
    if (!share) {
      return;
    }

    const {mimeType, data, extraData} = share;

    setSharedData(data);
    setSharedMimeType(mimeType);
    // You can receive extra data from your custom Share View
    console.log(extraData);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    console.log('kaki1');
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    console.log('kaki2');

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
            const response = await fetch(
              'http://192.168.1.168:8000/recipe/add',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  url: 'https://streetkitchen.hu/instant/rantott-edesburgonya/',
                }),
              },
            );
            console.log(response);
          }}
        />
        <Text>{sharedData}</Text>
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
