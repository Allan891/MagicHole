import { Redirect } from "expo-router";
import db from '../db/db';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import {View, Text,  StyleSheet} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { calculateDistance } from "@/utils";
import {calculateAverage, generateStatTables, getMedian} from "@/utils";
import { useRouter } from "expo-router";
import { globalStateVar } from "../state/globalStateVar";
//import { Text, useTheme } from '@rneui/themed';


//const { theme } = useTheme();
export const Stats = () => {
   const [sGAverage, setsGAverage] = useState<number[]>(1);
   const [sGMedian, setsGMedian] = useState<number[]>(1);
   const router = useRouter();
   const strokes = globalStateVar((state) => state.strokes);
   const [approachData, setApproachData] = useState<number[]>(1);
   const [chipData, setChipData] = useState<number[]>(1);
   const [teeData, setTeeData] = useState<number[]>(1);
   const [puttData, setPuttData] = useState<number[]>(1);

   useEffect(() => {
        /* db.getStrokes()
               .then((strokes) => {
               //console.log('All strokes: ', strokes);
                   const sGained = strokes.map(t=>t.strokesGained )
                          //console.log("sgained: ", sGained)
                          //sgApproach = calculateAverage(sGained)

                          setsgApproach([calculateAverage(sGained).toFixed(2),55, 1337])


                          //console.log('sgApproach',sgApproach)
               })
               .catch((error) => {
               console.error('Error fetching strokes:', error);
               });
                */
        const fetchData = async () => {
            //console.log('Start Fetch Data');
            const strokeTables: Stroke[][]  = await generateStatTables();
            ////console.log(strokeTables);
            ////console.log('WE ALMST DIT IT');
            ////console.log(' ');
            ////console.log('asdf ',calculateAverage(strokeTables[3].map(t=>t.strokesGained )).toFixed(2));
            setTeeData(strokeTables[0]);
            setApproachData(strokeTables[1]);
            //console.log('chipData:', strokeTables[2]);
            setChipData(strokeTables[2]);
            setPuttData(strokeTables[3]);
            setsGAverage([
                calculateAverage(strokeTables[0].map(t=>t.strokesGained )).toFixed(2),
                calculateAverage(strokeTables[1].map(t=>t.strokesGained )).toFixed(2),
                calculateAverage(strokeTables[2].map(t=>t.strokesGained )).toFixed(2),
                calculateAverage(strokeTables[3].map(t=>t.strokesGained )).toFixed(2)
                ]);
            //console.log('went through average');
            setsGMedian([
                getMedian(strokeTables[0]).toFixed(2),
                getMedian(strokeTables[1]).toFixed(2),
                getMedian(strokeTables[2]).toFixed(2),
                getMedian(strokeTables[3]).toFixed(2)
            ]);
            //console.log('went through median');
            //console.log('median: ',sGMedian);
            //console.log('WE DIT IT');
        }
            //console.log('Start Stats');
            fetchData();
            //.catch(console.error());
       }, [strokes]);

      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
              <View style={styles.container}>

                  <View style={styles.stats}>
                    {items.map(({ label, value }, index) => (
                        <View
                        key={index}
                        style={[styles.statsItem, index === 0 && { borderLeftWidth: 0 }]}
                        onTouchEnd={async () => {
                          if (label === "Approach") {
                            router.push({pathname: '../screens/detailed_stats/approachstats', params:{page:'Approach',data:JSON.stringify(approachData)}});
                          }
                          else if (label === "Tee") {
                            router.push({pathname: '../screens/detailed_stats/teestats',params:{page:'Tee',data:JSON.stringify(teeData)}});
                          }
                        }}>
                        <Text style={styles.title}>{label}</Text>

                        <Text style={styles.statsItemLabel}>Average</Text>

                        {(sGAverage[index] && sGAverage[index]>-10) && <Text style={styles.statsItemValue}>{sGAverage[index]}</Text>  }
                      {(!sGAverage[index] || sGAverage[index]<=-10) && <Text style={styles.statsItemValue}>'N/A'</Text>}
                        <Text style={styles.statsItemLabel}>Median</Text>

                        {(sGMedian[index] && sGMedian[index] > -10) && <Text style={styles.statsItemValue}>{sGMedian[index]}</Text>}
                        {(!sGMedian[index] || sGMedian[index] <= -10) && <Text style={styles.statsItemValue}>'N/A'</Text>}
                        </View>
                    ))}
                  </View>
                </View>
                <View style={styles.container}>

                    <View style={styles.stats}>
                      {items2.map(({ label, value }, index) => (
                        <View
                          key={index}
                          style={[styles.statsItem, index === 0 && { borderLeftWidth: 0 }]}
                          onTouchEnd={async () => {
                            if (label === "Chip") {
                              router.push({pathname: '../screens/detailed_stats/chipstats',params:{page:'Chip',data:JSON.stringify(chipData)}});
                            }
                            else if (label === "Putt") {
                              router.push({pathname: '../screens/detailed_stats/puttstats',params:{page:'Putt',data:JSON.stringify(puttData)}});
                            }
                          }}>
                          <Text style={styles.title}>{label}</Text>

                          <Text style={styles.statsItemLabel}>Average</Text>

                          {(sGAverage[index+2] && sGAverage[index+2]>-10) && <Text style={styles.statsItemValue}>{sGAverage[index +2]}</Text>  }
                         {(!sGAverage[index+2] || sGAverage[index+2]<=-10) && <Text style={styles.statsItemValue}>'N/A'</Text>}
                               <Text style={styles.statsItemLabel}>Median</Text>

                        {(sGMedian[index+2] && sGMedian[index+2]>-10) && <Text style={styles.statsItemValue}>{sGMedian[index+2]}</Text>  }
                      {(!sGMedian[index+2] || sGMedian[index+2]<=-10) && <Text style={styles.statsItemValue}>'N/A'</Text>}

                        </View>
                      ))}
                    </View>
                  </View>

            </SafeAreaView>



      );
  //return <Redirect href="/map" />;
};

 const getAverage = (): number => {
    if (sGAverage) return sGAverage
    return 0
    };

//var sgApproach = 0;

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
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Stats */
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
});


export default Stats;