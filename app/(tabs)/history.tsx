import { StyleSheet, View, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import courses from '@/constants/courses';
import { HoleOverview } from '@/components/HoleOverview';
import {getPar} from '@/utils';
import dbExtra from '../db/dbParameterCalls';
import db from '../db/db';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';



export default function History() {

  const strokes = globalStateVar((state) => state.strokes);

  const roundsexample = [
    {id:1,courseid:1, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9]},
    {id:2,courseid:2, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9]},
    {id:3,courseid:3, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9]},
    {id:4,courseid:4, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9]},
    {id:5,courseid:5, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9]},
    {id:6,courseid:1, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9]},
    {id:7,courseid:2, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9,4,5,6,6,9]},
    {id:8,courseid:3, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9,2,5,4,6,3,5,6,8,9]},
    {id:9,courseid:4, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9,2,5,4,6,3,5,6,8,9]},
    {id:10,courseid:5, timestamp: Date.now(), strokes: [2,5,4,6,3,5,6,8,9,2,5,4,6,3,5,6,8,9]}
  ];

  const [rounds, setRounds] = useState<Object[]>([]);

  const router = useRouter();

  async function updateRounds() {
    const rounds2 = await dbExtra.getLatestRoundsData(999, 25);
    //console.log('rounds2', rounds2)
    setRounds(rounds2);
  }
  
  useEffect(() => {
    
    updateRounds();
    
    }, [strokes]);

  const onChooseRound = async (id) => {
    router.push({
      pathname: '/screens/roundsummary',
      params: { roundChosenId: id },
    });
  };


  const getCourseTime = (timestamp) => {
    const date = new Date(parseInt(timestamp));

    return date.toLocaleDateString();  
  };


  const getCourseName = (courseId) => {
    return courses.find(a => a.id === courseId)?.name;
  };

  const getCourseTotal = (par, strokes) => {
    if (!par) return;
    const parCopy = [...par];
    strokes.forEach((stroke, index) => {
      if (stroke === null) {
        parCopy[index] = 0;
      }
    });
    const totalStrokes = strokes.reduce((acc, val) => acc+ val ,0);
    const totalPar = parCopy.reduce((acc, val) => acc+ val ,0);
    let diff = totalStrokes - totalPar;
    diff = (diff >= 0 ? diff = "+" + diff : diff = diff );
    return diff;
  };  

  const removeRound = (id) => {

    db.deleteRound(id);
    updateRounds();

  }

  const showConfirmation = (id) => {
    Alert.alert(
      'Are you sure you want to remove this round?',
      'This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => removeRound(id) },
      ],
      { cancelable: true }
    );
  };

    const renderRound = ({ item }) => (
      //console.log(item),
      <View style={styles.courseItem}>
        <TouchableOpacity onLongPress={() => {showConfirmation(item.roundId)}} onPress={() => onChooseRound(item.roundId)}>
          <ThemedText style={styles.courseTotal}>{getCourseTotal(getPar(item.courseid),item.strokes)}</ThemedText>
          <ThemedText style={styles.courseText}>{getCourseName(item.courseid)}</ThemedText>
          <ThemedText>{getCourseTime(item.timestamp)}</ThemedText>
          <View style={{flex: 1}}>
            <HoleOverview holeData={item.strokes} courseId={item.courseid}/>
          </View>

        </TouchableOpacity>
      </View>

    );

  return (

    <ThemedView style={styles.container}>
      <FlatList
              data={rounds}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRound}
            />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
    gap: 12,
    paddingTop:50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  header: {
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'center',
    color: 'black',
  },
  cell: {
    width: '20%',
    textAlign: 'center',
    color: 'black',
  },
  birdie: {
    borderWidth: 1,
    borderColor: 'blue',
    color: 'black',
    borderRadius: 4,
  },
  bogey: {
    borderWidth: 1,
    borderColor: 'orange',
    color: 'black',
    borderRadius: 4,
  },
  doubleBogey: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'black',
    borderRadius: 4,
  },
  courseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  courseText: {
    fontSize: 18,
  },
  courseTotal: {
    fontSize: 24,
    position: 'absolute',
    right: 0,
    top: 5
  }
});
