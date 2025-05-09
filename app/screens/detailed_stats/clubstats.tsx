import React, { useEffect } from 'react';
import { useState } from 'react';
import db from '../../db/db'; // Adjust the import path as necessary
import { View, Text, StyleSheet, ScrollView,Modal, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams,Stack } from 'expo-router';
import { BarChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import golfClubs from '@/constants/golfClubs';
import { ClubCircleButton } from '@/components/ClubCircleButton';
import { Stroke } from '@/app/db/GolfDatabaseTypes';

var PAGE_X= 0;
var PAGE_Y= 0;
var LOCATION_Y= 0;
var LOCATION_X= 0;
const PAGE_BG_COLOR="#Fff";
const CHART_BG_COLOR="#fff";
const CHART_LINE_COLOR="#2A4A2C";
const CHART_AREA_COLOR="#A7D08E";
const CHART_AXIS_COLOR="#3B5C3A";
const CHART_RULES_COLOR="#808080";
const CHART_TEXT_COLOR="#3B5C3A";
const POINTER_STRIP_COLOR="#6B8E23";
const POINTER_COLOR="#FFFFFF";
const POINTER_LABEL_COLOR="#3B5C3A";
const POINTER_TEXT_COLOR="#FFFFFF";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

  
const ClubStatsScreen: React.FC = () => {
  
  const { golfClubId } = useLocalSearchParams();

    const [averageDistance, setAverageDistances] = useState<object | null>(null);
    const [strokes, setStrokes] = useState<Stroke[] | null>(null);
  

  const club = golfClubs.find(a => a.id == golfClubId);

    useEffect(() => {
      const getStats = async () => {
          const stats = await db.getAverageDistanceForClub(golfClubId);
          const strokes = await db.getStrokesByGolfClubId(golfClubId);
          setAverageDistances(stats[0]);
          setStrokes(strokes);
          console.log('strokes:', createDistanceHistogram(strokes))
      }
      getStats();
    },[]);

    function createDistanceHistogram(strokes: { distance: number }[]): { value: number, label: string }[] {
      const distances = strokes
        .map(s => s.distance)
        .filter(d => typeof d === 'number' && d > 0);
    
      if (distances.length === 0) return [];
    
      const min = Math.min(...distances);
      const max = Math.max(...distances);
    
      // If there's only one distinct value, create a single bin
      if (min === max) {
        return [
          {
            value: distances.length,
            label: `${Math.round(min)}m`
          }
        ];
      }
    
      const binCount = Math.ceil(Math.sqrt(distances.length));
      const binSize = (max - min) / binCount;
    
      if (binSize === 0) {
        return [
          {
            value: distances.length,
            label: `${Math.round(min)}-${Math.round(max)}m`
          }
        ];
      }
    
      const bins = new Array(binCount).fill(0);
    
      for (const d of distances) {
        const binIndex = Math.min(Math.floor((d - min) / binSize), binCount - 1);
        bins[binIndex]++;
      }
    
      return bins.map((count, index) => {
        const binStart = min + binSize * index;
        const binEnd = binStart + binSize;
        return {
          value: count,
          label: `${Math.round(binStart)}-${Math.round(binEnd)}m`
        };
      });
    }
    
    
    

  const getClubType = (name: string) => {
    if (name === 'Drivers & Woods') return 'Wood';
    if (name === 'Hybrids') return 'Wood';
    if (name === 'Irons') return 'Iron';
    if (name === 'Wedges') return 'Wedge';
    if (name === 'Putter') return 'Putter';
    return '';
  };

  return (
    <SafeAreaView>
    <Stack.Screen options={{ headerShown: false }} />
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <ClubCircleButton onPress={() => {}} currentClub={club} />
      </View>
     <View style={[styles.clubRow, styles.tableHeader]}>
      <Text style={styles.columnHeader}>Avg</Text>
      <Text style={styles.columnHeader}>Max</Text>
      <Text style={styles.columnHeader}>Strokes</Text>
      </View>
      <View style={styles.clubRow}>
       <Text style={styles.clubStat}>{Math.round(averageDistance?.averageDistance)}m</Text>
      <Text style={styles.clubStat}>{Math.round(averageDistance?.maxDistance)}m</Text>
      <Text style={styles.clubStat}>{averageDistance?.strokeCount}</Text>
      </View>
      {strokes && true &&
      <BarChart 
              // onPress={}
              autoShiftLabels={true}
              data={createDistanceHistogram(strokes)} 
              showFractionalValues={true}
              maxValue={Math.max(...createDistanceHistogram(strokes).map(s => s.value))}
              mostNegativeValue={0}
              // noOfSections={Math.ceil(maxValue)*2}
              // noOfSectionsBelowXAxis ={Math.ceil(Math.abs(minValue))*2}
              height ={400}
              width={windowWidth-80}
              barBorderColor={CHART_LINE_COLOR}
              frontColor={CHART_AREA_COLOR}
              spacing={30}
              barWidth={40}
              stepValue={0.5}
              negativeStepValue={0.5}
              rulesType="dashed"
              backgroundColor={CHART_BG_COLOR}
              color={CHART_LINE_COLOR}
              yAxisColor= {CHART_AXIS_COLOR}
              xAxisColor= {CHART_AXIS_COLOR}
              yAxisTextStyle={{color: CHART_TEXT_COLOR}}
              roundToDigits={1}
              />
      }
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 18,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
  },
  clubName: {
    flex: 1,
    fontSize: 16,
  },
  toggleButton: {
    marginRight: 12,
    color: '#007bff',
  },
  activeClubsContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedClub: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedClubText: {
    marginRight: 6,
    fontSize: 14,
  },
  removeButton: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
    marginBottom: 8,
  },
  
  columnHeader: {
    fontWeight: 'bold',
    flex: 1,
  },
  
//   clubRow: {
//     flexDirection: 'row',
//     paddingVertical: 6,
//   },
  
//   clubName: {
//     flex: 1,
//   },
  
  clubStat: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ClubStatsScreen;