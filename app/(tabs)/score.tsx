import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

const courseObject = {
  name: 'Brollsta',
  holes: [
    {
      holeCoords: { latitude: 59.582875, longitude: 18.292865 },
      teeCoords: { latitude: 59.582843, longitude: 18.297886 },
      par: 4,
    },
    {
      holeCoords: { latitude: 59.58045, longitude: 18.286678 },
      teeCoords: { latitude: 59.582865, longitude: 18.290975 },
      par: 5,
    },
    {
      holeCoords: { latitude: 59.582523, longitude: 18.292028 },
      teeCoords: { latitude: 59.580322, longitude: 18.287774 },
      par: 3,
    },
  ],
};

export default function ScoreScreen() {
  const router = useRouter();
  const [currentHole, setCurrentHole] = useState(0);
  const [scores, setScores] = useState<number[]>(Array(courseObject.holes.length).fill(0));

  const handleScoreChange = (value: string) => {
    const updated = [...scores];
    updated[currentHole] = parseInt(value) || 0;
    setScores(updated);
  };

  const nextHole = () => {
    if (currentHole + 1 >= courseObject.holes.length) {
      router.push({
        pathname: '/(tabs)/summary',
        params: { scores: JSON.stringify(scores) },
      });
    } else {
      setCurrentHole((prev) => prev + 1);
    }
  };

  const currentScore = scores[currentHole];
  const hole = courseObject.holes[currentHole];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{courseObject.name}</ThemedText>
      <ThemedText type="subtitle">Hål {currentHole + 1} • Par {hole.par}</ThemedText>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Slag"
        value={currentScore.toString()}
        onChangeText={handleScoreChange}
      />

      <Button title={currentHole + 1 === courseObject.holes.length ? 'Avsluta rundan' : 'Nästa hål'} onPress={nextHole} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
    borderRadius: 4,
  },
});
