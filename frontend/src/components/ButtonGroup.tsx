import React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../theme/colors';

export const ButtonGroup = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
      }}>
      <MaterialCommunityIcons
        name="speedometer-slow"
        color={Colors.teal}
        size={36}
        style={styles.icon}
      />
      <MaterialCommunityIcons
        name="speedometer-medium"
        color={Colors.teal}
        size={36}
        style={styles.icon}
      />
      <MaterialCommunityIcons
        name="speedometer"
        color={Colors.teal}
        size={36}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {borderWidth: 1, borderRadius: 10, marginHorizontal: 2},
});
