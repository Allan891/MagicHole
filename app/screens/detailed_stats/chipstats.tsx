import React from 'react';
import { useState } from 'react';
import db from '../../db/db'; // Adjust the import path as necessary
import { View, Text, StyleSheet, ScrollView,Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams,Stack } from 'expo-router';
import { CurveType, LineChart, BarChart} from "react-native-gifted-charts";
import { Dimensions } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


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

const handleTouch = (event) => {
  const { locationX, locationY, pageX, pageY } = event.nativeEvent;
  PAGE_X= pageX;
  PAGE_Y= pageY;
  LOCATION_X= locationX;
  LOCATION_Y= locationY;

  // console.log(`\n`);
  // console.log(`Touch X: ${locationX}, Y: ${locationY}`);
  // console.log(`Page X: ${pageX}, Y: ${pageY}`);
};

  
const ChipScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [barData, setBarData] = useState(null);
   // Handle the press event on a bar
  const onBarPress = (item) => {
    setBarData(item);
    setModalVisible(true);
  };
  const { page, data } = useLocalSearchParams();
  let parsedData = [];
  try {
    parsedData = JSON.parse(data as string);
    console.log('Parsed Chip data:', parsedData);
  } catch (e) {
    console.error('Error parsing data param:', e);
  }
  const groupSize = 10;
  const minDistance = 46;
  const maxDistance = 205;

  const groupedByLie = parsedData.reduce((acc, item) => {
    console.log('groupedByLie item:', item);
    const lie = item.lie;
    if (!acc[lie]) acc[lie] = [];
    acc[lie].push(item.strokesGained);
    return acc;
  }, {} as Record<string, number[]>);

  const averageStrokeGainedByDistanceLeft = Object.entries(groupedByLie).map(
    ([range, strokeGainedArr]) => ({
      topLabelComponent: () => (
        <Text
          style={{
            color: CHART_TEXT_COLOR,
            fontSize: 13,
            fontFamily: 'PoppinsMedium',
          }}>
          {Math.round((strokeGainedArr.reduce((sum, val) => sum + val, 0) / strokeGainedArr.length) * 100)/100}
        </Text>
      ),
      frontColor: CHART_TEXT_COLOR,
      label: range,
      value:
        strokeGainedArr.reduce((sum, val) => sum + val, 0) / strokeGainedArr.length,
    })
 );
averageStrokeGainedByDistanceLeft.forEach(item => {
  item.value =  Math.round(item.value * 100) / 100;
});
averageStrokeGainedByDistanceLeft.sort((a, b) => {
  // Extract the start of the range as a number for sorting
  const getStart = (range: string) => parseInt(range.split('-')[0], 10);
  return getStart(a.label) - getStart(b.label);
});
  console.log('Grouped data:', averageStrokeGainedByDistanceLeft);
  var minValue = Math.min(...averageStrokeGainedByDistanceLeft.map(item => item.value));
  minValue = minValue > 0 ? -0.5 : Math.floor(minValue * 2) / 2;
  var maxValue = Math.max(...averageStrokeGainedByDistanceLeft.map(item => item.value));
  maxValue = maxValue < 0 ? 0.5 : Math.ceil(maxValue * 2) / 2;
  var totalHeight = windowHeight * 0.3 * maxValue / (maxValue+Math.abs(minValue));
  console.log('Max Value:', maxValue);
  console.log('noOfSections:', Math.ceil(maxValue)+1);
  console.log('Min Value:', minValue);
  console.log('noOfSectionsBelowXAxis:', Math.ceil(Math.abs(minValue))+1);

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ backgroundColor: PAGE_BG_COLOR }}></SafeAreaView>
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
        data={averageStrokeGainedByDistanceLeft} 
        showFractionalValues={true}
        maxValue={maxValue}
        mostNegativeValue={minValue}
        noOfSections={Math.ceil(maxValue)*2}
        noOfSectionsBelowXAxis ={Math.ceil(Math.abs(minValue))*2}
        height ={totalHeight}
        width={windowWidth-40}
        barBorderColor={CHART_LINE_COLOR}
        frontColor={CHART_AREA_COLOR}
        spacing={10}
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
                backgroundColor: POINTER_LABEL_COLOR+"c9",
                padding: 0,
                borderRadius: 10,
                borderWidth: 3,
                borderColor: 'black',
                alignItems: 'center',
                margin:0,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold',color: POINTER_TEXT_COLOR }}>
              Distance: {barData.label} 
              </Text>
              <Text style={{ fontSize: 16 ,color: POINTER_TEXT_COLOR }}>
                Avg Stroke Gained: {barData.value}
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
    backgroundColor: PAGE_BG_COLOR,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ChipScreen;