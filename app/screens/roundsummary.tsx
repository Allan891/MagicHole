import { StyleSheet, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import courses from '@/constants/courses';
import { HoleOverview } from '@/components/HoleOverview';
import {getCourse} from '@/utils';
import db from '../db/dbParameterCalls';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Scorecard } from '@/components/Scorecard';



export default function RoundSummary() {

  const { roundChosenId } = useLocalSearchParams();

  const [roundData, setRoundData] = useState<Object | undefined>(undefined);
  const [simpleRoundData, setSimpleRoundData] = useState<Object | undefined>(undefined);
  const [course, setCourse] = useState<Object | undefined>(undefined);

  const router = useRouter();
  
  useEffect(() => {
    async function updateRoundData() {
      const thisRoundData = await db.getRoundDetails(roundChosenId);
      setRoundData(thisRoundData);
      //console.log('thisRoundData', thisRoundData)
      const thisCourse = getCourse(thisRoundData.round?.courseId);
      setCourse(thisCourse);
      const thisSimpleRoundData = await db.getRoundData(roundChosenId);
      setSimpleRoundData(thisSimpleRoundData);
    }
    
    updateRoundData();
    
    }, []);

  const onChooseHole = async (index) => {

    //console.log('Strokes?', roundData?.strokes.filter(a => a.holeId == index))

    let holeData = {
      userStrokes: roundData?.strokes.filter(a => a.holeId == index), 
      hole: course?.holes[index]
    }

    holeData = JSON.stringify(holeData);

    router.push({
      pathname: '/screens/historymap',
      params: { holeData, courseId: course?.id, holeIndex: index },
    });
  };

  const getCourseTime = (timestamp) => {
    const date = new Date(timestamp);

    return date.toLocaleDateString();  
  };

  const getCourseTotal = (par, strokes) => {
    const totalStrokes = strokes.reduce((acc, val) => acc+ val ,0);
    const totalPar = par.reduce((acc, val) => acc+ val ,0);
    let diff = totalStrokes - totalPar;
    diff = (diff >= 0 ? diff = "+" + diff : diff = diff );
    return diff;
  };  

    const renderHole = ({ item, index }) => (
      //console.log(item.name),
      <View style={styles.holeItem}>
        <TouchableOpacity style={styles.holeItemInner} onPress={() => onChooseHole(index)}>
          <ThemedText style={{fontWeight: 'bold'}}>Hole {index + 1}:</ThemedText>
          <ThemedText>{simpleRoundData?.strokes[index]}</ThemedText>
          <ThemedText>{course?.par[index]} (par)</ThemedText>
        </TouchableOpacity>
      </View>

    );

  return (

    <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>History</ThemedText>
            {simpleRoundData?.strokes?.length && 
              <Scorecard handlePress={onChooseHole} strokes={simpleRoundData?.strokes} courseId={course?.id} />
            }
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
  holeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  holeItemInner: {
    flexDirection: 'row',
    gap: 10
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
