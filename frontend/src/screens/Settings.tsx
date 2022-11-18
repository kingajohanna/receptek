import * as React from 'react';
import {Text, View, StyleSheet, Pressable, Alert} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {ScreenBackground} from '../components/Background';
import {Tabs} from '../navigation/tabs';
import {Colors} from '../theme/colors';
import auth from '@react-native-firebase/auth';
import {useStore} from '../stores';
import en from '../locales/en';

export const Settings = () => {
  const {userStore} = useStore();

  const onSignout = () => {
    try {
      Alert.alert('Logout', `Click OK to logout!`, [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            auth()
              .signOut()
              .then(() => userStore.setIsLoggedIn(false));
          },
        },
      ]);
    } catch (error) {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  return (
    <ScreenBackground title={Tabs.SETTINGS}>
      <Pressable style={styles.buttonContainer} onPress={() => onSignout()}>
        <View style={styles.iconContainer}>
          <SimpleLineIcons name="logout" size={20} />
        </View>
        <Text style={styles.text}>Logout</Text>
      </Pressable>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 12,
    paddingHorizontal: 15,
    backgroundColor: Colors.gainsboro,
    width: 342,
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 20,
    alignItems: 'center',
    transform: [{scaleX: -1}],
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
  },
});
