import {useStore} from '../stores';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Alert, Button, SafeAreaView, View} from 'react-native';
import Config from 'react-native-config';
import SocialLoginScreen from './auth/SocialLoginScreen';
import en from '../locales/en';

const firebasePassword = '(?=.*[0-9a-zA-Z]).{6,}';
const firebaseEmail = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

export const Login = () => {
  const {userStore} = useStore();
  const [isLoginButtonSpinner, setIsLoginButtonSpinner] = useState(false);
  const [loginText, setLoginText] = useState(en.auth.login.letscook);
  const [signUpText, setSignUpText] = useState(en.auth.signup.signup);
  const [loginTitleText, setLoginTitleText] = useState(
    en.auth.loginTitle.login,
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  GoogleSignin.configure({
    webClientId:
      '454226409378-4cu0r9hs4oikqlrkc7ii6b373cqe5pqq.apps.googleusercontent.com',
    iosClientId:
      '454226409378-2lpgl2munagbd2397mnalbakcn80eocg.apps.googleusercontent.com',
  });

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const {idToken} = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      await auth().signInWithCredential(googleCredential);

      userStore.setIsLoggedIn(true);

      return;
    } catch (error) {
      // The user canceled the sign in request
      if (error.code === '-5') return;
      // else
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  const onRegister = async (
    email: string,
    password: string,
    repassword: string,
  ) => {
    try {
      if (
        !password ||
        !repassword ||
        !email ||
        password !== repassword ||
        !password.match(firebasePassword) ||
        !email.match(firebaseEmail)
      ) {
        return Alert.alert(en.auth.error.title, en.auth.error.text);
      }

      await auth().createUserWithEmailAndPassword(email, password);
      userStore.setIsLoggedIn(true);

      return;
    } catch {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  const onLogin = async (email: string, password: string) => {
    try {
      if (
        !password ||
        !email ||
        !password.match(firebasePassword) ||
        !email.match(firebaseEmail)
      ) {
        return Alert.alert(en.auth.error.title, en.auth.error.text);
      }

      await auth().signInWithEmailAndPassword(email, password);
      userStore.setIsLoggedIn(true);

      return;
    } catch {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  const passwordReset = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return;
    } catch {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  return (
    <>
      <SocialLoginScreen
        onUserNameChangeText={email => setEmail(email)}
        onPasswordChangeText={password => setPassword(password)}
        onRepasswordChangeText={repassword => setRepassword(repassword)}
        onLoginPress={() => {
          loginText === en.auth.login.letscook
            ? onLogin(email, password)
            : onRegister(email, password, repassword);
        }}
        loginButtonSpinnerVisibility={isLoginButtonSpinner}
        onForgotPasswordPress={() => passwordReset(email)}
        rightTopAssetImageSource={require('../assets/images/ramen.png')}
        leftBottomAssetImageSource={require('../assets/images/chef.png')}
        googleSpinnerColor={'#4267B2'}
        enableGoogleLogin
        onGoogleLoginPress={() => {
          onGoogleButtonPress();
        }}
        loginTitleText={loginTitleText}
        loginText={loginText}
        signUpText={signUpText}
        onSignUpPress={(isSignUp: boolean) => {
          setLoginText(isSignUp ? en.auth.login.signup : en.auth.login.signup);
          setSignUpText(
            isSignUp ? en.auth.signup.login : en.auth.signup.signup,
          );
          setLoginTitleText(
            isSignUp ? en.auth.loginTitle.signup : en.auth.loginTitle.login,
          );
        }}
      />
    </>
  );
};
