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
import PagerView from 'react-native-pager-view';
import ClubStats from "@/components/ClubStats";

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
   const [currentPage, setCurrentPage] = useState(0);


   useEffect(() => {
        const fetchData = async () => {
            //console.log('Start Fetch Data');
            const strokeTables: Stroke[][]  = await generateStatTables();
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
            setsGMedian([
                getMedian(strokeTables[0]).toFixed(2),
                getMedian(strokeTables[1]).toFixed(2),
                getMedian(strokeTables[2]).toFixed(2),
                getMedian(strokeTables[3]).toFixed(2)
            ]);
        }
            fetchData();
       }, [strokes]);

      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <PagerView style={styles.container} initialPage={0} onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
            <View style={[styles.page, {padding: 20, marginTop: '10%'}]} key="1">
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
            </View>
            <View style={styles.page} key="2">
              <ClubStats />
            </View>
          </PagerView>
          <View style={styles.pageIndicatorContainer}>
              {[0, 1].map((page) => (
                <View
                  key={page}
                  style={[
                    styles.dot,
                    currentPage === page ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
            </View>



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
  pageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#888',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  page: {
    flex: 1,
  },
  container: {
    flex: 1
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