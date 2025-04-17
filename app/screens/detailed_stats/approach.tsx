import React from 'react';
import db from '../../db/db'; // Adjust the import path as necessary
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";

const ptData = [
    {value: 1, date: '50'},
    {value: 1, date: '53'},
    {value: 1, date: '53'},
    {value: 1, date: '53'},
    {value: 1, date: '53'},
    {value: 1, date: '53'},
    {value: 1, date: '53'},
    {value: 2, date: '52'},
  
    {value: 2, date: '55'},
    {
      value: 2,
      date: '50',
      label: '50',
      labelTextStyle: {color: 'gray', width: 60},
    },
    {value: 2, date: '72'},
    {value: 2, date: '72'},
    {value: 3, date: '72'},
    {value: 3, date: '72'},
    {value: 2, date: '72'},
    {value: 3, date: '72'},
    {value: 3, date: '72'},
    {value: 2, date: '72'},
    {value: 2, date: '72'},
    {
      value: 3,
      date: '60',
      label: '60',
      labelTextStyle: {color: 'gray', width: 60},
    },
    {value: 1, date: '73'},
    {value: 1, date: '76'},
    {value: 1, date: '71'},
    {value: 1, date: '79'},
    {value: 1, date: '83'},
    {value: 1, date: '82'},
    {value: 1, date: '89'},
    {value: 1, date: '86'},
    {value: -4, date: '83'},
    {
      value: 2,
      date: '70',
      label: '70',
      labelTextStyle: {color: 'gray', width: 60},
    },
    {value: 2, date: '91'},
    {value: 2, date: '93'},
    {value: 2, date: '96'},
    {value: 2, date: '98'},
    {value: 2, date: '103'},
  ];

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
  const minValue = Math.min(...ptData.map(item => item.value));
  const maxValue = Math.max(...ptData.map(item => item.value));
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detailed Stats - Approach</Text>
      {/* Add your components or content here */}
    <View
      style={{
        paddingVertical: 100,
        paddingLeft: 20,
        backgroundColor: '',
      }}>
          <LineChart
          areaChart
          data={ptData}
          rotateLabel
          width={300}
          hideDataPoints
          spacing={10}
          color="#00ff83"
          thickness={2}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={6}
          maxValue={maxValue+Math.abs(minValue)+1}
          yAxisColor="white"
          yAxisThickness={0}
          yAxisOffset={minValue-0.5}
          rulesType="solid"
          rulesColor="gray"
          stepValue={1}
          yAxisTextStyle={{color: 'gray'}}
          yAxisSide='right'
          xAxisColor="lightgray"
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: items => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: 'center',
                    marginTop: -30,
                    marginLeft: -40,
                  }}>
                  <Text style={{color: 'white', fontSize: 14, marginBottom:6,textAlign:'center'}}>
                    {items[0].date}
                  </Text>
  
                  <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'white'}}>
                    <Text style={{fontWeight: 'bold',textAlign:'center'}}>
                      {'SG ' + items[0].value}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
      </View>

    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ApproachScreen;