import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globalStateVar } from '../state/globalStateVar';
import db from '../db/db';
import coursesJson  from "../../constants/courses";

export default function ScoreOverview() {

  const importCourses = async () => {
    

    const holes: Hole[] = [];
    console.log("Courses from JSON: ", coursesJson);
    coursesJson.forEach(async (courseData: any) => {
      // const courseId = Math.floor(Math.random() * 1000000); // Simulating DB ID
      const firstHole = courseData.holes[0];

      const course: Course = {
        id: -1,
        name: courseData.name,
        longitude: firstHole.teeBack.longitude,
        latitude: firstHole.teeBack.latitude,
        active: 1,
        dateAdded: new Date().toISOString(),
      };
      console.log("Inserting Course: ",course);
      const insertedCourseId = db.createCourse(course);  
      console.log("Inserted Course ID: ",insertedCourseId);
      if (insertedCourseId !== null) {
        console.log(`New course inserted with ID: ${insertedCourseId}`);
      } else {
        console.log("Failed to insert course.");
        return;
      }
      courseData.holes.forEach(async(hole: any, index: number) => {
        const holeEntry: Hole = {
          id: -1,
          holeNr: index + 1,
          backTeeLongitude: hole.teeBack.longitude,
          backTeeLatitude: hole.teeBack.latitude,
          flagLongitude: hole.greenMiddle.longitude,
          flagLatitude: hole.greenMiddle.latitude,
          courseId: insertedCourseId,
        };
        const insertedHoleId = await db.createHole(holeEntry);  
        console.log("Inserted Hole ID: ",insertedHoleId);
      });
    });
    return };

  const getCourses = async () => {
    const allCourses: Course[] = await db.getAllCourses();
    const allHoles: Hole[] = await db.getHoles();
    console.log("Courses:");
    allCourses.forEach((course) => {
      console.log(`- ID: ${course.id}, Name: ${course.name}, Active: ${course.active}, Date Added: ${course.dateAdded}`);
    });
    console.log("Holes ",allHoles);
    allHoles.forEach((hole) => {
      console.log(`- ID: ${hole.id}, Nr: ${hole.holeNr}, Course: ${hole.courseId}, BackTLong: ${hole.backTeeLongitude}, BackTLat: ${hole.backTeeLatitude}, FlagLong: ${hole.flagLongitude}, FlagLat: ${hole.flagLatitude}`);
    });
  }
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{"Settings"} – Actions</ThemedText>

      <View style={{ gap: 10 }}>
        <View style={styles.row}>
        <ThemedText style={styles.header}>Action</ThemedText>
        </View>

        {[
        { label: 'Import Courses & Holes', action: importCourses },
        { label: 'Reset Data', action: () => console.log('Reset Data') },
        { label: 'Get Courses & Holes', action: getCourses}
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
