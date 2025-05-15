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
  TouchableHighlight,
} from 'react-native';
import MapView, { LatLng, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/ThemedText';
import { LocationObject } from 'expo-location';
import { CoursePicker } from '@/components/CoursePicker';
import { ClubPicker } from '@/components/ClubPicker';
import courses from '@/constants/courses';
import {calculateBearing, calculateDistance, getPoints} from '@/utils';
import {calculateStrokesGained,calculateRawSG} from '@/utils';
import db from '../db/db';
import { globalStateVar } from '../state/globalStateVar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { CircleButton } from '@/components/CircleButton';
import { useRouter } from 'expo-router';
import { ClubIcon } from '@/components/ClubIcon';
import { ClubCircleButton } from '@/components/ClubCircleButton';
import { Stroke, StrokeLieType } from '../db/GolfDatabaseTypes';
import * as Haptics from 'expo-haptics';
import { LiePicker } from '@/components/LiePicker';
import { LieCircleButton } from '@/components/LieCircleButton';



export default function HomeScreen() {

  const initialCourse = courses[Math.floor(Math.random() * courses.length)];

  const strokes = globalStateVar((state) => state.strokes);
  const test = globalStateVar((state) => state.testMode);
  const clubs = globalStateVar((state) => state.currentBag);
  const currentGlobalHole = globalStateVar((state) => state.currentHole);
  const setLocationGlobal = globalStateVar((state) => state.setLocation);
  const setStroke = globalStateVar((state) => state.setStroke);
  const resetScore = globalStateVar((state) => state.reset);
  const [mapStrokes, setMapStrokes] = useState<any[][]>([[]]);
  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [distanceLeft, setDistanceLeft] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(18);
  const [altitudeLevel, setAltitudeLevel] = useState<number>(0.009);
  const [bearing, setBearing] = useState(0);
  const [currentHole, setCurrentHole] = useState<number>(0);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [roundId, setRoundId] = useState<number | null>(null);
  const [strokeCoordinates, setStrokeCoordinates] = useState<LatLng[]>([]);
  const [holeFinished, setHoleFinished] = useState<boolean>(false);
  const setSelectedCourse = globalStateVar((state) => state.setSelectedCourse);
  const [currentClub, setCurrentClub] = useState<object>(clubs[0]);
  const [currentLie, setCurrentLie] = useState<StrokeLieType>(StrokeLieType.tee);



  useEffect(() => {
    setCurrentClub(clubs[0])
  },[clubs])


useEffect(() => {
  const fetchPutter = async () => {
    if (currentLie === StrokeLieType.green) {
      const putter = await db.getGolfClubById(99);
      setCurrentClub(putter);
    }
  };
  fetchPutter();
}, [currentLie]);


  useEffect(() => {
    const previousStrokes = mapStrokes[currentHole];
    const previousStroke: Stroke = previousStrokes?.length > 0 ? previousStrokes[previousStrokes.length - 1] : null;

    if (previousStroke == null){
      setCurrentLie(StrokeLieType.tee)
      setCurrentClub(clubs[0]);
      return
    }
    if (previousStroke.strokeNr == 0){
      setCurrentLie(StrokeLieType.fairway)
    }
  },[mapStrokes[currentHole]])


  const [LockedView, setLockedView] = useState<boolean>(false);
  const [lat2, setLat2] = useState<number>(0);
  const [lon2, setLon2] = useState<number>(0);


  const [courseObject, setCourseObject] = useState<Object>(initialCourse);
  const [courseChosen, setCourseChosen] = useState<boolean>(false);

  const teeCoords = courseObject?.holes[currentHole].teeBack;
  const holeCoords = courseObject?.holes[currentHole].greenMiddle;

  const latitude = (teeCoords.latitude + holeCoords.latitude) / 2;
  const longitude = (teeCoords.longitude + holeCoords.longitude) / 2;

  const resetState = () => {
    setCurrentHole(0);
    setCurrentStroke(0);
    setMapStrokes([[]]);
    setStrokeCoordinates([]);
    setCourseChosen(false);
    setLocation(null);
    setDistanceLeft(null);
    setZoomLevel(18);
    setBearing(0);
    setRoundId(null);
    setCourseObject(initialCourse);
  };

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 1 / 800,
    longitudeDelta: 1 / 800,
  };

  const goToRegion = async () => {

    const newRegion = {
      latitude: courseObject.holes.at(-1).greenMiddle.latitude,
      longitude: courseObject.holes.at(-1).greenMiddle.longitude,
      latitudeDelta: 1 / 1000,
      longitudeDelta: 1 / 1000,
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    mapRef.current?.animateToRegion(newRegion, 80000);
  };

  const router = useRouter();

  const goToScorecard = () => {
    router.push({
      pathname: '/screens/score'
    });
  }

  //console.log('Map rerender!');

  const handleCourseChosen = async (id) => {

    resetScore();

    const newRound: Round = {
      time: Date.now(), // Example time in ISO 8601 format
      playerId: 999,      // Example player ID
      courseId: id,      // Example course ID
      handicap: 36         // Example handicap
    };
    const newRoundId = await db.createRound(newRound);
    setRoundId(newRoundId);
    //console.log("New round id: ", newRoundId);
    const thisCourse = courses.find(a => a.id === id);
    const newRegion = {
      latitude: thisCourse.holes[0].teeBack.latitude,
      longitude: thisCourse.holes[0].teeBack.longitude,
      latitudeDelta: 1 / 1000,
      longitudeDelta: 1 / 1000,
    }
    mapRef.current?.animateToRegion(newRegion);
    setCourseObject(thisCourse);
    setSelectedCourse(thisCourse);
    setCourseChosen(true);
    //console.log('thisCourse', thisCourse);
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

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
  
      const location = await Location.getCurrentPositionAsync({});
      //console.log(location);
    })();
  }, []);

  const adjustZoom = (distance: number) => {
    //console.log(distance);
    
    if (distance <= 70){
      //console.log("distance <= 70");
      setZoomLevel(19);
      setAltitudeLevel(0.008)
    }else if (70 < distance && distance <= 180){ 
      //console.log('70 < distance && distance <= 180')
      setZoomLevel(19);
      setAltitudeLevel(0.0065);
    }
    else if (180  < distance && distance <= 320){
      //console.log('250  < distance && distance <= 320')
      setZoomLevel(18);
      setAltitudeLevel(0.009);
    }
    else if (320  < distance && distance <= 420){
      //console.log('320  < distance && distance <= 320')
      // setZoomLevel(18); <-- Add android zoom level
      setAltitudeLevel(0.010);
    }
    else if (420  < distance && distance <= 600){
      //console.log('420  < distance && distance <= 320')
      // setZoomLevel(18); <-- Add android zoom level
      setAltitudeLevel(0.012);
    }
    else if (600  < distance && distance <= 750){
      //console.log('600  < distance && distance <= 320')
      // setZoomLevel(18); <-- Add android zoom level
      setAltitudeLevel(0.016);
    }
    else {
      //console.log('else zoom')
      setZoomLevel(17);
      setAltitudeLevel(0.007);
    }
  };

  const addStroke = (lastStroke = false) => {

    if (location) {

      const { latitude, longitude } = lastStroke ? courseObject.holes[currentHole].greenMiddle : location;
      const previousStrokes = mapStrokes[currentHole];
      const previousStroke: Stroke = previousStrokes?.length > 0 ? previousStrokes[previousStrokes.length - 1] : null;
      let thisStroke: Stroke = {
        holeId: currentHole,
        roundId: roundId || 0,
        strokeNr: currentStroke,
        startLatitude: latitude,
        startLongitude: longitude,
        distance: 0, // Placeholder, calculate if needed
        distanceLeft: distanceLeft || -1,
        golfClubId: currentClub.id, // Placeholder, update with actual golf club ID
        playerId: 999,
        lie: currentLie, // lie = 1 means fairway, should be chosen at a later point and not hardcoded.
        strokesGained: 0
      };
      console.log('This stroke: ', thisStroke)
      const distanceToFlag = Math.round(calculateDistance(thisStroke.startLatitude, thisStroke.startLongitude, holeCoords.latitude, holeCoords.longitude));

      // Calculate distance if there's a previous stroke
      if (previousStroke) {
        //console.log('=======================================');
        //console.log('Previous stroke: ', previousStroke);
        const distance = previousStroke ? Math.round(calculateDistance(previousStroke.startLatitude, previousStroke.startLongitude, latitude, longitude)): 0;

        //console.log('Distance: ', distance);
        //console.log('Lie: ', previousStroke.lie);
        previousStroke.distance = distance;
        //console.log('bait');
        if (lastStroke){
            previousStroke.strokesGained = calculateRawSG(previousStroke, holeCoords.latitude,holeCoords.longitude) -1;
            }
        else{
            previousStroke.strokesGained = calculateStrokesGained(previousStroke, thisStroke, holeCoords.latitude,holeCoords.longitude)
        }

        //previousStroke.strokesGained = calculateStrokesGained(previousStroke, thisStroke, holeCoords.latitude,holeCoords.longitude)
        //console.log('=======================================');
        //console.log('Updated previous stroke: ', previousStroke);
        db.createStroke(previousStroke); // Save the previous stroke to the database
        ////console.log('Saved previous stroke to database',);


      }

      const updatedMapStrokes = [...mapStrokes];
        //console.log(updatedMapStrokes);
        //console.log('current hole: ',currentHole);
        if (updatedMapStrokes[currentHole])
            updatedMapStrokes[currentHole] = [...updatedMapStrokes[currentHole], thisStroke];
        else
            updatedMapStrokes[currentHole] = [thisStroke];

      setMapStrokes(updatedMapStrokes);

      const newArr = [...strokeCoordinates, { latitude, longitude }];
      //console.log('newArr', newArr);
      setStrokeCoordinates(newArr);

      

      if(lastStroke) return;
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

  const changeHole = (hole: number) => {

    if (hole < 0 ) return;
    if (hole >= courseObject.holes.length) return;

    setCurrentHole(hole);
    updateMapStrokes(hole);

  }

  const updateMapStrokes = (hole: number) => {
    const holeStrokes = mapStrokes[hole];
    if (!holeStrokes) {
      setStrokeCoordinates([]);
      return;
    }
    const newCoordinates = holeStrokes.map(item => ({
      latitude: item.startLatitude,
      longitude: item.startLongitude
    }));
    setStrokeCoordinates(newCoordinates);
  }

  const nextHole = () => {

    if (currentHole + 1 >= courseObject.holes.length) {
      return;
    }
    
    setCurrentHole(currentHole + 1);
    setCurrentStroke(0); // This will make the first stroke for the new hole be 1
    setStrokeCoordinates([]); // Reset map strokes
    setHoleFinished(false);

    if (test) {
      setLocation(null);
      updateTestLocation(courseObject.holes[currentHole + 1].teeBack, courseObject.holes[currentHole + 1].greenMiddle);
    }
    else {
      setLocation(location);
    };

    const distance = calculateDistance(courseObject.holes[currentHole + 1].teeBack.latitude,courseObject.holes[currentHole + 1].teeBack.longitude, courseObject.holes[currentHole + 1].greenMiddle.latitude, courseObject.holes[currentHole + 1].greenMiddle.longitude)
    adjustZoom(distance);
  };
  
  const finishRound = () => {
    addStroke(true);
    router.push({
      pathname: '/screens/roundsummary',
      params: { roundChosenId: roundId },
    });
    resetState();
  }
  const finishHole = () => {
    addStroke(true);
    setHoleFinished(true);
  }

  const ToggleLock = () => {
        setLockedView (!(LockedView));
  };

  const updateTestLocation = (forcedLocation = {}, nextHole = {}) => {

    //console.log('Updating test location');

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

    //console.log('Update to: ', updatedLatitude, updatedLongitude);

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
      const asdf: Location = {latitude: updatedLatitude, longitude: updatedLongitude};

      if (test) {
        setLocation(testLocation)
        setLocationGlobal(asdf)
      }
      else {
        setLocation(location)
        setLocationGlobal(asdf)
      };
      const distance = calculateDistance(
        testLocation.latitude,
        testLocation.longitude,
        nextHole.latitude ? nextHole.latitude : holeCoords.latitude,
        nextHole.longitude ? nextHole.longitude : holeCoords.longitude
      );

      setDistanceLeft(Math.round(distance));

  }

  if (test && !location) {
    updateTestLocation(teeCoords);
    setLocationGlobal(teeCoords);
  }

  const updateLocation = (event) => {
    const { coordinate } = event?.nativeEvent;
    //console.log('CTRLF HÄR',coordinate);
    const asdf: Location = {latitude: coordinate.latitude, longitude: coordinate.longitude};
    setLocationGlobal(coordinate)
    //console.log('ffffff',asdf)
    if (test) return;

    

    setLat2 ( coordinate.latitude);
    setLon2 ( coordinate.longitude); // Saves lat & lon of user position in "lat2" and "lon2" for use elsewhere.
    //return;
    if (coordinate){
      setLocation(coordinate);
      //console.log('location: ', location)
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
    if(!courseChosen) return;
    changeHole(currentGlobalHole);
    router.back();
  }, [currentGlobalHole]);
  

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

  useEffect(() => {
    console.log('strokeCoordinates', strokeCoordinates);
  }, [strokeCoordinates]);

  

  // Bottom sheet animation
  const screenHeight = Dimensions.get('window').height;
  let handleHeight;
  if (Platform.OS == 'ios') {
    handleHeight = screenHeight * 0.12;
  } else {
    handleHeight = screenHeight * 0.04;
  }
  const collapsedY = screenHeight - handleHeight;

  const expandedY = screenHeight - 350;
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

      {courseChosen &&

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

        }
      <MapView
        ref={mapRef}
        onMapReady={goToRegion}
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
        provider={PROVIDER_GOOGLE}
        mapType="satellite"
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        camera={{
          center: { latitude, longitude },
          heading: bearing,
          pitch: 90,
          zoom: zoomLevel
          // pitch: Platform.OS == 'android' ? 90 : 45,
          // zoom: Platform.OS == 'android' ? zoomLevel : undefined,
          // altitude: Platform.OS == 'ios' ? altitudeLevel : undefined
        }}
      >

          <Marker coordinate={courseChosen ? teeCoords : {latitude: 0, longitude: 0}}>
            <MaterialIcons name="sports-golf" size={28} color="white" />
          </Marker>
          <Marker coordinate={courseChosen ? holeCoords : {latitude: 0, longitude: 0}}>
            <MaterialIcons name="golf-course" size={28} color="red" />
          </Marker>
        
          {strokeCoordinates && strokeCoordinates.length > 1 && (

            <>
          <Polyline
            coordinates={getPoints(strokeCoordinates, 0.5)}
            strokeColor="#ed7845" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#ed7845',
              // '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#7F0000',
            ]}
            strokeWidth={3}
          />
          <Polyline
            coordinates={getPoints(strokeCoordinates, 0.2)}
            strokeColor='rgba(0,0,0,0.2)' // fallback for when `strokeColors` is not supported by the map-provider
            fillColor='rgba(0,0,0,0.2)'
            strokeWidth={3}
            />
        </>
        )}

        {test && location && courseChosen &&

        <Marker coordinate={location}>
          <MaterialIcons name="person" size={28} color="white" />
        </Marker>

        }

      </MapView>

        {courseChosen && 
      <View style={styles.floatingButtonContainer}>
      <CircleButton disabled={holeFinished} onPress={() => {addStroke(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);}} icon={"add-circle-outline"} label={"Add stroke"} />
      <ClubCircleButton onPress={() => {sheetAnim.setValue(expandedY)}} currentClub={currentClub} />
      <LieCircleButton onPress={() => {sheetAnim.setValue(expandedY)}} lie={currentLie} />
      <CircleButton onPress={goToScorecard} icon={"sports-score"} label={"Scorecard"} />
      { currentHole + 1 >= courseObject.holes.length ? (
        <CircleButton onPress={finishRound} icon={"check-circle-outline"} label={"Finish round"} />
      ) : (
        holeFinished ? 
          <CircleButton onPress={nextHole} icon={"navigate-next"} label={"Next hole"} />
        :
          <CircleButton disabled={currentStroke == 0} onPress={() => {finishHole(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);}} icon={"golf-course"} label={"Finish hole"} />
      )}
      </View>
    }

    
<Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.bottomSheet,
    { transform: [{ translateY: sheetAnim }] },
    !courseChosen && { display: 'none' }
  ]}
>



<View style={styles.strokeAdjusterRow}>
<TouchableOpacity style={{opacity: currentHole == 0 ? 0.5 : 1}} 
onPress={() => { 
  changeHole(currentHole - 1);
}
  }
>
    <MaterialIcons name="remove-circle-outline" size={36} color="black" />
</TouchableOpacity>


  <ThemedText style={styles.strokeCount}>
    {(currentHole + 1).toString()}
  </ThemedText>

  <TouchableOpacity
    style={{opacity: currentHole + 1 >= courseObject.holes.length ? 0.5 : 1}}
    onPress= {() => {
      changeHole(currentHole + 1);
    }}
  >
    <MaterialIcons name="add-circle-outline" size={36} color="black" />
  </TouchableOpacity>



</View>

{/* 
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
   */}
{/* </View>  */}

<View style={styles.buttonRow}>
  <ThemedText type="subtitle">{courseObject?.name}</ThemedText>
</View>


<ClubPicker onClubChoose={(item) => {setCurrentClub(item); sheetAnim.setValue(collapsedY);}} />
<LiePicker onLieChoose={(item) => {console.log(item); setCurrentLie(item); sheetAnim.setValue(collapsedY);}} />

</Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: '2.5%',
    width: '95%',
    height: 50,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
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