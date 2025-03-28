import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const courseObject = {
  name: 'Brollsta',
  holes: [
    { par: 4 },
    { par: 5 },
    { par: 3 },
  ],
};

export default function SummaryScreen() {
  const params = useLocalSearchParams();
  const scores: number[] = JSON.parse(params.scores as string);

  const total = scores.reduce((sum, val) => sum + val, 0);
  const parTotal = courseObject.holes.reduce((sum, h) => sum + h.par, 0);
  const diff = total - parTotal;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{courseObject.name} – Resultat</ThemedText>

      {scores.map((score, index) => {
        const par = courseObject.holes[index].par;
        const holeNumber = index + 1;
        const overPar = score - par;

        return (
          <View key={index} style={styles.row}>
            <ThemedText style={styles.cell}>Hål {holeNumber}</ThemedText>
            <ThemedText style={styles.cell}>Slag: {score}</ThemedText>
            <ThemedText style={styles.cell}>Par: {par}</ThemedText>
            <ThemedText style={styles.cell}>
              {overPar === 0 ? 'Par' : overPar > 0 ? `+${overPar}` : `${overPar}`}
            </ThemedText>
          </View>
        );
      })}

      <View style={styles.total}>
        <ThemedText type="subtitle">Totalt: {total} slag ({diff === 0 ? 'Par' : diff > 0 ? `+${diff}` : diff})</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: '25%',
    textAlign: 'center',
  },
  total: {
    marginTop: 24,
    alignItems: 'center',
  },
});
