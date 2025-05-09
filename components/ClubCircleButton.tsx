import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ClubIcon } from './ClubIcon';
// import { MaterialIcons } from '@expo/vector-icons'; // Uncomment if using MaterialIcons
// import ClubIcon from './ClubIcon'; // Ensure this import exists

export function ClubCircleButton({ onPress, currentClub, disabled = false }) {
    //console.log('currentClub', currentClub)
  return (
    <View style={{ alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity
        style={styles.circleButton}
        onPress={disabled ? () => {} : onPress}
      >
        <ClubIcon item={currentClub} label={false} />
        {/* Replace above with <MaterialIcons name="your-icon-name" size={28} color="black" /> if needed */}
      </TouchableOpacity>

      <Text style={styles.text}>{currentClub.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21, // 50% of 42
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
    textAlign: 'center',
  },
});
