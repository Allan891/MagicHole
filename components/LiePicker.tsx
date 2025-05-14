import { useEffect } from 'react';
import { Image, FlatList, StyleSheet, View, Text, Touchable, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import courses from '@/constants/courses';
import {getPar} from '@/utils';
import { ThemedText } from '@/components/ThemedText';
import { ClubIcon } from './ClubIcon';
import { globalStateVar } from '@/app/state/globalStateVar';
import { LieIcon } from './LieIcon';
import { StrokeLieType } from '@/app/db/GolfDatabaseTypes';

export function LiePicker({onLieChoose}) {

  const lies = [StrokeLieType.tee, StrokeLieType.fairway, StrokeLieType.rough, StrokeLieType.sand, StrokeLieType.green, StrokeLieType.recovery];
  
  const renderLie = ({ item, index }) => {
  
  
    return (
      <TouchableOpacity style={styles.clubwrapper} onPress={() => onLieChoose(item)}>
      <LieIcon item={item} label={item} />
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <FlatList
        data={lies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderLie}
        horizontal={true} // Set horizontal to true
        contentContainerStyle={styles.listStyle}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  listStyle: {
    gap: 3
  },
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
  hole: {
    // flex: 1,
    backgroundColor: 'yellow',
    width: 17,
    height : 4,
    borderRadius: 2,
  },
  container: {
    flex: 1
    // backgroundColor: "magenta"
  },
  courseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  courseText: {
    fontSize: 18,
  },
  club: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  clubwrapper: {
    alignContent: 'center',
    textAlign: 'center',
    width: 50
  },
  clubtext: {
    fontSize: 10,
    textAlign: 'center'
  }
});

