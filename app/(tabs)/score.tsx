import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRound } from './RoundContext';

export default function ScoreOverview() {
  const { playerScores, courseName, holeCount, courseObject } = useRound();

  const totalStrokes = playerScores.reduce((sum, val) => sum + (val || 0), 0);
  const parTotal = courseObject.holes.reduce((sum, h) => sum + (h.par || 0), 0);
  const diff = totalStrokes - parTotal;

  const getScoreStyle = (overPar: number) => {
    if (overPar === 1) return styles.bogey;
    if (overPar === 2) return styles.doubleBogey;
    if (overPar === -1) return styles.birdie;
    if (overPar === -2) return styles.eagle;
    if (overPar === 0) return styles.par;
    return {};
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{courseName} – Scorekort</ThemedText>

        
        <View style={styles.row}>
          <ThemedText style={styles.headerCell}>Hål</ThemedText>
          <ThemedText style={styles.headerCell}>Par</ThemedText>
          <ThemedText style={styles.headerCell}>Slag</ThemedText>
          <ThemedText style={styles.headerCell}>±</ThemedText>
        </View>

        
        {courseObject.holes.map((hole, index) => {
          const strokes = playerScores[index];
          const overPar = (strokes ?? 0) - (hole.par ?? 0);

          return (
            <View key={index} style={styles.row}>
              <ThemedText style={styles.cell}>{index + 1}</ThemedText>
              <ThemedText style={styles.cell}>{hole.par}</ThemedText>
              <View style={[styles.cell, getScoreStyle(overPar)]}>
                <ThemedText>{strokes ?? '-'}</ThemedText>
              </View>
              <ThemedText style={styles.cell}>
                {strokes === undefined ? '-' : overPar === 0 ? 'E' : overPar > 0 ? `+${overPar}` : overPar}
              </ThemedText>
            </View>
          );
        })}

        {/* Total Row */}
        <View style={[styles.row, { marginTop: 16 }]}>
          <ThemedText style={styles.cell}>Totalt</ThemedText>
          <ThemedText style={styles.cell}>{parTotal}</ThemedText>
          <ThemedText style={styles.cell}>{totalStrokes}</ThemedText>
          <ThemedText style={styles.cell}>
            {diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff}
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerCell: {
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },
  cell: {
    width: '25%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bogey: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: 2,
  },
  doubleBogey: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 4,
    padding: 2,
  },
  birdie: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 999,
    padding: 2,
  },
  eagle: {
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 999,
    padding: 2,
  },
  par: {
    borderWidth: 2,
    backgroundColor: 'black',
    borderRadius: 2,
    padding: 2,
  },
});
