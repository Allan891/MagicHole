import { useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, Touchable, TouchableOpacity } from 'react-native';
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

export function HoleOverview({ holeData, courseId}) {

  //console.log('holedata', holeData)
  



  const getColor = (par,strokes) => {
    const diff = strokes - par;
    
    let color = "gray";

    if (diff > 3){
      color = "black";
    }else if (diff == 2){
      color = "brown";
    }else if (diff == 1){
      color = "red";
    }else if (diff == 0){
      color = "yellow";
    }else if (diff == -1){
      color = "green";
    }else if (diff == -2){
      color = "blue";
    }
    //console.log('What color', color)
    return color;

  }
  


  const renderHole = ({item, index}) => (

    <View 
    style={[styles.hole, 
      {
        backgroundColor: getColor(getPar(courseId)[index] , item)
      } ]}>
    </View>

  );

  return (
    <View style={styles.container}>
      <FlatList
        data={holeData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderHole}
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
    height: 20,
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
});

