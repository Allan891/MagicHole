import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  constructor() {
    this.initDb();
  }

  // Initialize the database and create tables
  private async initDb() {
    this.db = await SQLite.openDatabaseAsync('golfApp');
    console.log('Database opened');
    await this.db.execAsync(`CREATE TABLE IF NOT EXISTS Course (
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
    
    CREATE TABLE IF NOT EXISTS player (
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
      FOREIGN KEY (playerId) REFERENCES player (id),
      FOREIGN KEY (courseId) REFERENCES Course (id));
    
    CREATE TABLE IF NOT EXISTS Stroke (
      holeId INTEGER NOT NULL,
      roundId INTEGER NOT NULL,
      startLatitude REAL,
      startLongitude REAL,
      endLatitude REAL,
      endLongitude REAL,
      golfClubId INTEGER NOT NULL,
      playerId INTEGER NOT NULL,
      PRIMARY KEY (holeId, roundId),
      FOREIGN KEY (holeId) REFERENCES Hole (id),
      FOREIGN KEY (roundId) REFERENCES Round (id),
      FOREIGN KEY (playerId) REFERENCES player (id),
      FOREIGN KEY (golfClubId) REFERENCES GolfClub (id));
      
    CREATE TABLE IF NOT EXISTS TeeSlope (
      id TEXT NOT NULL,
      courseId INTEGER NOT NULL,
      slopeMale INT NOT NULL,
      slopeFemale INT NOT NULL,
      courseRatingMale REAL NOT NULL,
      courseRatingFemale REAL NOT NULL,
      PRIMARY KEY (id, courseId),
      FOREIGN KEY (courseId) REFERENCES Course (id));
    `);
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
  async updateCourse(id: number, name: string, coordinateX: number, coordinateY: number, active: number, date: string) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'UPDATE Course SET name = ?, coordinateX = ?, coordinateY = ?, active = ?, date = ? WHERE id = ?;',
        name, coordinateX, coordinateY, active, date, id
      );
      console.log('Course updated');
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }

  // DELETE: Delete a course
  async deleteCourse(id: number) {
    if (!this.db) return;
    try {
      await this.db.runAsync('DELETE FROM Course WHERE id = ?;', id);
      console.log('Course deleted');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }
}
//#endregion
export const db =  new Database();
