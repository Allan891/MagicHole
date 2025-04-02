import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRound } from './RoundContext';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ScoreOverview() {
  const { playerScores, courseName, courseObject } = useRound();

  const holes = [...courseObject.holes];
  while (holes.length < 18) {
    holes.push({
      teeCoords: { latitude: 0, longitude: 0 },
      holeCoords: { latitude: 0, longitude: 0 },
      par: undefined,
    });
  }

  
  const scores = [...playerScores];
  while (scores.length < 18) {
    scores.push(undefined);
  }

  
  const holeLengths = holes.map(hole => {
    const { teeCoords, holeCoords } = hole;
    if (teeCoords.latitude === 0 || holeCoords.latitude === 0) return undefined;
    return Math.round(
      calculateDistance(
        teeCoords.latitude,
        teeCoords.longitude,
        holeCoords.latitude,
        holeCoords.longitude
      )
    );
  });

  const totalStrokes = scores.reduce((sum, val) => sum + (val || 0), 0);
  const totalPar = holes.reduce((sum, h) => sum + (h.par || 0), 0);
  const totalLength = holeLengths.reduce((sum, len) => sum + (len || 0), 0);
  const diff = totalStrokes - totalPar;

  const getScoreStyle = (overPar: number) => {
    if (overPar === 1) return styles.bogey;
    if (overPar === 2) return styles.doubleBogey;
    if (overPar === -1) return styles.birdie;
    if (overPar === -2) return styles.eagle;
    return {};
  };

  const renderRow = (index: number) => {
    const hole = holes[index];
    const strokes = scores[index];
    const par = hole.par ?? '-';
    const length = holeLengths[index] ? `${holeLengths[index]} m` : '-';
    const overPar =
      typeof strokes === 'number' && typeof hole.par === 'number'
        ? strokes - hole.par
        : null;

    return (
      <View key={index} style={styles.row}>
        <ThemedText style={styles.cell}>{index + 1}</ThemedText>
        <ThemedText style={styles.cell}>{par}</ThemedText>
        <ThemedText style={styles.cell}>{length}</ThemedText>
        <View style={[styles.cell, getScoreStyle(overPar ?? 999)]}>
  <ThemedText style={{ color: 'black' }}>{strokes ?? '-'}</ThemedText>
</View>

        <ThemedText style={styles.cell}>
          {overPar === null ? '-' : overPar === 0 ? 'E' : overPar > 0 ? `+${overPar}` : overPar}
        </ThemedText>
      </View>
    );
  };

  const subtotal = (from: number, to: number) => {
    const subStrokes = scores.slice(from, to).reduce((sum, val) => sum + (val || 0), 0);
    const subPar = holes.slice(from, to).reduce((sum, h) => sum + (h.par || 0), 0);
    const subLength = holeLengths.slice(from, to).reduce((sum, len) => sum + (len || 0), 0);
    const subDiff = subStrokes - subPar;

    return (
      <View style={[styles.row, styles.subtotal]}>
        <ThemedText style={styles.cell}>Subtotal</ThemedText>
        <ThemedText style={styles.cell}>{subPar}</ThemedText>
        <ThemedText style={styles.cell}>{subLength} m</ThemedText>
        <ThemedText style={styles.cell}>{subStrokes}</ThemedText>
        <ThemedText style={styles.cell}>
          {subDiff === 0 ? 'E' : subDiff > 0 ? `+${subDiff}` : subDiff}
        </ThemedText>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: 'white' }]}>

      <ThemedText type="title" style={{ color: 'black' }}>
                    {courseName} – Scorecard
      </ThemedText>

        <View style={styles.row}>
          <ThemedText style={styles.headerCell}>Hole</ThemedText>
          <ThemedText style={styles.headerCell}>Par</ThemedText>
          <ThemedText style={styles.headerCell}>Length</ThemedText>
          <ThemedText style={styles.headerCell}>Strokes</ThemedText>
          <ThemedText style={styles.headerCell}>±</ThemedText>
        </View>
        <ThemedText style={styles.sectionTitle}>Front Nine</ThemedText>
        {Array.from({ length: 9 }, (_, i) => renderRow(i))}
        {subtotal(0, 9)}

        <ThemedText style={styles.sectionTitle}>Back Nine</ThemedText>
        {Array.from({ length: 9 }, (_, i) => renderRow(i + 9))}
        {subtotal(9, 18)}

        
        <View style={[styles.row, styles.total]}>
          <ThemedText style={styles.cell}>Total</ThemedText>
          <ThemedText style={styles.cell}>{totalPar}</ThemedText>
          <ThemedText style={styles.cell}>{totalLength} m</ThemedText>
          <ThemedText style={styles.cell}>{totalStrokes}</ThemedText>
          <ThemedText style={styles.cell}>
            {diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff}
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    color: 'black',
    },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerCell: {
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'center',
    color: 'black',
  },
  cell: {
    width: '20%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },  
  subtotal: {
    backgroundColor: '#eee',
    marginTop: 6,
    paddingVertical: 4,
  },
  total: {
    marginTop: 20,
    backgroundColor: '#ddd',
    paddingVertical: 6,
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
});
