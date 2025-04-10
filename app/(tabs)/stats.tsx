import { Redirect } from "expo-router";
import db from '../db/db';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import {View, Text,  StyleSheet} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { calculateDistance } from "@/utils";
import {calculateAverage, generateStatTables} from "@/utils";
//import { Text, useTheme } from '@rneui/themed';


//const { theme } = useTheme();
export const Stats = () => {
   const [sgApproach, setsgApproach] = useState<number[]>(1);

   useEffect(() => {
        /* db.getStrokes()
               .then((strokes) => {
               console.log('All strokes: ', strokes);
                   const sGained = strokes.map(t=>t.strokesGained )
                          console.log("sgained: ", sGained)
                          //sgApproach = calculateAverage(sGained)

                          setsgApproach([calculateAverage(sGained).toFixed(2),55, 1337])


                          console.log('sgApproach',sgApproach)
               })
               .catch((error) => {
               console.error('Error fetching strokes:', error);
               });
                */
        const fetchData = async () => {
            const strokeTables: stroke[][]  = await generateStatTables();
                    console.log(strokeTables);
                    console.log('WE ALMST DIT IT');
                    console.log(' ');
                    console.log('asdf ',calculateAverage(strokeTables[3].map(t=>t.strokesGained )).toFixed(2));
                    setsgApproach([
                        calculateAverage(strokeTables[0].map(t=>t.strokesGained )).toFixed(2),
                        calculateAverage(strokeTables[1].map(t=>t.strokesGained )).toFixed(2),
                        calculateAverage(strokeTables[2].map(t=>t.strokesGained )).toFixed(2),
                        calculateAverage(strokeTables[3].map(t=>t.strokesGained )).toFixed(2)
                        ]);
                    console.log('WE DIT IT');
        }

            fetchData();
            //.catch(console.error());
       }, []);



      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
              <View style={styles.container}>
                  <Text style={styles.title}>Your Stats</Text>

                  <View style={styles.stats}>
                    {items.map(({ label, value }, index) => (
                      <View
                        key={index}
                        style={[styles.statsItem, index === 0 && { borderLeftWidth: 0 }]}>
                        <Text style={styles.title}>{label}</Text>

                        <Text style={styles.statsItemLabel}>Average</Text>

                        {sgApproach && <Text style={styles.statsItemValue}>{sgApproach[index]}</Text>  }
                      {!sgApproach && <Text style={styles.statsItemValue}>'N/A'</Text>}
                        <Text style={styles.statsItemLabel}>Median</Text>

                       {sgApproach[index] && <Text style={styles.statsItemValue}>{sgApproach[index]}</Text>  }
                      {!sgApproach[index] && <Text style={styles.statsItemValue}>'N/A'</Text>}

                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.container}>

                    <View style={styles.stats}>
                      {items2.map(({ label, value }, index) => (
                        <View
                          key={index}
                          style={[styles.statsItem, index === 0 && { borderLeftWidth: 0 }]}>
                          <Text style={styles.title}>{label}</Text>

                          <Text style={styles.statsItemLabel}>Average</Text>

                          {sgApproach && <Text style={styles.statsItemValue}>{sgApproach[index+2]}</Text>  }
                        {!sgApproach && <Text style={styles.statsItemValue}>'N/A'</Text>}
                          <Text style={styles.statsItemLabel}>Median</Text>

                          {sgApproach && <Text style={styles.statsItemValue}>{sgApproach[index+2]}</Text>  }
                        {!sgApproach && <Text style={styles.statsItemValue}>'N/A'</Text>}

                        </View>
                      ))}
                    </View>
                  </View>

            </SafeAreaView>



      );
  //return <Redirect href="/map" />;
};

 const getAverage = (): number => {
    if (sgApproach) return sgApproach
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