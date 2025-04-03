type Course = {
  id: number;
  name: string;
  coordinateX: number;
  coordinateY: number;
  active: number;
  createDate: string;
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
  id?: number;
  handicap: number;
};

type GolfClub = {
  id?: number;
  playerId: number;
  name: string;
  showInList: number;
};

type Round = {
  id: number;
  time: string;
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
  golfClubId: number;
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
