import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';
import coursesJson  from "../../constants/courses";
import type { Course } from './GolfDatabaseTypes';
import type { Hole } from './GolfDatabaseTypes';
import type { Player } from './GolfDatabaseTypes';
import type { GolfClub } from './GolfDatabaseTypes';
import type { Round } from './GolfDatabaseTypes';
import type { Stroke } from './GolfDatabaseTypes';
import type { TeeSlope } from './GolfDatabaseTypes';
import Fetchinfo
import { G } from 'react-native-svg';
class Database {

//#region Define the database schema
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized: boolean = false;
  constructor() {
    console.log('Database constructor called');
    this.db = SQLite.openDatabaseSync("mh.db", { useNewConnection: true });
    console.log('DB ', this.db);
    console.log('Database object created');
  }
//#endregion



//#region Initialize the database and create tables
  public initDb() {
    if (this.isInitialized) return;
    console.log('Database opened');
    this.db.execSync(`
    -- DROP TABLE IF EXISTS Course;
    -- DROP TABLE IF EXISTS Hole;
    -- DROP TABLE IF EXISTS Player;
    -- DROP TABLE IF EXISTS GolfClub;
    -- DROP TABLE IF EXISTS Round;
    -- DROP TABLE IF EXISTS Stroke;
    -- DROP TABLE IF EXISTS TeeSlope;

    CREATE TABLE IF NOT EXISTS Course (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      longitude REAL NOT NULL,
      latitude REAL NOT NULL,
      active INTEGER NOT NULL,
      dateAdded TEXT NOT NULL);

    CREATE TABLE IF NOT EXISTS Hole (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      holeNr INTEGER NOT NULL,
      backTeeLongitude REAL NOT NULL,
      backTeeLatitude REAL NOT NULL,
      flagLongitude REAL NOT NULL,
      flagLatitude REAL NOT NULL,
      courseId INTEGER NOT NULL,
      par INTEGER NOT NULL,
      FOREIGN KEY (courseId) REFERENCES Course (id));

    CREATE TABLE IF NOT EXISTS Player (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      handicap REAL NOT NULL);

    CREATE TABLE IF NOT EXISTS GolfClub (
      id INTEGER PRIMARY KEY NOT NULL,
      playerId INTEGER NOT NULL,
      name TEXT,
      type TEXT,
      iconType TEXT,
      showInList INTEGER NOT NULL,
      FOREIGN KEY (playerId) REFERENCES player (id));

    CREATE TABLE IF NOT EXISTS Round (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      time INTEGER NOT NULL,
      playerId INTEGER NOT NULL,
      courseId INTEGER NOT NULL,
      handicap INTEGER NOT NULL,
      -- FOREIGN KEY (playerId) REFERENCES Player (id),
      FOREIGN KEY (courseId) REFERENCES Course (id));

    CREATE TABLE IF NOT EXISTS Stroke (
      holeId INTEGER NOT NULL,
      roundId INTEGER NOT NULL,
      strokeNr INTEGER NOT NULL,
      startLatitude REAL,
      startLongitude REAL,
      distance INTEGER,
      distanceLeft INTEGER,
      strokesGained REAL,
      lie INTEGER,
      golfClubId INTEGER NOT NULL,
      playerId INTEGER NOT NULL,
      PRIMARY KEY (holeId, roundId, strokeNr),
      FOREIGN KEY (holeId) REFERENCES Hole (id),
      FOREIGN KEY (roundId) REFERENCES Round (id)
      -- FOREIGN KEY (playerId) REFERENCES Player (id),
      -- FOREIGN KEY (golfClubId) REFERENCES GolfClub (id)
      );

    CREATE TABLE IF NOT EXISTS TeeSlope (
      id TEXT NOT NULL,
      courseId INTEGER NOT NULL,
      slopeMale INTEGER NOT NULL,
      slopeFemale INTEGER NOT NULL,
      courseRatingMale REAL NOT NULL,
      courseRatingFemale REAL NOT NULL,
      PRIMARY KEY (id, courseId),
      FOREIGN KEY (courseId) REFERENCES Course (id));

    CREATE TABLE IF NOT EXISTS Settings (
      setting TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (setting));

    `);
    this.db.importGolfClubs();
    this.isInitialized = true;
    console.log('Database created');
  }
//#endregion
  


//#region CRUD Operations for Course Table
  // CREATE: Add a new course to the database
  createCourse(course: Course): number {
    if (!this.db) return -1;
    try {
      this.db.runSync(
        'INSERT INTO Course (name, longitude, latitude, active, dateAdded) VALUES (?, ?, ?, ?, ?);',
        course.name, course.longitude, course.latitude, course.active, course.dateAdded);       // Fetch the last inserted row ID
      const result = this.db.getFirstSync("SELECT last_insert_rowid() AS id;");
      console.log('Course created with ID:', result?.id);
      return result?.id ?? -2;
    } catch (error) {
      console.error('Error creating course:', error);
      return -3;
    }
  }

  // UPDATE: Update a course
  async updateCourse(course: Course) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'UPDATE Course SET name = "?", longitude = ?, latitude = ?, active = ?, dateAdded = ? WHERE id = ?;',
        course.name, course.longitude, course.latitude, course.active, course.dateAdded, course.id);
      console.log('Course updated');
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }
  // DELETE: Delete a course
  async deleteCourse(course: Course) {
    if (!this.db) return;
    try {
      await this.db.runAsync('DELETE FROM Course WHERE id = ?;', course.id);
      console.log('Course deleted');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }
  
    // READ: Get all courses
  async getAllCourses(): Promise<Course[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync('SELECT * FROM Course;');
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  // READ: Get a course by ID
  async getCourseById(id: number): Promise<Course | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<Course>('SELECT * FROM Course WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return null;
    }
  }

//#endregion



//#region CRUD Operations for Settings
  // Settings
  async setSetting(setting: string, value: string) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'REPLACE INTO Settings (setting, value) VALUES (?, ?);',
        setting, value);
      console.log('Setting updated');
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  }

  async getSettings(): Promise<[]> {
    if (!this.db) return [];
    try {
      const settings = await this.db.getAllAsync(
        'SELECT * FROM Settings;');
        const output = settings.reduce((acc, { setting, value }) => {
          acc[setting] = value
          return acc;
        }, {});          
        return output;
      
    } catch (error) {
      console.error('Error getting settings:', error);
      return [];
    }
  }
//#endregion
 


//#region CRUD Operations for Hole Table
  // CREATE: Add a new hole to the database
  async createHole(hole: Hole): Promise<number> {
    if (!this.db) return -1;
    try {
      await this.db.runAsync(
        'INSERT INTO Hole (holeNr, backTeeLongitude, backTeeLatitude, flagLongitude, flagLatitude, courseId, par) VALUES (?, ?, ?, ?, ?, ?, ?);',
        hole.holeNr, hole.backTeeLongitude, hole.backTeeLatitude, hole.flagLongitude, hole.flagLatitude, hole.courseId, hole.par);
      const result = await this.db.getFirstAsync("SELECT last_insert_rowid() AS id;");
      console.log('Hole created with ID:', result?.id);
      return result?.id ?? -2;
    } catch (error) {
      console.error('Error creating hole:', error);
      return -3;
    }
  }

  // UPDATE: Update a hole
  async updateHole(hole: Hole) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `UPDATE Hole 
         SET holeNr = ?, backTeeLongitude = ?, backTeeLatitude = ?, flagLongitude = ?, flagLatitude = ?, courseId = ?
         WHERE id = ?;`,
        hole.holeNr, hole.backTeeLongitude, hole.backTeeLatitude, hole.flagLongitude, hole.flagLatitude, hole.courseId, hole.id);
      console.log('Hole updated');
    } catch (error) {
      console.error('Error updating hole:', error);
    }
  }

  // DELETE: Delete a hole
  async deleteHole(id: number) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'DELETE FROM Hole WHERE id = ?;',
        id);
      console.log('Hole deleted');
    } catch (error) {
      console.error('Error deleting hole:', error);
    }
  }
  
  // READ: Get all holes
  async getHoles(): Promise<Hole[]> {
    if (!this.db) return [];
    try {
      const allRows: Hole[] = await this.db.getAllAsync('SELECT * FROM Hole;');
      return allRows;
    } catch (error) {
      console.error('Error fetching holes:', error);
      return [];
    }
  }

  // READ: Get a hole by ID
  async getHoleById(id: number): Promise<Hole | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<Hole>('SELECT * FROM Hole WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching hole:', error);
      return null;
    }
  }

  // READ: Get all holes for a round
  async getHolesByRoundId(roundId: number): Promise<Hole[]> {
    if (!this.db) return [];
    try {
      const allRows: Hole[] = await this.db.getAllAsync(
        `SELECT * FROM Round 
        LEFT JOIN Hole ON  Hole.courseId = Round.courseId 
        WHERE Round.id = ?;`, roundId);
      return allRows;
    } catch (error) {
      console.error('Error fetching holes:', error);
      return [];
    }
  }

  // READ: Get all holes for a course
  async getHolesByCourseId(courseId: number): Promise<Hole[]> {
    if (!this.db) return [];
    try {
      const allRows: Hole[] = await this.db.getAllAsync('SELECT * FROM Hole WHERE courseId = ?;', courseId);
      return allRows;
    } catch (error) {
      console.error('Error fetching holes by course:', error);
      return [];
    }
  }
//#endregion



//#region CRUD Operations for Player Table
  // CREATE: Add a new player to the database
  async createPlayer(player: Player): Promise<number> {
    if (!this.db) return -1;
    try {
      await this.db.runAsync(
        'INSERT INTO Player (handicap) VALUES (?);',
        player.handicap);
      const result = await this.db.getFirstAsync("SELECT last_insert_rowid() AS id;");
      console.log('Player created with ID:', result?.id);
      return result?.id ?? -2;
    } catch (error) {
      console.error('Error creating player:', error);
      return -3;
    }
  }

  // UPDATE: Update a player
  async updatePlayer(player: Player) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `UPDATE Player
        SET handicap = ?
        WHERE id = ?`,
        player.handicap, player.id);
      console.log('Player updated');
    } catch (error) {
      console.error('Error updating player:', error);
    }
  }

  // DELETE: Delete a player
  async deletePlayer(player: Player) {
    if (!this.db) return;
    try {
      await this.db.runAsync('DELETE FROM Player WHERE id = ?;', player.id);
      console.log('Player deleted');
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  }

  // READ: Get a player by ID
  async getPlayerById(id: number): Promise<Player | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<Player>('SELECT * FROM Player WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching player:', error);
      return null;
    }
  }

  // READ: Get a player by handicap
  async getPlayerByHandicap(handicap: number): Promise<Player | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<Player>('SELECT * FROM Player WHERE handicap = ?;', handicap);
    } catch (error) {
      console.error('Error fetching player:', error);
      return null;
    }
  }
//#endregion



//#region CRUD Operations for GolfClub Table
  // CREATE: Add a new golf club to the database
  async createGolfClub(golfClub: GolfClub): Promise<number>  {
    if (!this.db) return -1;
    try {
      await this.db.runAsync(
        'INSERT INTO GolfClub (id, playerId, name, type, showInList) VALUES (?, ?, ?, ?, ?, ?);',
        golfClub.id, golfClub.playerId, golfClub.name, golfClub.type, golfClub.iconType, golfClub.showInList);
      const result = await this.db.getFirstAsync("SELECT last_insert_rowid() AS id;");
      console.log('Golf club created with ID:', result?.id);
      return result?.id ?? -2 //returns -2 if result.id is null or undefined
    } catch (error) {
      console.error('Error creating golf club:', error);
      return -3;
    }
  }
  
  // UPDATE: Update a golf club
  async updateGolfClub(golfClub: GolfClub) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'UPDATE GolfClub SET playerId = ?, name = ?, type = ?, iconType = ?, showInList = ? WHERE id = ?;',
        golfClub.playerId, golfClub.name, golfClub.type, golfClub.iconType, golfClub.showInList, golfClub.id);
      console.log('Golf club updated');
    } catch (error) {
      console.error('Error updating golf club:', error);
    }
  }


  // DELETE: Delete a golf club
  async deleteGolfClub(golfClub: GolfClub) {
    if (!this.db) return;
    try {
      await this.db.runAsync('DELETE FROM GolfClub WHERE id = ?;', golfClub.id);
      console.log('Golf club deleted');
    } catch (error) {
      console.error('Error deleting golf club:', error);
    }
  }
  
    // READ: Get all golf clubs by player
  async getAllGolfClubsByPlayer(playerId: number): Promise<GolfClub[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync('SELECT * FROM GolfClub WHERE playerId = ?;', playerId);
    } catch (error) {
      console.error('Error fetching golf clubs:', error);
      return [];
    }
  }

  // READ: Get golf clubs in list
  async getGolfClubsInList(): Promise<GolfClub[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync('SELECT * FROM GolfClub WHERE showInList = 1;');
    } catch (error) {
      console.error('Error fetching golf clubs:', error);
      return [];
    }
  }

  // READ: Get a golf club by ID
  async getGolfClubById(id: number): Promise<GolfClub | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<GolfClub>('SELECT * FROM GolfClub WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching golf club:', error);
      return null;
    }
  }

//#endregion



//#region CRUD Operations for Round Table
// CREATE: Add a new round to the database
async createRound(round: Round): Promise<number> {
  if (!this.db) return -1;
  try {
    await this.db.runAsync(
      'INSERT INTO Round (time, playerId, courseId, handicap) VALUES (?, ?, ?, ?);',
      round.time, round.playerId, round.courseId, round.handicap);
    const result = await this.db.getFirstAsync("SELECT last_insert_rowid() AS id;");
    console.log('Round created with ID', result?.id);
    return result?.id ?? -2
  } catch (error) {
    console.error('Error creating round:', error);
    return -3;
  }
}

// UPDATE: Update a round
async updateRound(round: Round) {
  if (!this.db) return;
  try {
    await this.db.runAsync(
      'UPDATE Round SET time = ?, playerId = ?, courseId = ?, handicap = ? WHERE id = ?;',
      round.time, round.playerId, round.courseId, round.handicap, round.id);
    console.log('Course updated');
  } catch (error) {
    console.error('Error updating round:', error);
  }
}

// DELETE: Delete a round
async deleteRound(id: number) {
  if (!this.db) return;
  try {
    await this.db.runAsync('DELETE FROM Round WHERE id = ?;', id);
    console.log('Round deleted');
  } catch (error) {
    console.error('Error deleting round:', error);
  }
}

  // READ: Get all rounds by player
async getAllRoundsByPlayer(playerId: number): Promise<Round[]> {
  if (!this.db) return [];
  try {
    return await this.db.getAllAsync('SELECT * FROM Round WHERE playerId = ?;', playerId);
  } catch (error) {
    console.error('Error fetching rounds:', error);
    return [];
  }
}

// READ: Get last rounds by player and specified number of rounds
async getLatestRoundsByPlayer(playerId: number, numberOfRounds: number): Promise<Round[]> {
  if (!this.db) return [];
  try {
    return await this.db.getAllAsync(
      `SELECT * FROM Round
      WHERE playerId = ?
      ORDER BY time DESC
      LIMIT ?;`, playerId, numberOfRounds);
  } catch (error) {
    console.error('Error fetching rounds:', error);
    return [];
  }
}

// READ: Get a round by ID
async getRoundById(id: number): Promise<Round | null> {
  if (!this.db) return null;
  try {
    return await this.db.getFirstAsync('SELECT * FROM Round WHERE id = ?;', id);
  } catch (error) {
    console.error('Error fetching round:', error);
    return null;
  }
}

//#endregion



//#region CRUD Operations for Stroke Table
  // CREATE: Add a new stroke to the database
  async createStroke(stroke: Stroke): Promise<number> {
    if (!this.db) return -1;
    try {
      await this.db.runAsync(
        'INSERT INTO Stroke (holeId, roundId, strokeNr, startLatitude, startLongitude, distance, distanceLeft, strokesGained, lie, golfClubId, playerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        stroke.holeId, stroke.roundId, stroke.strokeNr, stroke.startLatitude, stroke.startLongitude, stroke.distance, stroke.distanceLeft, stroke.strokesGained, stroke.lie, stroke.golfClubId, stroke.playerId);
      const result = await this.db.getFirstAsync("SELECT last_insert_rowid() AS id;");
      console.log('Stroke created with ID', result?.id);
      return result?.id ?? -2;
    } catch (error) {
      console.error('Error creating stroke:', error);
      return -3;
    }
  }

  // UPDATE: Update a stroke
  async updateStroke(stroke: Stroke) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `UPDATE Stroke 
         SET startLatitude = ?, startLongitude = ?, distance = ?, strokesGained = ?, lie = ?, golfClubId = ?, playerId = ? 
         WHERE holeId = ? AND roundId = ? AND strokeNr = ?;`,
        stroke.startLatitude, stroke.startLongitude, stroke.distance, stroke.strokesGained, stroke.lie, stroke.golfClubId, stroke.playerId,
        stroke.holeId, stroke.roundId, stroke.strokeNr);
      console.log('Stroke updated');
    } catch (error) {
      console.error('Error updating stroke:', error);
    }
  }

  // DELETE: Delete a stroke
  async deleteStroke(holeId: number, roundId: number, strokeNr: number) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'DELETE FROM Stroke WHERE holeId = ? AND roundId = ? AND strokeNr = ?;',
        holeId, roundId, strokeNr);
      console.log('Stroke deleted');
    } catch (error) {
      console.error('Error deleting stroke:', error);
    }
  }

  // READ: Get all strokes
  async getStrokes(): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM Stroke;');
    } catch (error) {
      console.error('Error fetching strokes:', error);
      return [];
    }
  }

  // READ: Get a stroke by ID
  async getStrokeById(id: number): Promise<Stroke | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<Stroke>(
        'SELECT * FROM Stroke WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching stroke:', error);
      return null;
    }
  }

  // READ: Get all strokes for a round
  async getStrokesByRoundId(roundId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM Stroke WHERE roundId = ?;', roundId);
    } catch (error) {
      console.error('Error fetching strokes by round:', error);
      return [];
    }
  }

  // READ: Get all strokes for a course
  async getStrokesByCourseId(courseId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync(
        `SELECT Stroke.* FROM Stroke
         INNER JOIN Hole ON Stroke.holeId = Hole.id
         WHERE Hole.courseId = ?;`,
        courseId);
    } catch (error) {
      console.error('Error fetching strokes by course:', error);
      return [];
    }
  }

  // READ: Get all strokes for a player
  async getStrokesByPlayerId(playerId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM Stroke WHERE playerId = ?;',playerId);
    } catch (error) {
      console.error('Error fetching strokes by player:', error);
      return [];
    }
  }

  // READ: Get all strokes for a golf club
  async getStrokesByGolfClubId(golfClubId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM Stroke WHERE golfClubId = ?;',golfClubId);
    } catch (error) {
      console.error('Error fetching strokes by golf club:', error);
      return [];
    }
  }

  // READ: Get all strokes for a golf club
  async getStrokesByStrokesGained(strokesGained: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM Stroke WHERE strokesGained = ?;',strokesGained);
    } catch (error) {
      console.error('Error fetching strokes by strokes gained:', error);
      return [];
    }
  }

  // READ: Get last stroke for a round and hole  
  async getLastStrokeByRoundAndHoleId(roundId: number, holeId: number): Promise<Stroke | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync(
        `SELECT * FROM Stroke
        WHERE roundId = ? AND holeId = ?
        ORDER BY strokeNr DESC;`,roundId, holeId);
    } catch (error) {
      console.error('Error fetching strokes by strokes gained:', error);
      return null;
    }
  }

  // READ: Count strokes per hole in a round
  async StrokeCountByRound (roundId: number): Promise<[]> {
    if (!this.db) return [];
    try {
      const allRows: [] = await this.db.getAllAsync(
        `SELECT holeId, COUNT(*) AS strokeCount
          FROM Stroke
          WHERE roundId = ?
          GROUP BY holeId;`, roundId);
      return allRows;
    } catch (error) {
      console.error('Error fetching holes:', error);
      return [];
    }
  }
//#endregion



//#region CRUD Operations for TeeSlope Table
  // CREATE: Add a new tee slope to the database
  async createTeeSlope(teeSlope: TeeSlope): Promise<number> {
    if (!this.db) return -1;
    try {
      await this.db.runSync(
        'INSERT INTO TeeSlope (id, courseId, slopeMale, slopeFemale, courseRatingMale, courseRatingFemale) VALUES (?, ?, ?, ?, ?, ?);',
        teeSlope.id, teeSlope.courseId, teeSlope.slopeMale, teeSlope.slopeFemale, teeSlope.courseRatingMale, teeSlope.courseRatingFemale);     
      const result = this.db.getFirstSync("SELECT last_insert_rowid() AS id;");   // Fetch the last inserted row ID
      console.log('Tee Slope created with ID:', result?.id);
      return result?.id ?? -2;
    } catch (error) {
      console.error('Error creating tee slope:', error);
      return -3;
    }
  }

  
  // UPDATE: Update a tee slope
  async updateTeeSlope(teeSlope: TeeSlope) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'UPDATE TeeSlope SET slopeMale = ?, slopeFemale = ?, courseRatingMale = ?, courseRatingFemale = ? WHERE courseId = ? AND id = ?;',
        teeSlope.slopeMale, teeSlope.slopeFemale, teeSlope.courseRatingMale, teeSlope.courseRatingFemale, teeSlope.courseId, teeSlope.id);
      console.log('Tee slope updated');
    } catch (error) {
      console.error('Error updating tee slope:', error);
    }
  }

  // DELETE: Delete a tee slope
  async deleteTeeSlope(teeSlope: TeeSlope) {
    if (!this.db) return;
    try {
      await this.db.runAsync('DELETE FROM TeeSlope WHERE id = ?;', teeSlope.id);
      console.log('Tee slope deleted');
    } catch (error) {
      console.error('Error deleting tee slope:', error);
    }
  }
  
    // READ: Get all tee slopes
  async getAllTeeSlopes(): Promise<TeeSlope[]> {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync('SELECT * FROM TeeSlope;');
    } catch (error) {
      console.error('Error fetching tee slopes:', error);
      return [];
    }
  }

  // READ: Get a tee slope by ID
  async getTeeSlopeById(id: number): Promise<TeeSlope | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<TeeSlope>('SELECT * FROM TeeSlope WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching tee slopes:', error);
      return null;
    }
  }
//#endregion



//#region import and get courses
importCourses = async () => {
    

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
      const insertedCourseId = this.createCourse(course);  
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
          par: courseData.par[index],
          backTeeLongitude: hole.teeBack.longitude,
          backTeeLatitude: hole.teeBack.latitude,
          flagLongitude: hole.greenMiddle.longitude,
          flagLatitude: hole.greenMiddle.latitude,
          courseId: insertedCourseId,
        };
        const insertedHoleId = await this.createHole(holeEntry);  
        console.log("Inserted Hole ID: ",insertedHoleId);
      });
    });
    return };

  getCourses = async () => {
    const allCourses: Course[] = await this.getAllCourses();
    const allHoles: Hole[] = await this.getHoles();
    console.log("Courses:");
    allCourses.forEach((course) => {
      console.log(`- ID: ${course.id}, Name: ${course.name}, Active: ${course.active}, Date Added: ${course.dateAdded}`);
    });
    console.log("Holes ",allHoles);
    allHoles.forEach((hole) => {
      console.log(`- ID: ${hole.id}, Nr: ${hole.holeNr}, Course: ${hole.courseId}, BackTLong: ${hole.backTeeLongitude}, BackTLat: ${hole.backTeeLatitude}, FlagLong: ${hole.flagLongitude}, FlagLat: ${hole.flagLatitude}, Par: ${hole.par}`);
    });
  }
//#endregion

//#region Statistics
async getApproachData(): Promise<[]> {
  if (!this.db) return [];
  try {
    const ptData = [
      {
        value: null,
        distance: 50,
        label: '50',
        labelTextStyle: {color: 'gray', width: 60},
      },
        {value: 1, distance: 53},
        {value: 2, distance: 52},
      
        {value: 4,distance: 55},
        {
          value: null,
          distance: 60,
          label: '60',
    
          labelTextStyle: {color: 'gray', width: 60},
        },
        {
          value: null,
          distance: 70,
          label: '70',
          labelTextStyle: {color: 'gray', width: 60},
        },
        {value: 4, distance: 72},
    
        {value: 1,  distance: 75},
        {value: 1,  distance: 77},
        {value: 1,  distance: 79},
        {
          value: null,
          distance: 80,
          label: '80',
          labelTextStyle: {color: 'gray', width: 60},
        },
        {value: 1,  distance: 81},
        {value: 1,  distance: 82},
        {value: -4, distance: 83},
        {
          value: null,
          distance: 90,
          label: '90',
          labelTextStyle: {color: 'gray', width: 60},
        },
        {value: 2, distance: 91},
        {value: 2, distance: 93},
        {value: 2, distance: 96},
        {value: 2, distance: 98},
        {value: 2, distance: 103},
      ];
    return ptData;
    const data = await this.db.getAllAsync(`
      SELECT*FROM Hole WHERE courseId IN (2,4);
      SELECT Course.id AS courseId, Course.name,
      Round.id AS 'roundID', 
      Stroke.startLatitude, Stroke.startLongitude,
      Hole.flagLongitude, Hole.flagLatitude
      FROM Stroke
      LEFT JOIN Round ON Stroke.roundId = Round.id
      LEFT JOIN Course ON Course.id = Round.courseId
      LEFT JOIN Hole ON Hole.holeNr = Stroke.holeId AND Course.id = Hole.courseId 
      ;`);
      console.log("Approach Data: ",data);
      data.forEach((item: any) => {
        console.log("============================================");
        Object.entries(item).forEach(([key, value]) => {
          
          console.log(`${key}: ${value}`);
        });
      });
      return data;
  } catch (error) {
    console.error('Error fetching tee slopes:', error);
    return [];
  }
}
async getTeeData(): Promise<[]> {
  if (!this.db) return [];
  try {
    const ptData = [
      {
        value: null,
        distance: 50,
        label: '50',
        labelTextStyle: {color: 'gray', width: 60},
      },
        {value: 4, distance: 53},
        {value: 4, distance: 53},
        {value: 4, distance: 53},
        {value: 3, distance: 53},
        {value: 3, distance: 53},
        {value: 3, distance: 53},
        {value: 2, distance: 52},
      
        {value: 2,distance: 55},
        {
          value: null,
          distance: 60,
          label: '60',
    
          labelTextStyle: {color: 'gray', width: 60},
        },
        {
          value: null,
          distance: 70,
          label: '70',
          labelTextStyle: {color: 'gray', width: 60},
        },
        {value: 2, distance: 72},
        {value: 2,  distance: 72},
        {value: 1,  distance: 72},
        {value: 1,  distance: 72},
        {value: 1,  distance: 72},
        {value: 0,  distance: 72},
        {value: 0,  distance: 72},
        {value: 0,  distance: 72},
        {value: 1,  distance: 72},
    
        {value: 1,  distance: 75},
        {value: 1,  distance: 77},
        {value: 2,  distance: 79},
        {
          value: 2,
          distance: 80,
          label: '80',
          labelTextStyle: {color: 'gray', width: 60},
        },
        {value: 2,  distance: 81},
        {value: 2,  distance: 81},
        {value: 3,  distance: 82},
        {value: 3,  distance: 82},
        {value: -2,  distance: 82},
        {value: -4, distance: 83},
        {
          value: null,
          distance: 90,
          label: '90',
          labelTextStyle: {color: 'gray', width: 60},
        },
        {value: 2, distance: 91},
        {value: 2, distance: 93},
        {value: 2, distance: 96},
        {value: 2, distance: 98},
        {value: 2, distance: 103},
      ];
    return ptData;
    const data = await this.db.getAllAsync(`
      SELECT*FROM Hole WHERE courseId IN (2,4);
      SELECT Course.id AS courseId, Course.name,
      Round.id AS 'roundID', 
      Stroke.startLatitude, Stroke.startLongitude,
      Hole.flagLongitude, Hole.flagLatitude
      FROM Stroke
      LEFT JOIN Round ON Stroke.roundId = Round.id
      LEFT JOIN Course ON Course.id = Round.courseId
      LEFT JOIN Hole ON Hole.holeNr = Stroke.holeId AND Course.id = Hole.courseId 
      ;`);
      console.log("Approach Data: ",data);
      data.forEach((item: any) => {
        console.log("============================================");
        Object.entries(item).forEach(([key, value]) => {
          
          console.log(`${key}: ${value}`);
        });
      });
      return data;
  } catch (error) {
    console.error('Error fetching tee slopes:', error);
    return [];
  }
}
//#endregion


}export default new Database();
