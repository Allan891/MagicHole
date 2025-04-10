// This is the latest map.tsx

import {
  View,
  StyleSheet,
} from 'react-native';
import MapView, { LatLng, Marker, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import {calculateBearing, calculateDistance} from '@/utils';
import {getCourse} from '@/utils';
import { useLocalSearchParams } from 'expo-router';



export default function HistoryMap() {

  const { holeData, courseId, holeIndex } = useLocalSearchParams();

  const parsedHoleData = JSON.parse(holeData);

  const mapRef = useRef<MapView | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(18);
  const [bearing, setBearing] = useState(0);

  const courseObject = getCourse(courseId);

  const strokes = parsedHoleData?.userStrokes;
  const strokeCoordinates = strokes.map((stroke) => ({
    latitude: stroke.startLatitude,
    longitude: stroke.startLongitude,
  }));

  
  const teeCoords = parsedHoleData.hole.teeBack;
  const holeCoords = parsedHoleData.hole.greenMiddle;
  strokeCoordinates.push(holeCoords);
  
  const distanceLeft = Math.round(calculateDistance(teeCoords.latitude, teeCoords.longitude, holeCoords.latitude, holeCoords.longitude));
  

  const latitude = (teeCoords.latitude + holeCoords.latitude) / 2;
  const longitude = (teeCoords.longitude + holeCoords.longitude) / 2;

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 1 / 1000,
    longitudeDelta: 1 / 1000,
  };

  const adjustZoom = (distance: number) => {
    console.log(distance);
    if (distance <= 200) setZoomLevel(19);
    else {
        if (distance <= 320) setZoomLevel(18);
        else setZoomLevel(17);
    }

  };

  useEffect(() => {
    setBearing(
      calculateBearing(
        teeCoords.latitude,
        teeCoords.longitude,
        holeCoords.latitude,
        holeCoords.longitude
      )
    );
  }, []);


  return (
    <View style={{ flex: 1 }}>

      <View style={{ width: '80%', height: 120, position: 'absolute', top: '10%', left: '10%', zIndex: 999999 }}>
        <ThemedText style={{ textAlign: 'center', color: 'white'}} type="title">
          {courseObject.name}
        </ThemedText>

          <ThemedText style={{ textAlign: 'center', color: 'white' }} type="subtitle">
          Hole {parseInt(holeIndex) + 1} Par {courseObject.par[holeIndex]}
          </ThemedText>


        <ThemedText style={{textAlign: 'center', verticalAlign: 'middle', color: 'white'}} type='subtitle'>{distanceLeft}m</ThemedText>

      </View>

      <MapView
        liteMode={false}
        showsMyLocationButton={false}
        showsUserLocation={false}
        userLocationFastestInterval={10000}
        userLocationUpdateInterval={10000}
        mapType="satellite"
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        camera={{
          center: { latitude, longitude },
          heading: bearing,
          pitch: 90,
          zoom: zoomLevel,
          altitude: 0.02
        }}
      >
        <Marker coordinate={teeCoords}>
          <MaterialIcons name="sports-golf" size={28} color="white" />
        </Marker>
        <Marker coordinate={holeCoords}>
          <MaterialIcons name="golf-course" size={28} color="red" />
        </Marker>

        <Polyline
            coordinates={strokeCoordinates}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              // '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000',
            ]}
            strokeWidth={3}
          />

      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 300, //  Dimensions.get('window').height,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 30, 
    zIndex: 999,
  },
  
  sheetHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 8,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',     
    gap: 12,                  
    // marginTop: 12,
    // marginBottom: 44,
  },
  strokeAdjusterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4, 
  },
  strokeCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 38, 
    marginHorizontal: 24,
    textAlignVertical: 'center', 
    textAlign: 'center',
  },
  holeOutText: {
    fontSize: 14,
    color: 'black',
    marginTop: 4,
  },
});
