import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import db from '../db/db';


export default function ScoreOverview() {
    return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{"Settings"} – Actions</ThemedText>

      <View style={{ gap: 10 }}>
        <View style={styles.row}>
        <ThemedText style={styles.header}>Action</ThemedText>
        </View>

        {[
        { label: 'Import Courses & Holes', action: db.importCourses },
        { label: 'Get Approach Data', action: () => {console.log('Get Approach'); db.getApproachData(); }},
        { label: 'Get Courses & Holes', action: db.getCourses}
        ].map((button, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <ThemedView
          style={{
            padding: 10,
            backgroundColor: 'blue',
            borderRadius: 5,
            alignItems: 'center',
          }}
          onTouchEnd={button.action}
          >
          <ThemedText style={{ color: 'white' }}>{button.label}</ThemedText>
          </ThemedView>
        </View>
        ))}
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
