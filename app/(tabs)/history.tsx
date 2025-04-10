import { StyleSheet, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import courses from '@/constants/courses';
import { HoleOverview } from '@/components/HoleOverview';
import {getPar} from '@/utils';
import db from '../db/dbParameterCalls';
import { useEffect, useState } from 'react';


export default function History() {
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

  
  useEffect(() => {

    async function updateRounds() {
      const rounds2 = await db.getLatestRoundsData(999, 25);
      console.log('db rounds: ', rounds2);
      setRounds(rounds2);
    }
    
    updateRounds();
    

    }, []);

  const onChooseRound= (id) => (
    console.log("click")
  );

  
  const getCourseTime = (timestamp) => {
    const date = new Date(parseInt(timestamp));

    return date.toLocaleDateString();  
  };


  const getCourseName = (courseId) => {
    return courses.find(a => a.id === courseId)?.name;
  };

  const getCourseTotal = (par, strokes) => {
    const totalStrokes = strokes.reduce((acc, val) => acc+ val ,0);
    const totalPar = par.reduce((acc, val) => acc+ val ,0);
    let diff = totalStrokes - totalPar;
    diff = (diff >= 0 ? diff = "+" + diff : diff = diff );
    return diff;
  };  

    const renderRound = ({ item }) => (
      console.log(item.name),
      <View style={styles.courseItem}>
        <TouchableOpacity onPress={() => onChooseRound(item.id)}>
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
            <ThemedText style={styles.title}>History</ThemedText>

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
