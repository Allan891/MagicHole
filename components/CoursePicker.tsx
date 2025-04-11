import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import courses from '@/constants/courses';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export function CoursePicker({ onChooseCourse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  useEffect(() => {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const updatedCourses = courses.filter(course => {
      const words = course.name.toLowerCase().split(' ');
      return words.some(word => word.startsWith(lowercaseSearchTerm));
    });
    setFilteredCourses(updatedCourses);
  }, [searchTerm]);

  const renderCourse = ({ item }) => (
    <View style={styles.courseItem}>
      <TouchableOpacity onPress={() => onChooseCourse(item.id)}>
        <Text style={styles.courseText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.modal}>
      <ThemedText style={{ fontWeight: 'bold', textAlign: 'center' }}>Choose your course</ThemedText>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Courses"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {searchTerm.length > 0 && (
        filteredCourses.length > 0 ? (
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourse}
          />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="error" size={24} color="red" />
            <Text style={styles.notFoundText}>Course not found</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    position: 'absolute',
    maxHeight: '80%',
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
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  notFoundText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 0,
    marginLeft: 5, 
    color: 'black', 
  },
});
