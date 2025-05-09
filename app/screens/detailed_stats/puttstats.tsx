import React from 'react';
import { useState } from 'react';
import db from '../../db/db'; // Adjust the import path as necessary
import { View, Text, StyleSheet, ScrollView,Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams,Stack } from 'expo-router';
import {  BarChart} from "react-native-gifted-charts";
import { Dimensions } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var PAGE_X= 0;
var PAGE_Y= 0;
var LOCATION_Y= 0;
var LOCATION_X= 0;
var minValue = 2;
var maxValue = -2;
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
const groupSize = 3;
const minDistance = 0;
const maxDistance = 205;


const checkIfHoled = async (item) => {
const nextStroke = await db.getNextStroke(item.roundId, item.holeId, item.strokeNr);
if (nextStroke === null) {
  return true ;
}
return false;
};

const addHoled = async (data) => {
  const updatedData = await Promise.all(
    data.map(async (item) => {
      const isHoled = await checkIfHoled(item);
      console.log('isHoled:', isHoled);
      return { ...item, holed: isHoled };
    })
  );
  // console.log('Updated data:', updatedData);
  return updatedData;
};

const PuttScreen: React.FC = () => {
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
       
  useFocusEffect(
      React.useCallback(() => {
        // Do this when screen is focused
        try {
          parsedData = JSON.parse(data as string);
        } catch (e) {
          console.error('Error parsing data param:', e);
        }
        const fetchData = async () => {
            const ammendedData = await addHoled(parsedData);
            console.log('ammendedData:', ammendedData);

        if (!ammendedData || !Array.isArray(ammendedData)) return;
        const grouped = ammendedData.reduce((acc, item) => {
          const distance = item.distanceLeft;
          if (distance < minDistance || distance > maxDistance) return acc;
          const groupStart = Math.floor((distance - minDistance) / groupSize) * groupSize + minDistance;
          const groupLabel = Math.floor((groupStart + (groupStart + groupSize - 1)) / 2);
            if (!acc[groupLabel]) acc[groupLabel] = [[], []];
            acc[groupLabel][0].push(item.strokesGained);
            acc[groupLabel][1].push(item.holed);
          return acc;
        }, {} as Record<string, number[]>);
        console.log('Grouped data:', grouped);
        
        const filteredData = Object.entries(grouped).map(
          ([range, strokeGainedArr]) => ({
            label: range + 'm',
            value:
            Math.round((strokeGainedArr[0].reduce((sum, val) => sum + val, 0) / strokeGainedArr[0].length)* 100) / 100,
            makePercentage: Math.round((strokeGainedArr[1].length > 0 ? ((strokeGainedArr[1].filter(Boolean).length) / strokeGainedArr[1].length) * 100 : 0)* 10) / 10,  
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
 
  const graphDisplayData = Array.isArray(graphData)
    ? graphData.map(item => ({
        topLabelComponent: () => (
          <Text
            style={{
              color: CHART_TEXT_COLOR,
              fontSize: 13,
              fontFamily: 'PoppinsMedium',
            }}>
            {item.value}
          </Text>
        ),
        value: item.value,
        label: item.label,
        makePercentage: item.makePercentage, 
      }))
    : [];
  var totalHeight = windowHeight * 0.3 * maxValue / (maxValue+Math.abs(minValue));

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
        data={graphDisplayData}
        maxValue={maxValue}
        mostNegativeValue={minValue}
        showFractionalValues={true}
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
                height: 75,
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
              <Text style={{ fontSize: 16 ,color: POINTER_TEXT_COLOR }}>
                Make Percentage: {Math.round(barData.makePercentage)}%
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

export default PuttScreen;