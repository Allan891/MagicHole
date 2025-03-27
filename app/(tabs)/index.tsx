import { Image, StyleSheet, Platform, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={{flex: 1}}>
      
    <View style={{flex: 1, backgroundColor: 'violet'}}>
      <MapView
      // provider={PROVIDER_GOOGLE}
      mapType='satellite'
      style={{flex: 1, backgroundColor: 'magenta'}}
      initialRegion={{
        latitude: 59.5346215,
        longitude: 17.960031,
        latitudeDelta: 0.00622,
        longitudeDelta: 0.00421,
      }}>
        <Marker coordinate={{latitude: 59.534253, longitude: 17.957261}}>
          <MaterialIcons size={28} name="golf-course" color={'red'} />
        </Marker>
        <Marker coordinate={{latitude: 59.534939, longitude: 17.962801}}>
          <MaterialIcons size={28} name="sports-golf" color={'white'} />
        </Marker>
      </MapView>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
