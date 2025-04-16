import { StyleSheet, View, ScrollView, Touchable, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import { useRound } from './RoundContext';
import { getCourse } from '@/utils';

export function Scorecard({strokes, courseId, handlePress}) {
//   const strokes = globalStateVar((state) => state.strokes);
//   const courseObject = globalStateVar((state) => state.selectedCourse);
    //console.log('scorie:', strokes, courseId)
  const courseObject = getCourse(courseId);
  if (!courseObject) {
    return <ThemedText>Loading course...</ThemedText>;
  }
  const totalStrokes = strokes.reduce((sum, val) => sum + (val ?? 0), 0);
  const parTotal = courseObject.par?.reduce((sum, p) => sum + (p ?? 0), 0) ?? 0;
  const diff = totalStrokes - parTotal;

  const hcp = 6; // mock handicap 

  const renderRow = (holeIndex: number) => {
    const par = courseObject.par?.[holeIndex] ?? 0;
    const si = courseObject.si?.[holeIndex] ?? 18;
    const score = strokes[holeIndex];

    const overPar = score !== undefined ? score - par : null;

    let stableford = 0;
    if (score !== undefined && par !== undefined && si !== undefined) {
      const basePoints = 2 + par - score;
      const strokesFromHcp = Math.floor(hcp / 18) + (hcp % 18 >= si ? 1 : 0);
      stableford = Math.max(basePoints + strokesFromHcp, 0);
    }

    let scoreStyle = styles.cell;
    if (overPar !== null) {
      if (overPar === -1) scoreStyle = [styles.cell, styles.birdie];
      else if (overPar === 1) scoreStyle = [styles.cell, styles.bogey];
      else if (overPar >= 2) scoreStyle = [styles.cell, styles.doubleBogey];
    }

    return (
        <TouchableOpacity onPress={() => handlePress(holeIndex)}>
            <View key={holeIndex} style={styles.row}>
                <ThemedText style={styles.cell}>{holeIndex + 1}</ThemedText>
                <ThemedText style={styles.cell}>{par}</ThemedText>
                <ThemedText style={scoreStyle}>{score ?? '-'}</ThemedText>
                <ThemedText style={styles.cell}>
                {score === undefined ? '-' : overPar === 0 ? 'E' : overPar > 0 ? `+${overPar}` : overPar}
                </ThemedText>
                <ThemedText style={styles.cell}>{stableford}</ThemedText>
            </View>
        </TouchableOpacity>
    );
  };

  return (

      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>{courseObject.namn}Scorecard</ThemedText>

        <View style={styles.row}>
          <ThemedText style={styles.header}>Hole</ThemedText>
          <ThemedText style={styles.header}>Par</ThemedText>
          <ThemedText style={styles.header}>Strokes</ThemedText>
          <ThemedText style={styles.header}>±</ThemedText>
          <ThemedText style={styles.header}>Pts</ThemedText>
        </View>

        <ThemedText style={styles.section}>Front 9</ThemedText>
        {courseObject.holes.slice(0, 9).map((_, i) => renderRow(i))}
        {courseObject.holes.length > 9 &&
          <ThemedText style={styles.section}>Back 9</ThemedText>
        }
        {courseObject.holes.slice(9, 18).map((_, i) => renderRow(i + 9))}

        <View style={[styles.row, { marginTop: 16 }]}>
          <ThemedText style={styles.cell}>Total</ThemedText>
          <ThemedText style={styles.cell}>{parTotal}</ThemedText>
          <ThemedText style={styles.cell}>{totalStrokes}</ThemedText>
          <ThemedText style={styles.cell}>
            {diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff}
          </ThemedText>
          <ThemedText style={styles.cell}>–</ThemedText>
        </View>
      </ThemedView>

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
    width: '20%',
    textAlign: 'center',
    color: 'black',
  },
  cell: {
    width: '20%',
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
