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

import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '@/app/state/globalStateVar';

export const CoursePicker = ({ onChooseCourse }) => {
  const renderCourse = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.courseItem}
        onPress={() => {
          globalStateVar.getState().setSelectedCourse(item);
          onChooseCourse(item.id);
        }}
      >
        <Text style={styles.courseText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.modal}>
      <ThemedText>Choose your course!</ThemedText>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCourse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
  modal: {
    position: 'absolute',
    height: '80%',
    width: '80%',
    left: '10%',
    top: '10%',
    backgroundColor: 'white',
    zIndex: 99999999,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10, // For Android shadow
    padding: 10,
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

