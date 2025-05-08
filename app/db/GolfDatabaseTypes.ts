export type Course = {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  active: number;
  dateAdded: string;
};

export type Hole = {
  id: number;
  holeNr: number;
  backTeeLongitude: number;
  backTeeLatitude: number;
  flagLongitude: number;
  flagLatitude: number;
  courseId: number;
  par:number;
};

export type Player = {
  id: number;
  handicap: number;
};

export type GolfClub = {
  id: number;
  playerId: number;
  name: string;
  showInList: number;
};

export type Round = {
  id?: number;
  time: number;
  playerId: number;
  courseId: number;
  handicap: number;
};

export type Stroke = {
  holeId: number;
  roundId: number;
  strokeNr: number;
  startLatitude: number;
  startLongitude: number;
  distance: number;
  strokesGained: number;
  distanceLeft: number;
  lie: number; // 0 = Tee, 1 = Fairway, 2 = Rough, 3 = Sand, 4 = Green, 5 = Recovery 
  golfClubId: number;
  playerId: number;
  distanceToHole?: number; // Optional property
};

export type TeeSlope = {
  id: string;
  courseId: number;
  slopeMale: number;
  slopeFemale: number;
  courseRatingMale: number;
  courseRatingFemale: number;
};