import * as React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {ScreenBackground} from '../components/TabHeader';
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
              .then(() => userStore.setUser(undefined));
          },
        },
      ]);
    } catch (error) {
      return Alert.alert(en.auth.error);
    }
  };

  return (
    <ScreenBackground title={Tabs.SETTINGS}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Pressable style={styles.buttonContainer} onPress={() => onSignout()}>
          <View style={styles.iconContainer}>
            <SimpleLineIcons name="logout" size={20} />
          </View>
          <Text style={styles.text}>Logout</Text>
        </Pressable>
      </View>
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
