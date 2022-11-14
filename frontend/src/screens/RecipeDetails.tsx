import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Ingredients} from '../components/Ingredients';
import {Divider, List, Menu} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Dots from 'react-native-dots-pagination';
import Dialog from 'react-native-dialog';

const {width} = Dimensions.get('window');

type Props = StackScreenProps<RecipeStackParamList, 'Recipe'>;

enum EditModalTypes {
  title = 'title',
  category = 'category',
  time = 'total time',
  cuisine = 'cuisine',
}

export const RecipeDetails: React.FC<Props> = ({route, navigation}) => {
  const {recipe} = route.params;
  const {ingredients, title, totalTime, image} = recipe;
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [openIngredients, setOpenIngredients] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [editModalType, setEditModalType] = useState<EditModalTypes>();
  const [editValue, setEditValue] = useState('');

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      setActiveDot(roundIndex);
    },
    [],
  );

  useEffect(() => {
    if (instructions[instructions.length - 3]?.includes('Ha tetszett'))
      setInstructions(instructions.slice(0, instructions.length - 3));
  });

  return (
    <ScreenBackground title={''} withoutHeader>
      <ScrollView style={{width: '100%'}}>
        <View>
          <Image source={{uri: image}} style={{height: 220}} />
          <View style={styles.imageOverlay} />
          <View style={styles.textOverlay}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <SimpleLineIcons
                name="arrow-left"
                size={25}
                color="white"
                onPress={() => navigation.goBack()}
              />
              <Text
                style={{
                  color: Colors.white,
                  paddingLeft: 20,
                  fontSize: 20,
                  width: width * 0.75,
                }}>
                {title}
              </Text>
              <Menu
                visible={openMenu}
                onDismiss={() => {
                  setOpenMenu(false);
                  setEditModalType(undefined);
                }}
                anchor={
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    color={Colors.white}
                    size={28}
                    onPress={() => setOpenMenu(!openMenu)}
                  />
                }>
                <Menu.Item
                  onPress={() => {
                    setOpenMenu(false);
                    setEditModalType(EditModalTypes.title);
                  }}
                  title="Edit title"
                />
                <Menu.Item
                  onPress={() => {
                    setOpenMenu(false);
                    setEditModalType(EditModalTypes.category);
                  }}
                  title="Edit category"
                />
                <Menu.Item
                  onPress={() => {
                    setOpenMenu(false);
                    setEditModalType(EditModalTypes.time);
                  }}
                  title="Edit total time"
                />
                <Menu.Item
                  onPress={() => {
                    setOpenMenu(false);
                    setEditModalType(EditModalTypes.cuisine);
                  }}
                  title="Edit cuisine"
                />
              </Menu>
            </View>
            {totalTime && (
              <View style={styles.timerIconStyle}>
                <MaterialCommunityIcons
                  name="timer-outline"
                  color={Colors.white}
                  size={28}
                />

                <Text
                  style={{color: Colors.white, paddingLeft: 10, fontSize: 18}}>
                  {totalTime} min
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{padding: 10}}>
          <List.Accordion
            title="Ingredients"
            id="1"
            expanded={openIngredients}
            onPress={() => setOpenIngredients(!openIngredients)}
            titleStyle={{color: Colors.teal}}>
            <View style={styles.ingredientsContainer}>
              {ingredients.map((ingredient, index) => {
                return (
                  <Ingredients key={'ingredient' + index} style={styles.text}>
                    <Text>{ingredient}</Text>
                  </Ingredients>
                );
              })}
            </View>
          </List.Accordion>

          <Text style={styles.title}>Instructions</Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            data={instructions}
            onScroll={onScroll}
            renderItem={({item, index}) => (
              <View
                key={'instruction' + index}
                style={{
                  backgroundColor: Colors.gainsboro,
                  width: width - 20,
                  borderRadius: 10,
                  padding: 10,
                  paddingLeft: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={[styles.text]} key={'instruction' + index}>
                  {item}
                </Text>
              </View>
            )}></FlatList>
          <Dots
            length={instructions.length}
            active={activeDot}
            activeColor={Colors.teal}
          />
        </View>
      </ScrollView>
      <Dialog.Container visible={editModalType !== undefined}>
        <Dialog.Title>Edit {editModalType}</Dialog.Title>
        <Dialog.Input
          placeholder={editModalType}
          value={editValue}
          onChangeText={text => setEditValue(text)}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setEditValue('');
            setEditModalType(undefined);
          }}
        />
        <Dialog.Button
          label="Change"
          onPress={() => {
            setEditValue('');
            //TODO call the right endpoint
            setEditModalType(undefined);
          }}
        />
      </Dialog.Container>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    lineHeight: 56,
    color: Colors.teal,
    paddingLeft: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  textOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    bottom: 0,
    left: 20,
  },
  timerIconStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  ingredientsContainer: {
    backgroundColor: Colors.gainsboro,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
