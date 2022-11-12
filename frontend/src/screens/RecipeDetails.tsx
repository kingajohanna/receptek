import {StackScreenProps} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {ImageSourcePropType, ScrollView, Text, View, Image} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';

type Props = StackScreenProps<RecipeStackParamList, 'Recipe'>;

export const RecipeDetails: React.FC<Props> = ({route, navigation}) => {
  const {recipe} = route.params;
  console.log(JSON.stringify(recipe));

  return (
    <ScreenBackground title={''} withoutHeader>
      <ScrollView style={{width: '100%', flex: 1}}>
        <Image source={{uri: recipe.image}} style={{height: 220}} />

        <Text>{recipe.title}</Text>
      </ScrollView>
    </ScreenBackground>
  );
};
