import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';

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
      distance INTEGER,
      strokesGained REAL,
      lye INTEGER,
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
  //#endregion
  



  //#region CRUD Operations for Course Table
  // CREATE: Add a new course to the database
  async createCourse(course: Course) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'INSERT INTO Course (name, longitude, latitude, active, dateAdded) VALUES (?, ?, ?, ?, ?);',
        course.name, course.longitude, course.latitude, course.active, course.dateAdded);
      console.log('Course created');
    } catch (error) {
      console.error('Error creating course:', error);
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



//#region CRUD Operations for Player Table
  // CREATE: Add a new player to the database
  async createPlayer(player: Player) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'INSERT INTO Player (handicap) VALUES (?);',
        player.handicap);
      console.log('Player created');
    } catch (error) {
      console.error('Error creating player:', error);
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
  async createGolfClub(golfClub: GolfClub) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'INSERT INTO GolfClub (playerId, name, showInList) VALUES (?, ?, ?);',
        golfClub.playerId, golfClub.name, golfClub.showInList);
      console.log('Golf club created');
    } catch (error) {
      console.error('Error creating golf club:', error);
    }
  }

  // UPDATE: Update a golf club
  async updateGolfClub(golfClub: GolfClub) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'UPDATE GolfClub SET playerId = ?, name = "?", showInList = ? WHERE id = ?;',
        golfClub.playerId, golfClub.name, golfClub.showInList, golfClub.id);
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

  // READ: Get a golf club by ID
  async getGolfClubsById(id: number): Promise<GolfClub | null> {
    if (!this.db) return null;
    try {
      return await this.db.getFirstAsync<GolfClub>('SELECT * FROM GolfClub WHERE id = ?;', id);
    } catch (error) {
      console.error('Error fetching golf club:', error);
      return null;
    }
  }

//#endregion


//#region CRUD Operations for Hole Table
  // CREATE: Add a new stroke to the database
  async createHole(hole: Hole) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'INSERT INTO Hole (holeNr, backTeeLongitude, backTeeLatitude, flagLongitude, flagLatitude, courseId) VALUES (?, ?, ?, ?, ?, ?);',
        hole.holeNr, hole.backTeeLongitude, hole.backTeeLatitude, hole.flagLongitude, hole.flagLatitude, hole.courseId);
      console.log('Hole created');
    } catch (error) {
      console.error('Error creating hole:', error);
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
      return await this.db.getFirstAsync<Hole>('SELECT * FROM Stroke WHERE id = ?;', id);
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
        `SELECT Hole.* FROM Round 
        INNER JOIN Hole ON  Hole.courseId = Round.courseId 
        WHERE Round.id = ?;`, roundId
      );
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



//#region CRUD Operations for Stroke Table
  // CREATE: Add a new stroke to the database
  async createStroke(stroke: Stroke) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'INSERT INTO Stroke (holeId, roundId, strokeNr, startLatitude, startLongitude, distance, strokesGained, lye, golfClubId, playerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        stroke.holeId, stroke.roundId, stroke.strokeNr, stroke.startLatitude, stroke.startLongitude, stroke.distance, stroke.strokesGained, stroke.lye, stroke.golfClubId, stroke.playerId);
      console.log('Stroke created');
    } catch (error) {
      console.error('Error creating stroke:', error);
    }
  }

  // UPDATE: Update a stroke
  async updateStroke(stroke: Stroke) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `UPDATE Stroke 
         SET startLatitude = ?, startLongitude = ?, distance = ?, strokesGained = ?, lye = ?, golfClubId = ?, playerId = ? 
         WHERE holeId = ? AND roundId = ? AND strokeNr = ?;`,
        stroke.startLatitude, stroke.startLongitude, stroke.distance, stroke.strokesGained, stroke.lye, stroke.golfClubId, stroke.playerId,
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
//#endregion

}export default new Database();
