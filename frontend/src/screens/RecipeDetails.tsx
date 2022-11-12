import {StackScreenProps} from '@react-navigation/stack';
import * as React from 'react';
import {StyleSheet, ScrollView, Text, View, Image} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Ingredients} from '../components/Ingredients';

type Props = StackScreenProps<RecipeStackParamList, 'Recipe'>;

export const RecipeDetails: React.FC<Props> = ({route, navigation}) => {
  const {recipe} = route.params;
  const {ingredients, instructions, title, totalTime, image} = recipe;

  return (
    <ScreenBackground title={''} withoutHeader>
      <ScrollView style={{width: '100%', flex: 1}}>
        <View>
          <Image source={{uri: image}} style={{height: 220}} />
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,

              backgroundColor: 'black',
              opacity: 0.5,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 20,
              right: 0,
              bottom: 0,
              left: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <SimpleLineIcons
                name="arrow-left"
                size={25}
                color="white"
                onPress={() => navigation.goBack()}
              />
              <Text
                style={{color: Colors.white, paddingLeft: 20, fontSize: 20}}>
                {title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                bottom: 10,
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="timer-outline"
                color={Colors.white}
                size={28}
              />
              <Text
                style={{color: Colors.white, paddingLeft: 20, fontSize: 18}}>
                {totalTime}
              </Text>
            </View>
          </View>
        </View>
        <View style={{padding: 10}}>
          <>
            <Text style={styles.title}>Ingredients</Text>
            {ingredients.map((ingredient, index) => {
              return (
                <Ingredients key={'ingredient' + index} style={styles.text}>
                  <Text>{ingredient}</Text>
                </Ingredients>
              );
            })}
            <Text style={styles.title}>Instructions</Text>
            {instructions.map((instruction, index) => {
              return (
                <Text style={[styles.text]} key={'instruction' + index}>
                  {instruction}
                </Text>
              );
            })}
          </>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    lineHeight: 28,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    paddingLeft: 20,
  },
});
