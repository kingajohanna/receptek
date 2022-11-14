import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ImageSourcePropType,
  PressableProps,
  Pressable,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Colors} from '../theme/colors';
import {Recipe} from '../types/recipe';

type ScreenBackgroundProps = {
  recipe: Recipe;
} & PressableProps;

export const RecipeListComponent: React.FC<ScreenBackgroundProps> = ({
  recipe,
  onPress,
}) => {
  const swipeableRef = useRef<Swipeable | null>(null);

  const close = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const renderRightAction = (text, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 0, 100, 104],
      outputRange: [0, 0, 0, 0],
    });

    const pressHandler = () => {
      close();
      //TODO add/remove fav
    };

    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{translateX: trans}],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Fontisto
          name="bookmark"
          color={Colors.teal}
          size={32}
          onPress={() => {
            pressHandler();
          }}
        />
      </Animated.View>
    );
  };

  const renderRightActions = progress => (
    <View
      style={{
        width: 70,
        flexDirection: 'row',
      }}>
      {renderRightAction('More', progress)}
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
      <Pressable style={styles.background} onPress={onPress}>
        <FastImage
          style={styles.image}
          source={{
            uri: recipe.image,
            priority: FastImage.priority.normal,
          }}>
          <View style={styles.overlay} />
          <View style={{padding: 15, paddingLeft: 30}}>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.category && (
              <Text style={styles.text}>{recipe.category}</Text>
            )}
            {recipe.cuisine && (
              <Text style={styles.text}>{recipe.cuisine}</Text>
            )}
            {recipe.totalTime && (
              <Text style={styles.text}>{recipe.totalTime} min</Text>
            )}
          </View>
        </FastImage>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    padding: 8,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 15,
  },
  overlay: {
    borderRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: 'bold',
    zIndex: 1,
    paddingBottom: 3,
  },
  text: {
    fontSize: 14,
    color: Colors.white,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
