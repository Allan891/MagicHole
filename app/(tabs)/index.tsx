import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  TextInput,
  Button,
  Alert,
} from 'react-native';
export const unstable_settings = {
  initialRouteName: 'index',
};

export const screenOptions = {
  headerShown: false, 
};

import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useRound } from './RoundContext';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from './globalStateVar';

const courseObject = {
  name: 'Brollsta',
  holes: [
    {
      holeCoords: { latitude: 59.582875, longitude: 18.292865 },
      teeCoords: { latitude: 59.582843, longitude: 18.297886 },
      par: 4,
    },
    {
      holeCoords: { latitude: 59.58045, longitude: 18.286678 },
      teeCoords: { latitude: 59.582865, longitude: 18.290975 },
      par: 5,
    },
    {
      holeCoords: { latitude: 59.582523, longitude: 18.292028 },
      teeCoords: { latitude: 59.580322, longitude: 18.287774 },
      par: 3,
    },
  ],
};


export default function HomeScreen() {
  const strokes = globalStateVar((state) => state.strokes);
const setStroke = globalStateVar((state) => state.setStroke);
  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [distanceLeft, setDistanceLeft] = useState<number | null>(null);
  const [bearing, setBearing] = useState(0);
  const [currentHole, setCurrentHole] = useState<number>(0);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  
  

  const { playerScores, setPlayerScores } = useRound();

  const teeCoords = courseObject.holes[currentHole].teeCoords;
  const holeCoords = courseObject.holes[currentHole].holeCoords;

  const latitude = (teeCoords.latitude + holeCoords.latitude) / 2;
  const longitude = (teeCoords.longitude + holeCoords.longitude) / 2;

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 1 / 1000,
    longitudeDelta: 1 / 1000,
  };

  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const rad = Math.PI / 180;
    const deltaLng = (lng2 - lng1) * rad;
    const y = Math.sin(deltaLng) * Math.cos(lat2 * rad);
    const x =
      Math.cos(lat1 * rad) * Math.sin(lat2 * rad) -
      Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos(deltaLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };


const addStroke = () => {
  if (location) {
    const { latitude, longitude } = location.coords;
    const thisStroke = { latitude, longitude, strokeNumber: currentStroke };

    const updatedStrokes = [...strokes];
    
    setCurrentStroke(currentStroke + 1);

    
    const currentScore = strokes[currentHole] || 0;
setStroke(currentHole, currentScore + 1);

    console.log(updatedStrokes);
  } else {
    Alert.alert('Error: No location data');
  }
};


  const nextHole = () => {
    if (currentHole + 1 >= courseObject.holes.length) {
      alert(`Round complete! Total strokes: ${playerScores.reduce((a, b) => a + b, 0)}`);
      return;
    }
    setCurrentHole(currentHole + 1);
    setCurrentStroke(0);
    
  };

  // GPS tracking
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc);
          const distance = calculateDistance(
            loc.coords.latitude,
            loc.coords.longitude,
            holeCoords.latitude,
            holeCoords.longitude
          );
          setDistanceLeft(Math.round(distance));
        }
      );
    };
    startTracking();
    return () => subscription?.remove();
  }, [currentHole]);

  // Update bearing when hole changes
  useEffect(() => {
    setBearing(
      calculateBearing(
        teeCoords.latitude,
        teeCoords.longitude,
        holeCoords.latitude,
        holeCoords.longitude
      )
    );
  }, [currentHole]);

  // Bottom sheet animation
  const screenHeight = Dimensions.get('window').height;
  const collapsedY = screenHeight - 150;
  const expandedY = screenHeight / 2;
  const sheetAnim = useRef(new Animated.Value(collapsedY)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        const newY = Math.max(expandedY, Math.min(collapsedY, collapsedY + gesture.dy));
        sheetAnim.setValue(newY);
      },
      onPanResponderRelease: (_, gesture) => {
        const toValue = gesture.dy > 50 ? collapsedY : expandedY;
        Animated.spring(sheetAnim, { toValue, useNativeDriver: false }).start();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: '80%', height: 120, position: 'absolute', top: '10%', left: '10%', zIndex: 999999 }}>
        <ThemedText style={{ textAlign: 'center', color: 'white' }} type="title">
          {courseObject.name}
        </ThemedText>
        <TouchableOpacity onPress={nextHole}>
          <ThemedText style={{ textAlign: 'center', color: 'white' }} type="subtitle">
            Hole {currentHole + 1}
          </ThemedText>
        </TouchableOpacity>
        <ThemedText style={{ textAlign: 'center', color: 'white' }}>
          Stroke {currentStroke}
        </ThemedText>
      </View>

      <MapView
        
        mapType="satellite"
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        camera={{
          center: { latitude, longitude },
          heading: bearing,
          pitch: 90,
          zoom: 17,
        }}
      >
        <Marker coordinate={teeCoords}>
          <MaterialIcons name="sports-golf" size={28} color="white" />
        </Marker>
        <Marker coordinate={holeCoords}>
          <MaterialIcons name="golf-course" size={28} color="red" />
        </Marker>
        {location && (
          <Marker coordinate={location.coords}>
            <View style={{ alignItems: 'center', gap: 3 }}>
              <View style={{ padding: 5, backgroundColor: 'white', borderRadius: 5 }}>
                <ThemedText>{distanceLeft} m</ThemedText>
              </View>
              <MaterialIcons name="person-pin" size={28} color="white" />
            </View>
          </Marker>
        )}
      </MapView>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.bottomSheet, { transform: [{ translateY: sheetAnim }] }]}
      >
        <View style={styles.sheetHandle} />
        <ThemedText style={styles.sheetTitle}>Strokes for hole {currentHole + 1}</ThemedText>
        <TextInput
  keyboardType="number-pad"
  value={strokes[currentHole]?.toString() || ''}
  onChangeText={(text) => {
    const value = parseInt(text) || 0;
    setStroke(currentHole, value);
  }}
/>

          
        
        <Button
          title={currentHole + 1 === courseObject.holes.length ? 'End Round' : 'Next Hole'}
          onPress={nextHole}
        />
      </Animated.View>

      <View
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '70%',
          height: 60,
          backgroundColor: 'white',
          borderRadius: 30,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <TouchableOpacity onPress={nextHole}>
          <MaterialIcons name="golf-course" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={addStroke}>
          <MaterialIcons name="plus-one" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: Dimensions.get('window').height,
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginBottom: 12,
  },
});
