import React from 'react';
import { useState } from 'react';
import db from '../../db/db'; // Adjust the import path as necessary
import { View, Text, StyleSheet, ScrollView,Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams,Stack } from 'expo-router';
import { BarChart} from "react-native-gifted-charts";
import { Dimensions } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Stroke, StrokeLieType } from '@/app/db/GolfDatabaseTypes';
import { useFocusEffect } from '@react-navigation/native';
import {Stats_theme} from '../../../constants/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


var PAGE_X= 0;
var PAGE_Y= 0;
var LOCATION_Y= 0;
var LOCATION_X= 0;
var minValue = 2;
var maxValue = -2;
const groupSize = 10;
const minDistance = 46;
const maxDistance = 205;

const handleTouch = (event) => {
  const { locationX, locationY, pageX, pageY } = event.nativeEvent;
  PAGE_X= pageX;
  PAGE_Y= pageY;
  LOCATION_X= locationX;
  LOCATION_Y= locationY;
};

const checkIfHoled = async (item) => {
  const nextStroke = await db.getNextStroke(item.roundId, item.holeId, item.strokeNr);
  if (nextStroke === null) return true ;
  return false;
};

const checkIfLandedOnGreen = async (stroke : Stroke) => {
  const nextStroke = await db.getNextStroke(stroke.roundId, stroke.holeId, stroke.strokeNr);
  if (nextStroke === null) {
    return true ;
  }
  if (nextStroke.lie == StrokeLieType.green) {
    return true ;
  }
  return false;
}

const addLandedOnGreen = async (data) => {
  const updatedData = await Promise.all(
    data.map(async (item) => {
      const landedOnGreen = await checkIfLandedOnGreen(item);
      const isHoled = await checkIfHoled(item);
      return { ...item, landedOnGreen: landedOnGreen || isHoled };
    })
  );
  return updatedData;
};

const ApproachScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
    const [barData, setBarData] = useState(null);
    const [graphData, setGraphData] = useState({"frontColor": "#3B5C3A", "label": "1m", "value": 0.42});
     // Handle the press event on a bar
    const onBarPress = (item) => {
      setBarData(item);
      setModalVisible(true);
    };
    const { page, data } = useLocalSearchParams();
    let parsedData = [];
         
  // #REGION PUTT
  useFocusEffect(
        React.useCallback(() => {
          // Do this when screen is focused
          try {
            parsedData = JSON.parse(data as string);
          } catch (e) {
            console.error('Error parsing data param:', e);
          }
          const fetchData = async () => {
              const ammendedData = await addLandedOnGreen(parsedData);
              console.log('ammendedData:', ammendedData);
  
          if (!ammendedData || !Array.isArray(ammendedData)) return;
          const grouped = ammendedData.reduce((acc, item) => {
            const distance = item.distanceLeft;
            if (distance < minDistance || distance > maxDistance) return acc;
            const groupStart = Math.floor((distance - minDistance) / groupSize) * groupSize + minDistance;
            const groupLabel = Math.floor((groupStart + (groupStart + groupSize - 1)) / 2);
              if (!acc[groupLabel]) acc[groupLabel] = [[], []];
              acc[groupLabel][0].push(item.strokesGained);
              acc[groupLabel][1].push(item.landedOnGreen);
            return acc;
          }, {} as Record<string, number[]>);   
          console.log('Grouped data:', grouped);
       
          const filteredData = Object.entries(grouped).map(
            ([range, strokeGainedArr]) => ({
              label: range + 'm',
              value:
              Math.round((strokeGainedArr[0].reduce((sum, val) => sum + val, 0) / strokeGainedArr[0].length)* 100) / 100,
              greenPercentage: Math.round((strokeGainedArr[1].length > 0 ? ((strokeGainedArr[1].filter(Boolean).length) / strokeGainedArr[1].length) * 100 : 0)* 10) / 10,  
            })
         );
          console.log('Filtered data:', filteredData);
          minValue = Math.min(...filteredData.map(item => item.value));
          maxValue = Math.max(...filteredData.map(item => item.value));
          minValue = minValue > 0 ? -0.5 : Math.floor(minValue * 2) / 2;
          maxValue = maxValue < 0 ? 0.5 : Math.ceil(maxValue * 2) / 2;
          setGraphData(filteredData);
          }
          fetchData();
          return () => {
            // Do this when the screen is unfocused
          };
        }, [])
      );
  // #END REGION

 const graphDisplayData = Array.isArray(graphData)
    ? graphData.map(item => ({
        topLabelComponent: () => (
          <Text
            style={{
              color: Stats_theme.CHART_TEXT_COLOR,
              fontSize: 13,
              fontFamily: 'PoppinsMedium',
            }}>
            {item.value}
          </Text>
        ),
        value: item.value,
        label: item.label,
        greenPercentage: item.greenPercentage, 
      }))
    : [];
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
        data={graphDisplayData} 
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
        barWidth={40}
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
                      height: 75,
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
                    Distance: {barData.label}
                    </Text>
                    <Text style={{ fontSize: 16 ,color: Stats_theme.POPUP_INFO_TEXT_COLOR }}>
                      Avg Stroke Gained: {barData.value}
                    </Text>
                    <Text style={{ fontSize: 16 ,color: Stats_theme.POPUP_INFO_TEXT_COLOR }}>
                      Green Percentage: {Math.round(barData.greenPercentage)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
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

export default ApproachScreen;