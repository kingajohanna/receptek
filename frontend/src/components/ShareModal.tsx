import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
  Image,
  Text,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {ShareMenuReactView} from 'react-native-share-menu';
import Dialog from 'react-native-dialog';

const height = Dimensions.get('window').height;

const Share = () => {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');

  useEffect(() => {
    console.log('effect called');
    ShareMenuReactView.data().then(({mimeType, data}) => {
      setSharedData(data);
      setSharedMimeType(mimeType);
    });
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString('hello world');
  };

  return (
    <View>
      <Dialog.Container visible={true}>
        <Dialog.Title>Add recipe</Dialog.Title>
        <Dialog.Description>asd</Dialog.Description>
        <Dialog.Button
          label="Dismiss"
          onPress={() => {
            ShareMenuReactView.dismissExtension();
          }}
        />
        <Dialog.Button
          label="Add"
          onPress={() => {
            copyToClipboard();
            ShareMenuReactView.continueInApp({hello: 'from the other side'});
          }}
        />
      </Dialog.Container>
    </View>
  );
};
/*
<Dialog.Container visible={true}>
          <Dialog.Title>Add recipe</Dialog.Title>
          <Dialog.Description>asd</Dialog.Description>
          <Dialog.Button
            label="Dismiss"
            onPress={() => {
              ShareMenuReactView.dismissExtension();
            }}
          />
          <Dialog.Button
            label="Add"
            onPress={() => {
              ShareMenuReactView.continueInApp({url: 'kaki'});
            }}
          />
        </Dialog.Container>
        */

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: height / 3,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destructive: {
    color: 'red',
  },
  send: {
    color: 'blue',
  },
  sending: {
    color: 'grey',
  },
  image: {
    width: '100%',
    height: 200,
  },
  buttonGroup: {
    alignItems: 'center',
  },
});

export default Share;
