import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const CLUBS = {

  Driver: {
    source: require('@/assets/images/wood.png'),
    style: { marginTop: -234, marginLeft: 85 },
  },
  Hybrid: {
    source: require('@/assets/images/wood.png'),
    style: { marginTop: -234, marginLeft: 85 },
  },
  Wood: {
    source: require('@/assets/images/wood.png'),
    style: { marginTop: -234, marginLeft: 85 },
  },
  Wedge: {
    source: require('@/assets/images/wedge.png'),
    style: { marginTop: -250, marginLeft: 185 },
  },
  Putter: {
    source: require('@/assets/images/putter.png'),
    style: { marginTop: -250, marginLeft: 170 },
  },
  Iron: {
    source: require('@/assets/images/iron.png'),
    style: { marginTop: -240, marginLeft: 120 },
  },
};

export function ClubIcon({ item, label=true }) {

  console.log('club type:', item.iconType);
  const club = CLUBS[item.iconType];
 
  if (!club) return null;

  return (
    <View style={styles.clubWrapper}>
      <View style={[styles.club]}>
        <Image
          style={{width: 280, height: 280, ...club.style }}
          source={club.source}
        />
      </View>
      {label && 
      <Text style={styles.clubText}>{item.name}</Text>
      }
      </View>
  );
}

const styles = StyleSheet.create({
  club: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
