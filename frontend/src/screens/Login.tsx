import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, View } from "react-native";
import Config from "react-native-config";

export const Login = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: Config.ANDROID_CLIENT_ID,
    iosClientId: Config.IOS_CLIENT_ID,
    expoClientId: Config.WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      const user = signInWithCredential(auth, credential);
      console.log(user);
    }
  }, [response]);

  return (
    <SafeAreaView>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
    </SafeAreaView>
  );
};
