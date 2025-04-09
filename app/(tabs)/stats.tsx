import { Redirect } from "expo-router";
import db from '../db/db';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import {View, Text,  StyleSheet} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
//import { Text, useTheme } from '@rneui/themed';

//const { theme } = useTheme();
const Stats = () => {
      return (
        <SafeAreaProvider>
          <SafeAreaView style={{height: '50%', backgroundColor: "black" ,flexDirection: 'row'}}>

                        <View style={styles.view1}>
                         <ThemedText style={{  textAlign: 'center', color: 'green'}} type="title">
                                 Tee
                                  a
                          </ThemedText>
                         <ThemedText style={{  textAlign: 'center', color: 'magenta'}} type="title">
                            Avg -0.77

                         </ThemedText>


                        </View>





                        <View style={styles.view2}>
                          <Text style={styles.text}

                                  >
                                <Text style={styles.titleText}>Approach



                                  </Text>

                            <Text style={styles.largeText}><Text style={styles.more}>{"\n"}Avg{"\n"}+3.3{"\n"}</Text></Text>
                            <Text style={styles}>{"\n"}Med{"\n"}+33</Text>
                          </Text>

                          <Text> +34</Text>
                        </View>



        </SafeAreaView><SafeAreaView style={{height: '50%', backgroundColor:'pink', flexDirection: 'row'}}>

             <View style={styles.view2}>
               <Text>Hello World!</Text>
             </View>





             <View style={styles.view1}>
               <Text>+33</Text>

             </View>



         </SafeAreaView>

        </SafeAreaProvider>
      );
  //return <Redirect href="/map" />;
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
        backgroundColor: 'blue', flex: 1,
      margin: 10,
    },
view2: {
      backgroundColor: 'red', flex: 1,
    margin: 10,
  },
  text: {
    textAlign: 'center',
    padding: 5,

  },
    more: {
      marginVertical: 20,
    },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  largeText: {
    fontSize: 30,
  },
});


export default Stats;