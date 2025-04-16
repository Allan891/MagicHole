import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

export function CircleButton({onPress, icon, label, disabled=false}) {


  useEffect(() => {
  }, []);


  return (
    <View style={{ alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>

    <TouchableOpacity style={styles.circleButton} onPress={disabled ? ()=>{} : onPress }>
      <MaterialIcons name={icon} size={28} color="black" />
    </TouchableOpacity>
    {label &&
    <Text style={styles.text}>{label}</Text>
    }

    </View>
  );
}

const styles = StyleSheet.create({
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    lineHeight: 32,
    marginTop: -6,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center'
  },
});
