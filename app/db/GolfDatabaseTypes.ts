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
  type: GolfClubType;
  iconType: GolfClubIconType;
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
  lie: StrokeLieType; // 0 = Tee, 1 = Fairway, 2 = Rough, 3 = Sand, 4 = Green, 5 = Recovery 
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

export enum GolfClubType{
  driver = 'Driver',
  miniDriver = 'Mini Driver',
  hybrid1 = 'Hybrid 1',
  hybrid3 = 'Hybrid 3',
  hybrid5 = 'Hybrid 5',
  hybrid7 = 'Hybrid 7',
  iron1 = 'Iron 1',
  iron2 = 'Iron 2',
  iron3 = 'Iron 3',
  iron4 = 'Iron 4',
  iron5 = 'Iron 5',
  iron6 = 'Iron 6',
  iron7 = 'Iron 7',
  iron8 = 'Iron 8',
  iron9 = 'Iron 9',
  wood3 = 'Wood 3',
  wood5 = 'Wood 5',
  wood7 = 'Wood 7',
  pWedge = 'PW',
  gWedge = 'GW',
  sWedge = 'SW',
  lWedge = 'LW',
  putter = 'Putter'
  }

export enum GolfClubIconType{
  driver = 'Driver',
  hybrid = 'Hybrid',
  iron = 'Iron',
  wood = 'Wood',
  wedge = 'Wedge',
  putter = 'Putter'
  }

export enum StrokeLieType{
tee = 'Tee',
fairway = 'Fairway',
rough = 'Rough',
sand = 'Sand',
green = 'Green',
recovery = 'Recovery'
}