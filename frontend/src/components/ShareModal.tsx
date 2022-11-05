import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Button,
  Modal,
  AppRegistry,
} from 'react-native';
import {ShareMenuReactView} from 'react-native-share-menu';

const Share = () => {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    console.log('effect called');
    ShareMenuReactView.data().then(({mimeType, data}) => {
      console.log(data);
      setSharedData(data);
      setSharedMimeType(mimeType);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 24}}>Add this recipe to Mealo</Text>
      {sharedMimeType === 'text/plain' && <Text>{sharedData}</Text>}
      {sharedMimeType.startsWith('image/') && (
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{uri: sharedData}}
        />
      )}
      <View style={{flexDirection: 'row'}}>
        <Button
          title="Dismiss"
          onPress={() => {
            ShareMenuReactView.dismissExtension();
          }}
        />
        <Button
          title="Send"
          onPress={async () => {
            console.log('asdasd');

            const response = await fetch(
              'http://192.168.1.168:8000/recipe/add',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  url: sharedData,
                }),
              },
            );
            setSharedData(JSON.stringify(response.body));
            //ShareMenuReactView.dismissExtension();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 20,
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
