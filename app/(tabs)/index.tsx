import { Image, StyleSheet, Platform, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';


export default function HomeScreen() {

  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [bearing, setBearing] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [distanceLeft, setDistanceLeft] = useState<number | null>(null);




  const teeCoords = { latitude: 59.534253, longitude: 17.957261 };
  const holeCoords = { latitude: 59.534939, longitude: 17.962801 };

  const latitude = (teeCoords.latitude + holeCoords.latitude) / 2;
  const longitude = (teeCoords.longitude + holeCoords.longitude) / 2;

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

  useEffect(() => {
    const bearing = calculateBearing(
      teeCoords.latitude,
      teeCoords.longitude,
      holeCoords.latitude,
      holeCoords.longitude
    );
    setBearing(bearing); 
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
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

    };

    getLocation();
  }, []);


  return (
    <View style={{flex: 1}}>
    <View style={{flex: 1, backgroundColor: 'violet'}}>
      <MapView
      // provider={PROVIDER_GOOGLE}
      ref={mapRef}
      mapType='satellite'
      style={{flex: 1, backgroundColor: 'magenta'}}
      rotateEnabled={true}
      initialRegion={initialRegion}
      camera={{
        center: { latitude, longitude },
        heading: -bearing,
        pitch: 100, // Optional: Set the pitch if you want a tilted view
        zoom: -10, // Adjust zoom level as needed
        altitude: 0.01
      }}
      >
        <Marker coordinate={{latitude: teeCoords.latitude, longitude: teeCoords.longitude}}>
          <MaterialIcons size={28} name="golf-course" color={'red'} />
        </Marker>
        <Marker coordinate={{latitude: holeCoords.latitude, longitude: holeCoords.longitude}}>
          <MaterialIcons size={28} name="sports-golf" color={'white'} />
        </Marker>
        <Marker coordinate={{latitude: location?.coords.latitude || 0, longitude: location?.coords.longitude || 0}}>
          <ThemedText>{distanceLeft}m</ThemedText>
          <MaterialIcons size={28} name="person-pin" color={'white'} />
        </Marker>
        
      </MapView>
    </View>

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
});
