import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  ScrollView,
  View,
  Platform,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Dimensions,
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
import {addRecipe, getRecipes} from '../constants/backend';
import {urlCheck} from '../utils/regex';
import {FAB, List} from 'react-native-paper';
import {Colors} from '../theme/colors';
import {ButtonGroup} from '../components/ButtonGroup';
import RBSheet from 'react-native-raw-bottom-sheet';

const {height} = Dimensions.get('window');

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const [text, onChangeText] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [cuisineOpen, setCuisineOpen] = useState('');

  const refRBSheet = useRef() as React.MutableRefObject<RBSheet>;

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
          {recipeStore.recipes.map((recipe, index) => (
            <RecipeListComponent
              recipe={recipe}
              key={'recipe' + index}
              onPress={() => accessPage(recipe)}
            />
          ))}
        </ScrollView>

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={height * 0.7}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              padding: 20,
              paddingTop: 5,
            },
          }}>
          <TextInput
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
            }}
            onChangeText={onChangeText}
            value={text}
            placeholder="Search recipes"
          />
          <ButtonGroup />

          <View style={{flexDirection: 'row', padding: 8}}>
            <View style={{width: '50%', paddingRight: 4}}>
              <List.Accordion
                title="Ingredients"
                id="1"
                expanded
                onPress={() => {}}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  padding: 0,
                  height: 40,
                }}
                titleStyle={{color: Colors.teal}}>
                <List.Item title="First item" />
                <List.Item title="Second item" />
              </List.Accordion>
            </View>
            <View style={{width: '50%', paddingLeft: 4}}>
              <List.Accordion
                title="Ingredients"
                id="1"
                expanded
                onPress={() => {}}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  padding: 0,
                  height: 40,
                }}
                titleStyle={{color: Colors.teal}}>
                <List.Item title="First item" />
                <List.Item title="Second item" />
              </List.Accordion>
            </View>
          </View>
        </RBSheet>
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
