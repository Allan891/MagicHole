import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from './globalStateVar';

const courseObject = {
  name: 'Brollsta',
  holes: [
    { par: 4 },
    { par: 5 },
    { par: 3 },
    { par: 4 }, { par: 4 }, { par: 5 }, { par: 3 }, { par: 4 }, { par: 4 }, // front 9
    { par: 5 }, { par: 4 }, { par: 3 }, { par: 4 }, { par: 4 }, { par: 5 }, { par: 3 }, { par: 4 }, { par: 4 }  // back 9
  ],
};

export default function ScoreOverview() {
  const strokes = globalStateVar((state) => state.strokes);

  const totalStrokes = strokes.reduce((sum, val) => sum + (val ?? 0), 0);
  const parTotal = courseObject.holes.reduce((sum, h) => sum + (h.par ?? 0), 0);
  const diff = totalStrokes - parTotal;

  const renderRow = (holeIndex: number) => {
    const par = courseObject.holes[holeIndex]?.par ?? '-';
    const score = strokes[holeIndex];
    const overPar = score !== undefined ? score - par : null;

    let scoreStyle = styles.cell;

    if (overPar !== null) {
      if (overPar === -1) scoreStyle = [styles.cell, styles.birdie];
      else if (overPar === 1) scoreStyle = [styles.cell, styles.bogey];
      else if (overPar >= 2) scoreStyle = [styles.cell, styles.doubleBogey];
    }

    return (
      <View key={holeIndex} style={styles.row}>
        <ThemedText style={styles.cell}>{holeIndex + 1}</ThemedText>
        <ThemedText style={styles.cell}>{par}</ThemedText>
        <ThemedText style={scoreStyle}>{score ?? '-'}</ThemedText>
        <ThemedText style={styles.cell}>
          {score === undefined ? '-' : overPar === 0 ? 'E' : overPar > 0 ? `+${overPar}` : overPar}
        </ThemedText>
      </View>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>{courseObject.name} – Scorecard</ThemedText>

        {/* Header Row */}
        <View style={styles.row}>
          <ThemedText style={styles.header}>Hole</ThemedText>
          <ThemedText style={styles.header}>Par</ThemedText>
          <ThemedText style={styles.header}>Strokes</ThemedText>
          <ThemedText style={styles.header}>±</ThemedText>
        </View>

        {/* Front 9 */}
        <ThemedText style={styles.section}>Front 9</ThemedText>
        {courseObject.holes.slice(0, 9).map((_, i) => renderRow(i))}

        {/* Back 9 */}
        <ThemedText style={styles.section}>Back 9</ThemedText>
        {courseObject.holes.slice(9, 18).map((_, i) => renderRow(i + 9))}

        {/* Total Row */}
        <View style={[styles.row, { marginTop: 16 }]}>
          <ThemedText style={styles.cell}>Total</ThemedText>
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
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  section: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  header: {
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
    color: 'black',
  },
  cell: {
    width: '25%',
    textAlign: 'center',
    color: 'black',
  },
  birdie: {
    borderWidth: 1,
    borderColor: 'blue',
    color: 'black',
    borderRadius: 4,
  },
  bogey: {
    borderWidth: 1,
    borderColor: 'orange',
    color: 'black',
    borderRadius: 4,
  },
  doubleBogey: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'black',
    borderRadius: 4,
  },
});
