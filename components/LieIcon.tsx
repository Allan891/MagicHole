import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const LIES = {

  tee: {
    source: require('@/assets/images/tee.png'),
    style: {  },
  },
  fairway: {
    source: require('@/assets/images/fairway.png'),
    style: {  },
  },
  rough: {
    source: require('@/assets/images/rough.png'),
    style: {  },
  },
  sand: {
    source: require('@/assets/images/sand.png'),
    style: {},
  },
  green: {
    source: require('@/assets/images/green.png'),
    style: {  },
  },
  recovery: {
    source: require('@/assets/images/recovery.png'),
    style: {  },
  },
};

export function LieIcon({ item, label=true }) {

  const lie = LIES[item];
 
  if (!lie) return null;

  return (
    <View style={styles.clubWrapper}>
      <View style={[styles.club]}>
        <Image
          style={{width: 32, height: 32, ...lie.style }}
          source={lie.source}
        />
      </View>
      {label && 
      <Text style={styles.clubText}>{label}</Text>
      }
      </View>
  );
}

const styles = StyleSheet.create({
  club: {
    width: 42,
    height: 42,
    borderRadius: 21,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubWrapper: {
    alignItems: 'center',
    width: 50,
  },
  clubText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});
