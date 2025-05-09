import Svg, { Path } from 'react-native-svg';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { calculateBearing, calculateDistance } from '@/utils';
import { getCourse } from '@/utils';
import { useLocalSearchParams } from 'expo-router';

export default function HistoryMap() {
  const { holeData, courseId, holeIndex } = useLocalSearchParams();
  const parsedHoleData = JSON.parse(holeData);
  const mapRef = useRef<MapView | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(18);
  const [bearing, setBearing] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const panelAnim = useRef(new Animated.Value(0)).current;

  const courseObject = getCourse(courseId);
  const strokes = parsedHoleData?.userStrokes;

  const strokeCoordinates = strokes.map((stroke) => ({
    latitude: stroke.startLatitude,
    longitude: stroke.startLongitude,
  }));

  const teeCoords = parsedHoleData.hole.teeBack;
  const holeCoords = parsedHoleData.hole.greenMiddle;
  strokeCoordinates.push(holeCoords);

  const distanceLeft = Math.round(
    calculateDistance(
      teeCoords.latitude,
      teeCoords.longitude,
      holeCoords.latitude,
      holeCoords.longitude
    )
  );

  const latitude = (teeCoords.latitude + holeCoords.latitude) / 2;
  const longitude = (teeCoords.longitude + holeCoords.longitude) / 2;

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 1 / 1000,
    longitudeDelta: 1 / 1000,
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

  const togglePanel = () => {
    Animated.timing(panelAnim, {
      toValue: isVisible ? 130 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsVisible(!isVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Animated right panel */}
      <Animated.View
        style={[
          styles.strokeList,
          {
            transform: [
              {
                translateX: panelAnim.interpolate({
                  inputRange: [0, 130],
                  outputRange: [0, 130],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.strokeListContent}>
          {strokes.map((stroke, index) => {
            const next = strokes[index + 1] ?? parsedHoleData.hole.greenMiddle;
            const length = Math.round(
              calculateDistance(
                stroke.startLatitude,
                stroke.startLongitude,
                next.startLatitude ?? parsedHoleData.hole.greenMiddle.latitude,
                next.startLongitude ?? parsedHoleData.hole.greenMiddle.longitude
              )
            );
            return (
              <View key={`list-${index}`} style={styles.strokeListItem}>
                <ThemedText style={styles.strokeListText}>Stroke {index + 1}</ThemedText>
                <ThemedText style={styles.strokeListDistance}>{length} m</ThemedText>
              </View>
            );
          })}
        </ScrollView>

        {/* Arrow toggle button */}
        <TouchableOpacity onPress={togglePanel} style={styles.arrowButton}>
          <MaterialIcons
            name={isVisible ? 'keyboard-arrow-right' : 'keyboard-arrow-left'}
            size={28}
            color="#333"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Top box */}
      <View style={styles.topBox}>
        <ThemedText style={{ textAlign: 'center', color: 'white' }} type="title">
          {courseObject.name}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', color: 'white' }} type="subtitle">
          Hole {parseInt(holeIndex) + 1} Par {courseObject.par[holeIndex]}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', color: 'white' }} type="subtitle">
          {distanceLeft}m
        </ThemedText>
      </View>

      {/* Map */}
      <MapView
        mapType="satellite"
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        camera={{
          center: { latitude, longitude },
          heading: bearing,
          pitch: 90,
          zoom: zoomLevel,
          altitude: 0.02,
        }}
      >
        <Marker coordinate={holeCoords}>
          <MaterialIcons name="golf-course" size={28} color="red" />
        </Marker>

        {strokeCoordinates.slice(0, -1).map((coord, index) => (
          <Marker key={`stroke-${index}`} coordinate={coord}>
            <MaterialIcons
              name="sports-golf"
              size={24}
              color={index === 0 ? 'white' : 'yellow'}
            />
            <ThemedText style={{ color: 'white', fontSize: 10 }}>
              {'Stroke ' + index}
            </ThemedText>
          </Marker>
        ))}

        <Polyline
          coordinates={strokeCoordinates}
          strokeColor="#000"
          strokeColors={['#7F0000', '#B24112', '#E5845C', '#238C23', '#7F0000']}
          strokeWidth={3}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBox: {
    width: '80%',
    height: 120,
    position: 'absolute',
    top: '10%',
    left: '10%',
    zIndex: 999999,
  },
  strokeList: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 130,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    zIndex: 999999999,
    flexDirection: 'row',
  },
  strokeListContent: {
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 60,
  },
  strokeListItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  strokeListText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  strokeListDistance: {
    fontSize: 12,
    color: '#666',
  },
  arrowButton: {
    position: 'absolute',
    left: -28,
    top: 400,
    width: 28,
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
  },
});