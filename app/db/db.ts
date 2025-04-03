import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized: boolean = false;
  constructor() {
    console.log('Database constructor called');
    this.db = SQLite.openDatabaseSync("mh.db", { useNewConnection: true });
    console.log('DB ', this.db);
    console.log('Database object created');
  }

  // Initialize the database and create tables
  public initDb() {
    if (this.isInitialized) return;
    console.log('Database opened');
    this.db.execSync(`
    DROP TABLE IF EXISTS Course;
    DROP TABLE IF EXISTS Hole;
    DROP TABLE IF EXISTS Player;
    DROP TABLE IF EXISTS GolfClub;
    DROP TABLE IF EXISTS Round;
    DROP TABLE IF EXISTS Stroke;
    DROP TABLE IF EXISTS TeeSlope;

    CREATE TABLE IF NOT EXISTS Course (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      coordinateX REAL NOT NULL,
      coordinateY REAL NOT NULL,
      active INTEGER NOT NULL,
      createDate TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS Hole (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      holeNr INTEGER NOT NULL,
      backTeeLongitude REAL NOT NULL,
      backTeeLatitude REAL NOT NULL,
      flagLongitude REAL NOT NULL,
      flagLatitude REAL NOT NULL,
      courseId INTEGER NOT NULL,
      FOREIGN KEY (courseId) REFERENCES Course (id));
    CREATE TABLE IF NOT EXISTS Player (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      handicap REAL NOT NULL);
    CREATE TABLE IF NOT EXISTS GolfClub (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      playerId INTEGER NOT NULL,
      name TEXT,
      showInList INTEGER NOT NULL,
      FOREIGN KEY (playerId) REFERENCES player (id));
    CREATE TABLE IF NOT EXISTS Round (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      time TEXT NOT NULL,
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
      distance REAL,
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
    `);
    this.isInitialized = true;
    console.log('Database created');
  }

  //#region CRUD Operations for Course Table
  // CREATE: Add a new course to the database
  async createCourse(course: Course) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'INSERT INTO Course (name, coordinateX, coordinateY, active, createDate) VALUES (?, ?, ?, ?, ?);',
        course.name, course.coordinateX, course.coordinateY, course.active, course.createDate);
      console.log('Course created');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  }
    // READ: Get a course by ID
  async getAllCourses(): Promise<Course[]> {
    if (!this.db) return [];
    try {
      const allRows: Course[] = await this.db.getAllAsync('SELECT * FROM Course;');
      return allRows;
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

  // UPDATE: Update a course
  async updateCourse(course: Course) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'UPDATE Course SET name = ?, coordinateX = ?, coordinateY = ?, active = ?, createDate = ? WHERE id = ?;',
        course.name, course.coordinateX, course.coordinateY, course.active, course.createDate, course.id);
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

//#endregion

//#region CRUD Operations for Stroke Table
  // CREATE: Add a new stroke to the database
  async createStroke(stroke: Stroke) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'INSERT INTO Stroke (holeId, roundId, strokeNr, startLatitude, startLongitude, distance, golfClubId, playerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        stroke.holeId, stroke.roundId, stroke.strokeNr, stroke.startLatitude, stroke.startLongitude, stroke.distance, stroke.golfClubId, stroke.playerId);
      console.log('Stroke created');
    } catch (error) {
      console.error('Error creating stroke:', error);
    }
  }

  
  // READ: Get all strokes
  async getStrokes(): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      const allRows: Stroke[] = await this.db.getAllAsync('SELECT * FROM Stroke;');
      return allRows;
    } catch (error) {
      console.error('Error fetching strokes:', error);
      return [];
    }
  }

  // READ: Get a stroke by ID
  async getStrokeById(id: number): Promise<Stroke | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<Stroke>('SELECT * FROM Stroke WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching stroke:', error);
      return null;
    }
  }

  // READ: Get all strokes for a round
  async getStrokesByRoundId(roundId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      const allRows: Stroke[] = await this.db.getAllAsync('SELECT * FROM Stroke WHERE roundId = ?;', roundId);
      return allRows;
    } catch (error) {
      console.error('Error fetching strokes:', error);
      return [];
    }
  }

  // READ: Get all strokes for a course
  async getStrokesByCourseId(courseId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      const allRows: Stroke[] = await this.db.getAllAsync(
        `SELECT Stroke.* FROM Stroke
         INNER JOIN Hole ON Stroke.holeId = Hole.id
         WHERE Hole.courseId = ?;`,
        courseId
      );
      return allRows;
    } catch (error) {
      console.error('Error fetching strokes by course:', error);
      return [];
    }
  }

  // READ: Get all strokes for a player
  async getStrokesByPlayerId(playerId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      const allRows: Stroke[] = await this.db.getAllAsync(
        'SELECT * FROM Stroke WHERE playerId = ?;',
        playerId
      );
      return allRows;
    } catch (error) {
      console.error('Error fetching strokes by player:', error);
      return [];
    }
  }

  // READ: Get all strokes for a golf club
  async getStrokesByGolfClubId(golfClubId: number): Promise<Stroke[]> {
    if (!this.db) return [];
    try {
      const allRows: Stroke[] = await this.db.getAllAsync(
        'SELECT * FROM Stroke WHERE golfClubId = ?;',
        golfClubId
      );
      return allRows;
    } catch (error) {
      console.error('Error fetching strokes by golf club:', error);
      return [];
    }
  }
//#endregion



}export default new Database();
