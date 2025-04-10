type Course = {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  active: number;
  dateAdded: string;
};

type Hole = {
  id: number;
  holeNr: number;
  backTeeLongitude: number;
  backTeeLatitude: number;
  flagLongitude: number;
  flagLatitude: number;
  courseId: number;
};

type Player = {
  id: number;
  handicap: number;
};

type GolfClub = {
  id: number;  //ClubId = 0 = Putter
  playerId: number;
  name: string;
  showInList: number;
};

type Round = {
  id?: number;
  time: number;
  playerId: number;
  courseId: number;
  handicap: number;
};

type Stroke = {
  holeId: number;
  roundId: number;
  strokeNr: number;
  startLatitude: number;
  startLongitude: number;
  distance: number;
  strokesGained: number;
  lie: number; // 0 = Tee, 1 = Fairway, 2 = Rough, 3 = Sand, 4 = Green, 5 = Recovery 
  golfClubId: number; //ClubId = 0 = Putter
  playerId: number;
};

type TeeSlope = {
  id: string;
  courseId: number;
  slopeMale: number;
  slopeFemale: number;
  courseRatingMale: number;
  courseRatingFemale: number;
};
