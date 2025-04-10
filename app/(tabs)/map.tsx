// This is the latest map.tsx

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
  Platform,
} from 'react-native';
import MapView, { LatLng, Marker, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/ThemedText';
import { LocationObject } from 'expo-location';
import { CoursePicker } from '@/components/CoursePicker';
import courses from '@/constants/courses';
import {calculateBearing, calculateDistance} from '@/utils';
import {calculateStrokesGained,calculateRawSG} from '@/utils';
import db from '../db/db';
import { globalStateVar } from '../state/globalStateVar';
import { setBackgroundColorAsync } from 'expo-system-ui';



export default function HomeScreen() {

  const strokes = globalStateVar((state) => state.strokes);
  const setStroke = globalStateVar((state) => state.setStroke);
  const [mapStrokes, setMapStrokes] = useState<any[][]>([[]]);
  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [distanceLeft, setDistanceLeft] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(18);
  const [bearing, setBearing] = useState(0);
  const [currentHole, setCurrentHole] = useState<number>(0);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [roundId, setRoundId] = useState<number | null>(null);
  const [strokeCoordinates, setStrokeCoordinates] = useState<LatLng[]>([]);
  const setSelectedCourse = globalStateVar((state) => state.setSelectedCourse);
  
  const [LockedView, setLockedView] = useState<boolean>(false);
  const [lat2, setLat2] = useState<number>(0);
  const [lon2, setLon2] = useState<number>(0);
  

  const [courseObject, setCourseObject] = useState<Object>(courses[0]);
  const [courseChosen, setCourseChosen] = useState<boolean>(false);

  const teeCoords = courseObject?.holes[currentHole].teeBack;
  const holeCoords = courseObject?.holes[currentHole].greenMiddle;

  const latitude = (teeCoords.latitude + holeCoords.latitude) / 2;
  const longitude = (teeCoords.longitude + holeCoords.longitude) / 2;

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 1 / 1000,
    longitudeDelta: 1 / 1000,
  };




  const handleCourseChosen = async (id) => {
    const newRound: Round = {
      time: Date.now(), // Example time in ISO 8601 format
      playerId: 999,      // Example player ID
      courseId: id,      // Example course ID
      handicap: 36         // Example handicap
    };
    const newRoundId = await db.createRound(newRound);
    setRoundId(newRoundId);
    console.log("New round id: ", newRoundId);
    const thisCourse = courses.find(a => a.id === id);
    setCourseObject(thisCourse);
    setSelectedCourse(thisCourse);
    setCourseChosen(true);
    console.log('thisCourse', thisCourse);
    if (thisCourse){
      setBearing(  //set bearing for hole 0, since we dont switch holes here it doesnt happen automatically.
        calculateBearing(
          thisCourse.holes[0].teeBack.latitude,
          thisCourse.holes[0].teeBack.longitude,
          thisCourse.holes[0].greenMiddle.latitude,
          thisCourse.holes[0].greenMiddle.longitude
        )
      );
    // adjustzoom for hole 1 aswell
        adjustZoom(calculateDistance(
            thisCourse.holes[0].teeBack.latitude,
            thisCourse.holes[0].teeBack.longitude,
            thisCourse.holes[0].greenMiddle.latitude,
            thisCourse.holes[0].greenMiddle.longitude
        ));
    }

    //setCurrentHole(0); //we need to change hole to get correct bearing, so we change it to 1 and then to 0.
    if (test) updateTestLocation(thisCourse.holes[0].teeBack, thisCourse.holes[0].greenMiddle);

  }

  const adjustZoom = (distance: number) => {
    console.log(distance);
    if (distance <= 200) setZoomLevel(19);
    else {
        if (distance <= 320) setZoomLevel(18);
        else setZoomLevel(17);
    }

  };

  const addStroke = (lastHole = false) => {
    if (location) {

      const { latitude, longitude } = lastHole? courseObject.holes[currentHole].greenMiddle : location;
      const previousStrokes = mapStrokes[currentHole];
      const previousStroke: Stroke = previousStrokes?.length > 0 ? previousStrokes[previousStrokes.length - 1] : null;
      const thisStroke: Stroke = {
        holeId: currentHole,
        roundId: roundId || 0,
        strokeNr: currentStroke,
        startLatitude: latitude,
        startLongitude: longitude,
        distance: 0, // Placeholder, calculate if needed
        golfClubId: 69, // Placeholder, update with actual golf club ID
        playerId: 999,
        lie: 1, // lie = 1 means fairway, should be chosen at a later point and not hardcoded.
        strokesGained: 0
      };
      // Calculate distance if there's a previous stroke
      if (previousStroke) {
        console.log('=======================================');
        console.log('Previous stroke: ', previousStroke);
        const distance = previousStroke ? Math.round(calculateDistance(previousStroke.startLatitude, previousStroke.startLongitude, latitude, longitude)): 0;
        console.log('Distance: ', distance);
        previousStroke.distance = distance;
        previousStroke.strokesGained = calculateStrokesGained(previousStroke,thisStroke, holeCoords.latitude,holeCoords.longitude)
        console.log('Updated previous stroke: ', previousStroke);
        console.log('=======================================');
        db.createStroke(previousStroke); // Save the previous stroke to the database
        console.log('Saved previous stroke to database',);


      }
      if(lastHole) return;
      const updatedMapStrokes = [...mapStrokes];
        console.log(updatedMapStrokes);
        console.log('current hole: ',currentHole);
        if (updatedMapStrokes[currentHole])
            updatedMapStrokes[currentHole] = [...updatedMapStrokes[currentHole], thisStroke];
        else
            updatedMapStrokes[currentHole] = [thisStroke];

      setMapStrokes(updatedMapStrokes);

      const newArr = [...strokeCoordinates, { latitude, longitude }];
      console.log('newArr', newArr);
      setStrokeCoordinates(newArr);
      
      const updatedStrokes = [...strokes];
      
      setCurrentStroke(currentStroke + 1);

      
      const currentScore = strokes[currentHole] || 0;
      setStroke(currentHole, currentScore + 1);
      if (test) updateTestLocation();

    } else {
      Alert.alert('Error: No location data');
    }
  };

  const removeStroke = () => {
    const current = strokes[currentHole] || 0;
    if (current === 0) return;     
    setStroke(currentHole, current - 1);
    const updated = [...mapStrokes];
    updated[currentHole] = updated[currentHole].slice(0, -1);
    setMapStrokes(updated);    
    setCurrentStroke(current - 1);
  };

  const nextHole = () => {
    
    if (currentHole + 1 >= courseObject.holes.length) {
      return;
    }
    finishHole();
    setCurrentHole(currentHole + 1);
    setCurrentStroke(0); // This will make the first stroke for the new hole be 1
    setStrokeCoordinates([]); // Reset map strokes

    if (test) {
      setLocation(null);
      updateTestLocation(courseObject.holes[currentHole + 1].teeBack, courseObject.holes[currentHole + 1].greenMiddle);
    }
    const distance = calculateDistance(courseObject.holes[currentHole + 1].teeBack.latitude,courseObject.holes[currentHole + 1].teeBack.longitude, courseObject.holes[currentHole + 1].greenMiddle.latitude, courseObject.holes[currentHole + 1].greenMiddle.longitude)
    adjustZoom(distance);
  };
  const finishRound = () => {
    addStroke(true);
  }
  const finishHole = () => {
    addStroke(true);
  }

  const ToggleLock = () => {
        setLockedView (!(LockedView));
  };

  const updateTestLocation = (forcedLocation = {}, nextHole = {}) => {

    console.log('Updating test location');

    let updatedLatitude;
    let updatedLongitude;

    let updatedHoleLatitude;
    let updatedHoleLongitude;

    if (forcedLocation.latitude) {
      updatedLatitude = forcedLocation.latitude;
      updatedLongitude = forcedLocation.longitude;
    } else {
      if (distanceLeft > 175){  // if distance > X, advance lat & long by 25-75% of delta
          updatedLatitude = location.latitude - (location.latitude - holeCoords.latitude)* (Math.random() + 0.5)/2;
          updatedLongitude = location.longitude - (location.longitude - holeCoords.longitude)* (Math.random() + 0.5)/2;
      }
      else{ // if distance < X, advance by 50-100% of delta
          updatedLatitude = location.latitude - (location.latitude - holeCoords.latitude)* (Math.random()*0.5 + 0.5);
          updatedLongitude = location.longitude - (location.longitude - holeCoords.longitude)* (Math.random()*0.5 + 0.5);
      }
    }

    console.log('Update to: ', updatedLatitude, updatedLongitude);

    const testLocation: LocationObject = {

        accuracy: 10,
        altitude: 0,
        altitudeAccuracy: -1,
        heading: 187.77,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
        speed: 3.63,

      timestamp: Date.now(),
    };
      setLocation(testLocation)
      const distance = calculateDistance(
        testLocation.latitude,
        testLocation.longitude,
        nextHole.latitude ? nextHole.latitude : holeCoords.latitude,
        nextHole.longitude ? nextHole.longitude : holeCoords.longitude
      );

      setDistanceLeft(Math.round(distance));

  }

  const test = true; // Auto generate GPS locations to test

  if (test && !location) {

    updateTestLocation(teeCoords);
    
  }

  const updateLocation = (event) => {
    //console.log(event);

    if (test) return;

    const { coordinate } = event?.nativeEvent;
    console.log(coordinate);

    setLat2 ( coordinate.latitude);
    setLon2 ( coordinate.longitude); // Saves lat & lon of user position in "lat2" and "lon2" for use elsewhere.
    //return;
    if (coordinate){
      setLocation(coordinate);
      console.log('location: ', location)
      //return;
      const distance = calculateDistance(
        coordinate.latitude,
        coordinate.longitude,
        holeCoords.latitude,
        holeCoords.longitude
      );
      setDistanceLeft(Math.round(distance));
    }
  };

    // // Update stroke lines on map
    // useEffect(() => {
    //   if (!mapStrokes[currentHole]) return; // Ensure the array exists

    //   console.log('Strokes for this hole:', mapStrokes[currentHole])
    
    //   const newStrokeCoordinates = mapStrokes[currentHole].map((stroke) => ({
    //     latitude: stroke.startLatitude,
    //     longitude: stroke.startLongitude,
    //   }));
    
    //   console.log('newStrokeCoordinates', newStrokeCoordinates); // Debugging output
    //   setStrokeCoordinates(newStrokeCoordinates);
    // }, [mapStrokes, currentHole]);

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
  let handleHeight;
  if (Platform.OS == 'ios') {
    handleHeight = screenHeight * 0.12;
  } else {
    handleHeight = screenHeight * 0.09;
  }
  const collapsedY = screenHeight - handleHeight;

  const expandedY = screenHeight - 300;
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

      {!courseChosen &&
      
      <CoursePicker onChooseCourse={handleCourseChosen} />

      }

      <View style={{ width: '80%', height: 120, position: 'absolute', top: '10%', left: '10%', zIndex: 999999 }}>
      {currentHole == 0 && currentStroke == 0 &&
        <ThemedText style={{ textAlign: 'center', color: 'white'}} type="title">
          {courseObject.name}
        </ThemedText>
      }

        <TouchableOpacity onPress={nextHole}>
          <ThemedText style={{ textAlign: 'center', color: 'white' }} type="subtitle">
          Hole {currentHole + 1} {currentStroke == 0 && `Par ${courseObject.par[currentHole]}`}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={{textAlign: 'center', verticalAlign: 'middle', color: 'white'}} type='subtitle'>{distanceLeft}m</ThemedText>

         { currentStroke > 0 &&
         (
           <ThemedText style={{ textAlign: 'center', color: 'white' }}>
            Strokes {currentStroke}
          </ThemedText>
          )
         }
      </View>

      <MapView

        onUserLocationChange={updateLocation}
        scrollEnabled={!(LockedView)}
        rotateEnabled={!(LockedView)}
        zoomEnabled={!(LockedView)}
        liteMode={false}
        showsMyLocationButton={false}
        showsCompass={!(LockedView)}
        showsUserLocation={test ? false : true}
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

        {test && location &&
        
        <Marker coordinate={location}>
          <MaterialIcons name="person" size={28} color="white" />
        </Marker>

        }

      </MapView>

      <Animated.View
  {...panResponder.panHandlers}
  style={[styles.bottomSheet, { transform: [{ translateY: sheetAnim }] }]}
>

  <View style={styles.strokeAdjusterRow}>
  <TouchableOpacity onPress={removeStroke}>
  <MaterialIcons name="remove-circle-outline" size={36} color="black" />
</TouchableOpacity>


  <ThemedText style={styles.strokeCount}>
    {strokes[currentHole] ?? 0}
  </ThemedText>

  <TouchableOpacity
    onPress= {() => {
      addStroke();
    }}
  >
    <MaterialIcons name="add-circle-outline" size={36} color="black" />
  </TouchableOpacity>
</View>

<View style={[styles.buttonRow, {flexDirection: 'column'}]}>
{  location && currentStroke > 0 &&
         <ThemedText>Previous shot length:
          {' ' + Math.round(calculateDistance(
             location.latitude,
             location.longitude,
             mapStrokes[currentHole][currentStroke-1].startLatitude,
             mapStrokes[currentHole][currentStroke-1].startLongitude
         ))}m</ThemedText>


         }</View>

<View style={styles.buttonRow}>
  {
    currentHole + 1 >= courseObject.holes.length ? (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={finishRound}>
        <MaterialIcons name="check-circle-outline" size={30} color="black" />
      </TouchableOpacity>
      <ThemedText style={styles.holeOutText}>Finish Round</ThemedText>
    </View>
  ) : (
  <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={nextHole}>
        <MaterialIcons name="golf-course" size={30} color="black" />
      </TouchableOpacity>
      <ThemedText style={styles.holeOutText}>Next Hole</ThemedText>
    </View>)
  }
</View>

<View style={styles.buttonRow}>
  <ThemedText type="subtitle">{courseObject?.name}</ThemedText>
</View>

</Animated.View>

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