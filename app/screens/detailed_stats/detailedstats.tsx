import React from 'react';
import db from '../../db/db'; // Adjust the import path as necessary
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams,Stack } from 'expo-router';
import { CurveType, LineChart} from "react-native-gifted-charts";
import { Dimensions } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
var PAGE_X= 0;
var PAGE_Y= 0;
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
  // console.log(`\n`);
  // console.log(`Touch X: ${locationX}, Y: ${locationY}`);
  // console.log(`Page X: ${pageX}, Y: ${pageY}`);
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
  
const ApproachScreen: React.FC = () => {
  const { page, data } = useLocalSearchParams();
  let parsedData = [];
  try {
    parsedData = JSON.parse(data as string);
    console.log('Parsed data:', parsedData);
  } catch (e) {
    console.error('Error parsing data param:', e);
  }
  const minValue = Math.min(...parsedData.map(item => item.value));
  const maxValue = Math.max(...parsedData.map(item => item.value));
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
        height: 100,
      }}>
          <LineChart
          areaChart
          curved
          curveType = {CurveType.QUADRATIC}
          data={parsedData}
          rotateLabel
          spacing={15}
          backgroundColor={CHART_BG_COLOR}
          color={CHART_LINE_COLOR}
          startFillColor={CHART_AREA_COLOR+"60"}
          endFillColor={CHART_AREA_COLOR+"03"}
          yAxisColor= {CHART_AXIS_COLOR}
          xAxisColor= {CHART_AXIS_COLOR}
          yAxisTextStyle={{color: CHART_TEXT_COLOR}}
          rulesColor= {CHART_RULES_COLOR}
          rulesThickness={1}
          thickness={1}
          startOpacity={0.8}
          endOpacity={0.1}
          initialSpacing={0}
          endSpacing={5}
          noOfSections={6}
          rulesType="solid"
          showScrollIndicator={true}
          stepValue={1}
          adjustToWidth={true}
          maxValue={maxValue+Math.abs(minValue)}
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisOffset={minValue}
          yAxisSide='right'
          pointerConfig={{
            pointerStripHeight: 200,
            pointerStripColor: POINTER_STRIP_COLOR,
            pointerStripWidth: 2,
            pointerColor: POINTER_COLOR,
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: items => {
              var marginL = 0;
              if (PAGE_X > 200){
                marginL = -110;
              }
              if (PAGE_X <= 200 && PAGE_X > 80){
                marginL = 50;
              }
              if (PAGE_X < 80){
                marginL = 0;
              }
              return (
                <View
                  style={{
                    height: 90,
                    width: 160,
                    justifyContent: 'center',
                    marginTop: 0,
                    marginLeft: marginL, // Adjusted to fit better
                    overflow: 'hidden', // Hide overflowing content
                  }}>
  
                  <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor: POINTER_LABEL_COLOR+'B2', display:'flex'}}>

                    <Text style={{color:POINTER_TEXT_COLOR,fontWeight: 'bold',textAlign:'justify'}}>
                        {'•Stroke Gained: ' + (items[0].value > 0 ? '+' : '') + (items[0].value === null ? '-' : items[0].value)}
                    </Text>
                    <Text style={{color:POINTER_TEXT_COLOR,fontWeight: 'bold',textAlign:'justify'}}>
                      {'•Distance: ' + items[0].distance + 'm'}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
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

export default ApproachScreen;