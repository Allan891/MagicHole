import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import courses from '@/constants/courses';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { calculateDistance, search } from "@/utils";
import { globalStateVar } from '../app/state/globalStateVar';
import * as Location from 'expo-location';



export function CoursePicker({ onChooseCourse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const location = globalStateVar((state) => state.location);
  
  useEffect(() => {

    if (searchTerm != "") return;
    
    //console.log('use effect here!! Bang ! ',location)
    if (!location) return;
    
    
    for (const course of courses){
      //console.log('location', location)
      
      const ourdistance = Math.round(
        calculateDistance(
          location.latitude,location.longitude,
        //latitude,latitude,
        course.holes[0].teeBack.latitude,
        course.holes[0].teeBack.longitude)/1000)
        course.distance = ourdistance
        //console.log('ourdistance:', ourdistance)
      }
      courses.sort((a, b) => {
        return a.distance - b.distance;
      });    
      setFilteredCourses(courses.slice(0,10))
  },[location, searchTerm])

  useEffect(() => {
    if(searchTerm.length < 1 ) return
    const searchresults = search(courses,searchTerm)
    const newResults = searchresults.map(a=> a.item)
    //console.log('searcherm:', newResults)
    setFilteredCourses(newResults)
    // const lowercaseSearchTerm = searchTerm.toLowerCase();
    // const updatedCourses = courses.filter(course => {
    //   const words = course.name.toLowerCase().split(' ');
    //   return words.some(word => word.startsWith(lowercaseSearchTerm));
    // });
    // if (lowercaseSearchTerm == '') {
    //   setFilteredCourses(updatedCourses)
    // }
    // else{
    //   setFilteredCourses(updatedCourses);
    // };
    
  }, [searchTerm]);
  
  const renderCourse = ({ item }) => (
    <View style={styles.courseItem}>
      <TouchableOpacity onPress={() => onChooseCourse(item.id)}>
        <Text style={styles.courseText}>{item.name}</Text>
        <Text style={styles.courseDistanceText}>{item.distance}
          km
          </Text>
        {/* calculateDistance(Location.latitude,Location.longitude,item.holes[0].teeBack.latitude,item.holes[0].teeBack.longitude) */}
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

      {(
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
  },
  courseDistanceText:{
    position: 'absolute',
    left: '92%',
    fontSize: 15
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