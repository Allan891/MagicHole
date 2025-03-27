import { Image, StyleSheet, Platform, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

export default function HomeScreen() {

  const mapRef = useRef<MapView | null>(null);

  const marker1 = { latitude: 59.534253, longitude: 17.957261 };
  const marker2 = { latitude: 59.534939, longitude: 17.962801 };

  const latitude = (marker1.latitude + marker2.latitude) / 2;
  const longitude = (marker1.longitude + marker2.longitude) / 2;

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

  const [bearing, setBearing] = useState(0);
  useEffect(() => {
    const bearing = calculateBearing(
      marker1.latitude,
      marker1.longitude,
      marker2.latitude,
      marker2.longitude
    );
    setBearing(bearing); 
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
        <Marker coordinate={{latitude: 59.534253, longitude: 17.957261}}>
          <MaterialIcons size={28} name="golf-course" color={'red'} />
        </Marker>
        <Marker coordinate={{latitude: 59.534939, longitude: 17.962801}}>
          <MaterialIcons size={28} name="sports-golf" color={'white'} />
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
