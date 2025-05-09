import { StrokeLieType } from '@/app/db/GolfDatabaseTypes';
import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const LIES = {

  Tee: {
    source: require('@/assets/images/tee.png'),
    style: {  },
  },
  Fairway: {
    source: require('@/assets/images/fairway.png'),
    style: {  },
  },
  Rough: {
    source: require('@/assets/images/rough.png'),
    style: {  },
  },
  Sand: {
    source: require('@/assets/images/sand.png'),
    style: {},
  },
  Green: {
    source: require('@/assets/images/green.png'),
    style: {  },
  },
  Recovery: {
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
