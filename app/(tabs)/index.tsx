import { Image, StyleSheet, Platform, View, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from "react-native";


const screenHeight = Dimensions.get('window').height;


export default function HomeScreen() {

  const courseObject = {
    name: 'Brollsta',
    holes: [
      {
        holeCoords: {latitude: 59.582875, longitude: 18.292865},
        teeCoords: {latitude: 59.582843, longitude: 18.297886},
      },
      {
        holeCoords: {latitude: 59.58045, longitude: 18.286678},
        teeCoords: {latitude: 59.582865, longitude: 18.290975},
      },
      {
        holeCoords: {latitude: 59.582523, longitude: 18.292028},
        teeCoords: {latitude: 59.580322, longitude: 18.287774},
      }
    ]
  }


  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [bearing, setBearing] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [distanceLeft, setDistanceLeft] = useState<number | null>(null);
  const [currentHole, setCurrentHole] = useState<number>(0);
  const [holeCoords, setHoleCoords] = useState<Object>(courseObject.holes[0].holeCoords);
  const [teeCoords, setTeeCoords] = useState<Object>(courseObject.holes[0].teeCoords);
  const [courseName, setCourseName] = useState<Object>(courseObject.name);
const [playerScores, setPlayerScores] = useState<number[]>([4, 5, 3]); // mock scores per hole

  const [strokes, setStrokes] = useState<Object[][]>([[]])
  const [currentStroke, setCurrentStroke] = useState<number>(0); 

  const latitude = (teeCoords?.latitude + holeCoords?.latitude) / 2;
  const longitude = (teeCoords?.longitude + holeCoords?.longitude) / 2;

  

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 1/1000,
    longitudeDelta: 1/1000,
  }; 

  const calculateBearing = (
    startLat: number, 
    startLng: number, 
    endLat: number, 
    endLng: number
  ): number => {
    const radian = Math.PI / 180;
    const startLatRad = startLat * radian;
    const startLngRad = startLng * radian;
    const endLatRad = endLat * radian;
    const endLngRad = endLng * radian;

    const deltaLng = endLngRad - startLngRad;
    const y = Math.sin(deltaLng) * Math.cos(endLatRad);
    const x =
      Math.cos(startLatRad) * Math.sin(endLatRad) -
      Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(deltaLng);
    let bearing = Math.atan2(y, x) / radian;
    bearing = (bearing + 360) % 360; 
    return bearing;
  };

  const calculateDistance = (
    lat1: number, lon1: number, lat2: number, lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const radian = Math.PI / 180;
    
    const dLat = (lat2 - lat1) * radian;
    const dLon = (lon2 - lon1) * radian;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * radian) * Math.cos(lat2 * radian) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const nextHole = () => {
    if (currentHole + 1 === courseObject.holes.length) return; 
    setCurrentHole(prevHole => prevHole + 1);
    strokes.push([]);
    setStrokes(strokes);
    setCurrentStroke(0);
  }

  const addStroke = () => {

    if (location) {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const thisStroke = {longitude,latitude,strokeNumber:currentStroke};

      strokes[currentHole].push(thisStroke);
      setCurrentStroke(currentStroke + 1);
      setStrokes(strokes);
      console.log(strokes);

    }
    else{
      Alert.alert("Error: no location data" );
    }
  }

  useEffect(() => {

    setHoleCoords(courseObject.holes[currentHole].holeCoords)
    setTeeCoords(courseObject.holes[currentHole].teeCoords)

  }, [currentHole]);

  

  useEffect(() => {
    const bearing = calculateBearing(
      teeCoords.latitude,
      teeCoords.longitude,
      holeCoords.latitude,
      holeCoords.longitude
    );
    setBearing(bearing); 
  }, [courseObject, currentHole]);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
  
    const startWatchingLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Minimum time between updates (ms)
          distanceInterval: 1, // Minimum distance change (meters)
        },
        (location) => {
          setLocation(location);
  
          if (location) {
            const distance = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              holeCoords.latitude,
              holeCoords.longitude
            );
            setDistanceLeft(Math.round(distance));
          }
        }
      );
    };
  
    startWatchingLocation();
  
    return () => {
      if (locationSubscription) {
        locationSubscription.remove(); // Stop watching when component unmounts
      }
    };
  }, []);
  const screenHeight = Dimensions.get('window').height;
const collapsedY = screenHeight - 150;
const expandedY = screenHeight / 2;

const sheetAnim = useRef(new Animated.Value(collapsedY)).current;

const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
    onPanResponderMove: (_, gestureState) => {
      const newY = Math.max(expandedY, Math.min(collapsedY, collapsedY + gestureState.dy));
      sheetAnim.setValue(newY);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        Animated.spring(sheetAnim, { toValue: collapsedY, useNativeDriver: false }).start();
      } else {
        Animated.spring(sheetAnim, { toValue: expandedY, useNativeDriver: false }).start();
      }
    },
  })
).current;


  return (
    <View style={{flex: 1}}>
    <View style={{flex: 1}}>
      <View style={{ width: '80%', height: 120, position: 'absolute', top: '10%', left: '10%', zIndex: 999999}}>
        <ThemedText style={{textAlign: 'center', verticalAlign: 'middle', color: 'white'}} type='title'>{courseName}</ThemedText>
        <TouchableOpacity onPress={nextHole}>
          <ThemedText style={{textAlign: 'center', verticalAlign: 'middle', color: 'white'}} type='subtitle'>Hole {currentHole + 1}</ThemedText>
        </TouchableOpacity>
        <ThemedText style={{textAlign: 'center', verticalAlign: 'middle', color: 'white'}} >Stroke {currentStroke + 1}</ThemedText>
        

      </View>
      <MapView
      // provider={PROVIDER_GOOGLE}
      ref={mapRef}
      mapType='satellite'
      style={{flex: 1, backgroundColor: 'magenta'}}
      rotateEnabled={true}
      initialRegion={initialRegion}
      camera={{
        center: { latitude, longitude },
        heading: bearing,
        pitch: 90, // Optional: Set the pitch if you want a tilted view
        zoom: 17, // Adjust zoom level as needed
        altitude: 0.01
      }}
      >
        <Marker coordinate={{latitude: teeCoords.latitude, longitude: teeCoords.longitude}}>
          <MaterialIcons size={28} name="sports-golf" color={'white'} />
        </Marker>
        <Marker coordinate={{latitude: holeCoords.latitude, longitude: holeCoords.longitude}}>
          <MaterialIcons size={28} name="golf-course" color={'red'} />
        </Marker>
        <Marker coordinate={{latitude: location?.coords.latitude || 0, longitude: location?.coords.longitude || 0}}>
          <View style={{alignItems: 'center', gap: 3}}>
          <View style={{padding: 5, backgroundColor: 'white', borderRadius: 5}}>
          <ThemedText>{distanceLeft}m</ThemedText>
          </View>
          <MaterialIcons size={28} name="person-pin" color={'white'} />
          </View>
        </Marker>
        
      </MapView>
<<<<<<< HEAD
    </View>
    <Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.bottomSheet,
    {
      transform: [{ translateY: sheetAnim }],
    },
  ]}
>
  <View style={styles.sheetHandle} />
  <ThemedText style={styles.sheetTitle}>Scorecard</ThemedText>
  <View style={styles.sheetContent}>
    <ThemedText>Hål {currentHole + 1}</ThemedText>
    <ThemedText>Slag: {playerScores[currentHole] ?? '-'}</ThemedText>
  </View>
</Animated.View>
=======
      </View>
        <View style={{
          position: 'absolute', 
          bottom: '15%', // Added some spacing from the bottom
          left: '15%', 
          width: '70%', 
          height: 60, 
          backgroundColor: 'white',
          borderRadius: 30, // Makes it round
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent:"space-evenly"
        }}>
          <TouchableOpacity onPress={nextHole}>
            <MaterialIcons name="golf-course" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={addStroke}>
            <MaterialIcons name="plus-one" size={30} color="black" />
          </TouchableOpacity>

        </View>

>>>>>>> 4d7796e4fd0090f622aa01e21d3a95dc78d49916

    </View>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,  
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: screenHeight,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    zIndex: 999,
  },
  sheetHandle: {
    width: 50,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  sheetContent: {
    gap: 8,
    alignItems: 'center',
  },
  
});
