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

  return (
    <ScreenBackground title={''} withoutHeader>
      <View style={{paddingTop: 20, width: '100%', flex: 1}}>
        <Image source={{uri: recipe.image}} />
        <Text>{recipe.title}</Text>
      </View>
    </ScreenBackground>
  );
};
