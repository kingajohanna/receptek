import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ImageSourcePropType,
  PressableProps,
  Pressable,
} from 'react-native';
import {Colors} from '../theme/colors';

type ScreenBackgroundProps = {
  title: string;
  image: ImageSourcePropType;
} & PressableProps;

export const RecipeListComponent: React.FC<ScreenBackgroundProps> = ({
  title,
  image,
  onPress,
}) => (
  <Pressable style={styles.background} onPress={onPress}>
    <ImageBackground
      source={image}
      resizeMode="cover"
      style={styles.image}
      imageStyle={{borderRadius: 15}}>
      <View style={styles.overlay} />
      <View style={{padding: 15, paddingLeft: 30}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.text}>{title}</Text>
      </View>
    </ImageBackground>
  </Pressable>
);

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 180,

    alignSelf: 'center',
    padding: 12,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
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
});
