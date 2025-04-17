import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import { useRound } from './RoundContext';
import { Scorecard } from '@/components/Scorecard';

export default function ScoreOverview() {
  const strokes = globalStateVar((state) => state.strokes);
  const courseObject = globalStateVar((state) => state.selectedCourse);
  const currentHole = globalStateVar((state) => state.currentHole);
  const setCurrentHole = globalStateVar((state) => state.setCurrentHole);
  const courseId = courseObject.id;
  

    return (
      <ScrollView style={styles.container}>
        <Scorecard handlePress={setCurrentHole} strokes={strokes} courseId={courseId} />
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    backgroundColor: 'white',
    flex: 1
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
