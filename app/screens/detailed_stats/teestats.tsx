import React from 'react';
import { useState } from 'react';
import db from '../../db/db'; // Adjust the import path as necessary
import {Stats_theme} from '../../../constants/Colors';
import { View, Text, StyleSheet, ScrollView,Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams,Stack } from 'expo-router';
import { BarChart } from "react-native-gifted-charts";
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StrokeLieType } from '@/app/db/GolfDatabaseTypes';
import golfClubs from '../../../constants/golfClubs';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var PAGE_X= 0;
var PAGE_Y= 0;
var LOCATION_Y= 0;
var LOCATION_X= 0;

const handleTouch = (event) => {
  const { locationX, locationY, pageX, pageY } = event.nativeEvent;
  PAGE_X= pageX;
  PAGE_Y= pageY;
  LOCATION_X= locationX;
  LOCATION_Y= locationY;
};


  const fetchAndJoinData = async () => {
    try {
      const holeData = await db.getHoles(); // Fetch data from the first DB function
      const strokesData = await db.getStrokes(); // Fetch data from the second DB function
  
      // Join the arrays based on holeId = id
      const joinedData = strokesData.map(stroke => {
        const hole = holeData.find(h => h.id === stroke.holeId);
        return {
          ...stroke,
          holeLong : hole ? hole.flagLongitude: null,
          holeLat: hole ? hole.flagLatitude:null,
        };
      });
      return joinedData;
    } catch (error) {
      console.error('Error fetching or joining data:', error);
      return [];
    }
  };

  const addNextStrokeLie = async (data) => {
    const updatedData = await Promise.all(
      data.map(async (item) => {
        const nextStroke = await db.getNextStroke(item.roundId, item.holeId, item.strokeNr);
        return { ...item, nextLie: nextStroke ? nextStroke.lie : null };
      })
    );
    // console.log('Updated data:', updatedData);
    return updatedData;
  };
  const TeeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [barData, setBarData] = useState(null);

  const [percentageData, setPercentageData] = useState<number[]>(50);
  const [graphData, setGraphData] = useState<Record<string, number[]>>(1);
   // Handle the press event on a bar
  const onBarPress = (item) => {
    setBarData(item);
    setModalVisible(true);
  };
  const { page, data } = useLocalSearchParams();
  let parsedData = [];
  
  useFocusEffect(
    React.useCallback(() => {
      // Do this when screen is focused

      console.log('Page focused');
      parsedData = JSON.parse(data as string);
      
      const fetchData = async () => {
        try {
          const ammendedData = await addNextStrokeLie(parsedData);
          const calculateFairwaysHit = () => {
            if (!ammendedData || !Array.isArray(ammendedData) || ammendedData.length === 0) return 0;
            const count = ammendedData.filter(item => item.nextLie === StrokeLieType.fairway || item.nextLie === StrokeLieType.green).length;
            console.log('ammendedData length:', ammendedData.length);
            return Math.round((count / ammendedData.length) * 100);
        }
          setPercentageData(calculateFairwaysHit);
        } catch (e) {
          console.error('Error parsing data param:', e);
        }
      }
      fetchData();

      if (!parsedData || !Array.isArray(parsedData)) return;
      const grouped = parsedData.reduce((acc, item) => {
        const groupLabel = item.golfClubId;
        if (!acc[groupLabel]) acc[groupLabel] = [];
        acc[groupLabel].push(item.strokesGained);
        return acc;
      }, {} as Record<string, number[]>);
      setGraphData(grouped);

      return () => {
        // Do this when the screen is unfocused
        
      };
    }, [])
  );

  const averageStrokeGainedByClub = Object.entries(graphData).map(
    ([golfClubId, strokeGainedArr]) => {
      const club = golfClubs.find(c => c.id == golfClubId);
      return {
        topLabelComponent: () => (
          <Text
            style={{
              color: Stats_theme.CHART_TEXT_COLOR,
              fontSize: 13,
              fontFamily: 'PoppinsMedium',
            }}>
            {Math.round((strokeGainedArr.reduce((sum, val) => sum + val, 0) / strokeGainedArr.length) * 100) / 100}
          </Text>
        ),
        frontColor: Stats_theme.BAR_COLOR,
        label: club ? club.name : `Club: ${golfClubId}`,
        value: strokeGainedArr.reduce((sum, val) => sum + val, 0) / strokeGainedArr.length,
      };
    }
  );
averageStrokeGainedByClub.forEach(item => {
  item.value =  Math.round(item.value * 100) / 100;
});
averageStrokeGainedByClub.sort((a, b) => {
  // Extract the start of the range as a number for sorting
  const getStart = (range: string) => parseInt(range.split('-')[0], 10);
  return getStart(a.label) - getStart(b.label);
});
  var minValue = Math.min(...averageStrokeGainedByClub.map(item => item.value));
  var maxValue = Math.max(...averageStrokeGainedByClub.map(item => item.value));
  minValue = minValue > 0 ? -0.5 : Math.floor(minValue * 2) / 2;
  maxValue = maxValue < 0 ? 0.5 : Math.ceil(maxValue * 2) / 2;
  var totalHeight = windowHeight * 0.3 * maxValue / (maxValue+Math.abs(minValue));

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ backgroundColor: Stats_theme.PAGE_BG_COLOR }}></SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detailed Stats - {page}</Text>
      {/* Add your components or content here */}
    <View onTouchMove={handleTouch}
      style={{
        marginVertical: 50,
        maxHeight: '50%'
      }}>
        <BarChart 
        onPress={onBarPress}
        autoShiftLabels={true}
        data={averageStrokeGainedByClub} 
        maxValue={maxValue}
        mostNegativeValue={minValue}
        showFractionalValues={true}
        noOfSections={Math.ceil(maxValue)*2}
        noOfSectionsBelowXAxis ={Math.ceil(Math.abs(minValue))*2}
        height ={totalHeight}
        width={windowWidth-40}
        barBorderColor={Stats_theme.BAR_BORDER_COLOR}
        barBorderWidth={1}
        frontColor={Stats_theme.BAR_COLOR}
        spacing={10}
        barWidth={70}
        stepValue={0.5}
        negativeStepValue={0.5}
        rulesType="dashed"
        backgroundColor={Stats_theme.CHART_BG_COLOR}
        color={Stats_theme.BAR_BORDER_COLOR}
        yAxisColor= {Stats_theme.CHART_AXIS_LINE_COLOR}
        xAxisColor= {Stats_theme.CHART_AXIS_LINE_COLOR}
        yAxisTextStyle={{color: Stats_theme.CHART_TEXT_COLOR}}
        roundToDigits={1}
        />
          
        {/* Modal to show the information when a bar is pressed */}
      {barData && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="none"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              //backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={{
                width: windowWidth - 100,
                height: 55,                
                backgroundColor: Stats_theme.POPUP_INFO_BG_COLOR+"c9",
                padding: 0,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: Stats_theme.BAR_BORDER_COLOR,
                alignItems: 'center',
                margin:0,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold',color: Stats_theme.POPUP_INFO_TEXT_COLOR }}>
              {barData.label} 
              </Text>
              <Text style={{ fontSize: 16 ,color: Stats_theme.POPUP_INFO_TEXT_COLOR }}>
                Avg Stroke Gained: {barData.value}
              </Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      </View>

    <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
    <Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: `black`,
        textAlign: 'center',
      }}
      >
      Fairways hit
      </Text>
      <Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: `rgb(${120 + Math.round((100 - (percentageData as number)) * 1.35)},${80 + Math.round((percentageData as number) * 1.35)},0)`,
        textAlign: 'center',
      }}
      >
      {percentageData}%
      </Text>
    </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Stats_theme.PAGE_BG_COLOR,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default TeeScreen;