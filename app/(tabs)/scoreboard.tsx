
import { View, ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const samplePlayers = [
  { name: 'Andreas', scores: [1, 5, 3, 4, 4, 5, 6, 3, 4] },
  { name: 'Harry', scores: [3, 4, 4, 4, 5, 3, 4, 4, 5] },
];

export default function ScoreboardScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Scoreboard</ThemedText>

        
        <View style={styles.row}>
          <ThemedText style={styles.cell}>Spelare</ThemedText>
          {Array.from({ length: 18 }, (_, i) => (
            <ThemedText key={i} style={styles.cell}>Hole{i + 1}</ThemedText>
          ))}
          <ThemedText style={styles.cell}>Totalt</ThemedText>
        </View>

        
        {samplePlayers.map((player, idx) => {
          const total = player.scores.reduce((sum, val) => sum + val, 0);
          return (
            <View style={styles.row} key={idx}>
              <ThemedText style={styles.cell}>{player.name}</ThemedText>
              {player.scores.map((score, i) => (
                <ThemedText key={i} style={styles.cell}>{score}</ThemedText>
              ))}
              <ThemedText style={styles.cell}>{total}</ThemedText>
            </View>
          );
        })}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
    marginBottom: 8,
  },
  cell: {
    width: 40,
    textAlign: 'center',
  },
});
