import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import courses from '@/constants/courses';
import { HoleOverview } from '@/components/HoleOverview';
import {getCourse, categorizeStrokes, calculateAverage} from '@/utils';
import db from '../db/dbParameterCalls';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Scorecard } from '@/components/Scorecard';



export default function RoundSummary() {

  const { roundChosenId } = useLocalSearchParams();
  const [sGAverage, setsGAverage] = useState<number[]>(1);
  const [roundData, setRoundData] = useState<Object | undefined>(undefined);
  const [simpleRoundData, setSimpleRoundData] = useState<Object | undefined>(undefined);
  const [course, setCourse] = useState<Object | undefined>(undefined);
  const [bestStrokes, setBestStrokes] = useState<Object | undefined>(undefined);
  const [worstStrokes, setWorstStrokes] = useState<Object | undefined>(undefined);

  const router = useRouter();
  
  useEffect(() => {
    async function updateRoundData() {
      const thisRoundData = await db.getRoundDetails(roundChosenId);
      setRoundData(thisRoundData);
      console.log('thisRoundData', thisRoundData)
      const thisCourse = getCourse(thisRoundData.round?.courseId);
      setCourse(thisCourse);
      const thisSimpleRoundData = await db.getRoundData(roundChosenId);
      setSimpleRoundData(thisSimpleRoundData);
      const strokeTables: stroke[][]  = categorizeStrokes(thisRoundData.strokes);
      console.log('strokeTables History: ', strokeTables)
      setsGAverage([
          calculateAverage(strokeTables[0].map(t=>t.strokesGained )).toFixed(2),
          calculateAverage(strokeTables[1].map(t=>t.strokesGained )).toFixed(2),
          calculateAverage(strokeTables[2].map(t=>t.strokesGained )).toFixed(2),
          calculateAverage(strokeTables[3].map(t=>t.strokesGained )).toFixed(2)
      ]);
      console.log('History avg: ', sGAverage);

      const sortedStrokes = thisRoundData.strokes.sort((a,b) => {return b.strokesGained - a.strokesGained});

      console.log('sortedStrokes', sortedStrokes)

      // Filter out best strokes
      const thisBestStrokes = sortedStrokes.slice(0,3);

      // Filter out worst strokes
      const thisWorstStrokes = sortedStrokes.reverse().slice(0,3);

      setBestStrokes(thisBestStrokes);
      setWorstStrokes(thisWorstStrokes);

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

    const renderStroke = ({ item, index }) => (
      console.log(item),
      <View style={styles.holeItem}>
        <TouchableOpacity style={styles.holeItemInner} onPress={() => onChooseHole(item.holeId)}>
          <ThemedText style={{fontWeight: 'bold'}}>Hole {item.holeId + 1}, stroke {item.strokeNr + 1}:</ThemedText>
          <ThemedText>{item.strokesGained.toFixed(2)}</ThemedText>
          {/* <ThemedText>{course?.par[index]} (par)</ThemedText> */}
        </TouchableOpacity>
      </View>

    );

  return (
<ScrollView style={{ backgroundColor: 'white' }}>
    <ThemedView style={styles.container}>
        {/* <ThemedText style={styles.title}>History</ThemedText> */}

        <View style={styles.StatsContainer}>
        <View style={styles.stats}>
                          {items.map(({ label, value }, index) => (
                            <View
                              key={index}
                              style={[styles.statsItem, index === 0 && { borderLeftWidth: 0 }]}>
                              <Text style={styles.title}>{label}</Text>

                              <Text style={styles.statsItemLabel}>Average</Text>

                              {(sGAverage[index] && sGAverage[index]>-10) && <Text style={styles.statsItemValue}>{sGAverage[index]}</Text>  }
                            {(!sGAverage[index] || sGAverage[index]<=-10) && <Text style={styles.statsItemValue}>'N/A'</Text>}

                            </View>
                          ))}
                        </View>

                          <View style={styles.stats}>
                            {items2.map(({ label, value }, index) => (
                              <View
                                key={index}
                                style={[styles.statsItem, index === 0 && { borderLeftWidth: 0 }]}>
                                <Text style={styles.title}>{label}</Text>

                                <Text style={styles.statsItemLabel}>Average</Text>

                                {(sGAverage[index+2] && sGAverage[index+2]>-10) && <Text style={styles.statsItemValue}>{sGAverage[index +2]}</Text>  }
                               {(!sGAverage[index+2] || sGAverage[index+2]<=-10) && <Text style={styles.statsItemValue}>'N/A'</Text>}

                              </View>
                            ))}
                          </View>
                          </View>


            {simpleRoundData?.strokes?.length && 
              <Scorecard handlePress={onChooseHole} strokes={simpleRoundData?.strokes} courseId={course?.id} />
            }

        <View style={styles.StatsContainer}>
        

                          <ThemedText style={styles.title}>Best strokes</ThemedText>

                          <FlatList
                            data={bestStrokes}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderStroke}
                            // contentContainerStyle={styles.listStyle}
                          />

                          <ThemedText style={[styles.title, {marginTop: 20}]}>Worst strokes</ThemedText>

                          <FlatList
                            data={worstStrokes}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderStroke}
                            // contentContainerStyle={styles.listStyle}
                          />

                      </View>


    </ThemedView>
    </ScrollView>
  );
}


let items = [
  {
    label: 'Tee',


    value: '2',
  },
  {
    label: 'Approach',
    value: '243',
  },
];
let items2 = [
  {
    label: 'Chip',


    value: '2',
  },
  {
    label: 'Putt',
    value: '243',
  },
];


const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
    gap: 12,
    paddingTop:30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  statsContainer: {
      padding: 20,
      paddingTop: 20,
    },
    statsTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: '#1d1d1d',
      marginBottom: 12,
    },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsItem: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
      borderLeftWidth: 1,
      borderColor: '#e1e1e1',
    },
    statsItemLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: '#000',
      marginBottom: 4,
    },
    statsItemValue: {
      fontSize: 17,
      fontWeight: '700',
      color: '#000',
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
