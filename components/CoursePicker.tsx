import React, { useState, useEffect } from 'react';
import {
  TextInput, FlatList, StyleSheet, View, Text,
  TouchableOpacity, Modal, Image
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import courses from '@/constants/courses';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { calculateDistance, search } from "@/utils";
import { globalStateVar } from '../app/state/globalStateVar';
import * as Location from 'expo-location';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';


export function CoursePicker({ onChooseCourse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const location = globalStateVar((state) => state.location);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const checkIfOnboardingSeen = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!hasSeen || hasSeen === 'false') {
        setShowOnboarding(true);
      }
    };
    checkIfOnboardingSeen();
  }, []);

  useEffect(() => {
    if (searchTerm !== '') return;
    if (!location) return;

    for (const course of courses) {
      const ourdistance = Math.round(
        calculateDistance(
          location.latitude, location.longitude,
          course.holes[0].teeBack.latitude,
          course.holes[0].teeBack.longitude
        ) / 1000
      );
      course.distance = ourdistance;
    }
    courses.sort((a, b) => a.distance - b.distance);
    setFilteredCourses(courses.slice(0, 10));
  }, [location, searchTerm]);

  useEffect(() => {
    if (searchTerm.length < 1) return;
    const searchresults = search(courses, searchTerm);
    const newResults = searchresults.map(a => a.item);
    setFilteredCourses(newResults);
  }, [searchTerm]);

  const renderCourse = ({ item }) => (
    <View style={styles.courseItem}>
      <TouchableOpacity onPress={() => onChooseCourse(item.id)}>
        <Text style={styles.courseText}>{item.name}</Text>
        <Text style={styles.courseDistanceText}>{item.distance} km</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.modal}>
      <ThemedText style={{ fontWeight: 'bold', textAlign: 'center' }}>
        Choose your course
      </ThemedText>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Courses"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {filteredCourses.length > 0 ? (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCourse}
        />
      ) : (
        <View style={styles.notFoundWrapper}>
          <Icon name="error" size={24} color="red" />
          <Text style={styles.notFoundText}>Course not found</Text>
        </View>
      )}

      {/* Onboarding Modal */}
      <Modal visible={showOnboarding} animationType="slide">
        <Onboarding
          onDone={async () => {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            setShowOnboarding(false);
          }}
          onSkip={async () => {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            setShowOnboarding(false);
          }}
          pages={[
            {
              backgroundColor: '#fff',
              image: (
                <Image
                  source={require('../assets/images/adaptive-icon.png')}
                  style={{ width: '50%', height: '50%', resizeMode: 'contain' }}
                />
              ),

              title: 'Welcome to Magic Hole',
              subtitle: 'Your digital golf tracking, let’s take you in a short journey to find out the app!',
            },
            {
              backgroundColor: '#e0f7fa',
              image: (
                <Image
                  source={require('../assets/images/s1.png')}
                  style={{ width: '60%', height: '70%', resizeMode: 'stretch' }}
                />
              ),
              title: 'Choose the course',
              subtitle: 'Select course by distance or name.',
            },
            {
              backgroundColor: '#e0f7fa',
              image: (
                <Image
                  source={require('../assets/images/s3.png')}
                  style={{ width: '50%', height: '70%', resizeMode: 'stretch' }}
                />
              ),
              title: 'Check your history',
              subtitle: 'Review past rounds, scores, and course performance.',
            },
            {
              backgroundColor: '#e0f7fa',
              image: (
                <Image
                  source={require('../assets/images/s5.png')}
                  style={{ width: '50%', height: '70%', resizeMode: 'stretch' }}
                />
               ),
              title: 'Tracking your improvement',
              subtitle: 'Track strokes gained, fairways hit, and putts.',
            },
            {
              backgroundColor: '#e0f7fa',
              image: (
                <Image
                  source={require('../assets/images/Last.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
                />
               ),
              title: 'Tracking your improvement',
              subtitle: 'Track strokes gained, fairways hit, and putts.',
            },
          ]}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    position: 'absolute',
    maxHeight: '80%',
    width: '80%',
    // height: '80%',
    left: '8%',
    top: '10%',
    backgroundColor: 'white',
    zIndex: 99999999,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    padding: 10,
  },
  courseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  courseText: {
    fontSize: 20,
    width: '80%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  courseDistanceText: {
    position: 'absolute',
    right: 0,
    fontSize: 15,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  notFoundWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 5,
    color: 'black',
  },
});
