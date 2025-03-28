import React, { createContext, useContext, useState } from 'react';


const defaultCourse = {
  name: 'Brollsta',
  holes: [
    {
      holeCoords: { latitude: 59.582875, longitude: 18.292865 },
      teeCoords: { latitude: 59.582843, longitude: 18.297886 },
      par: 4,
    },
    {
      holeCoords: { latitude: 59.58045, longitude: 18.286678 },
      teeCoords: { latitude: 59.582865, longitude: 18.290975 },
      par: 5,
    },
    {
      holeCoords: { latitude: 59.582523, longitude: 18.292028 },
      teeCoords: { latitude: 59.580322, longitude: 18.287774 },
      par: 3,
    },
  ],
};
const lindingoBana = {
  namn: 'Lidingö Golfklubb',
  par:[3,5,3,4,4,3,4,4,3,5,3,5,4,4,3,5,4],
  holes: [
    {
    greenBack: {latitude: 59.3772872, longitude: 18.1284596},
    greenMiddle: {latitude: 59.3774159, longitude: 18.1283832},
    greenFront: {latitude: 59.3775656, longitude: 18.1282329},
    teeFront: {latitude: 59.3784918, longitude: 18.1276603},
    teeBack: {latitude: 59.3788689, longitude: 18.1276979},
    },
    {
    greenBack: {latitude: 59.3734963, longitude: 18.1338681},
    greenMiddle: {latitude: 59.3735908, longitude: 18.1337624},
    greenFront: {latitude: 59.3736944, longitude: 18.1336024},
    teeFront: {latitude: 59.3768851, longitude: 18.1306135},
    teeBack: {latitude: 59.3775764, longitude: 18.1296693},
    },
    {
    greenBack: {latitude: 59.3754886, longitude: 18.1323206},
    greenMiddle: {latitude: 59.3753821, longitude: 18.1324508},
    greenFront: {latitude: 59.3752753, longitude: 18.1326078},
    teeFront: {latitude: 59.374524, longitude: 18.1340333},
    teeBack: {latitude: 59.3739666, longitude: 18.1343605},
    },
    {
    greenBack: {latitude: 59.3793912, longitude: 18.1281675},
    greenMiddle: {latitude: 59.3792651, longitude: 18.1282799},
    greenFront: {latitude: 59.3791413, longitude: 18.128399},
    teeFront: {latitude: 59.377131, longitude: 18.1312357},
    teeBack: {latitude: 59.3764561, longitude: 18.1321101},
    },
    {
    greenBack: {latitude: 59.3772466, longitude: 18.123368},
    greenMiddle: {latitude: 59.37731, longitude: 18.1234345},
    greenFront: {latitude: 59.3773798, longitude: 18.123537},
    teeFront: {latitude: 59.3786872, longitude: 18.125929},
    teeBack: {latitude: 59.3788716, longitude: 18.1263715},
    },
    {
    greenBack: {latitude: 59.375987, longitude: 18.1265261},
    greenMiddle: {latitude: 59.3760544, longitude: 18.1263595},
    greenFront: {latitude: 59.3761138, longitude: 18.1261718},
    teeFront: {latitude: 59.3767949, longitude: 18.1242459},
    teeBack: {latitude: 59.3770572, longitude: 18.1238275},
    },
    {
    greenBack: {latitude: 59.3774037, longitude: 18.1232905},
    greenMiddle: {latitude: 59.377312, longitude: 18.1234318},
    greenFront: {latitude: 59.3772133, longitude: 18.123561},
    teeFront: {latitude: 59.3755871, longitude: 18.126279},
    teeBack: {latitude: 59.3753767, longitude: 18.1270193},
    },
    {
    greenBack: {latitude: 59.3788186, longitude: 18.1254883},
    greenMiddle: {latitude: 59.3787534, longitude: 18.1252946},
    greenFront: {latitude: 59.3786751, longitude: 18.1250913},
    teeFront: {latitude: 59.3772758, longitude: 18.1215476},
    teeBack: {latitude: 59.3769725, longitude: 18.1207054},
    },
    {
    greenBack: {latitude: 59.3785118, longitude: 18.1232334},
    greenMiddle: {latitude: 59.3785765, longitude: 18.1234278},
    greenFront: {latitude: 59.3786266, longitude: 18.1236639},
    teeFront: {latitude: 59.379041, longitude: 18.1249862},
    teeBack: {latitude: 59.3790273, longitude: 18.1260215},
    },
    {
    greenBack: {latitude: 59.3814461, longitude: 18.1207903},
    greenMiddle: {latitude: 59.3813156, longitude: 18.1208341},
    greenFront: {latitude: 59.381178, longitude: 18.1208679},
    teeFront: {latitude: 59.3783661, longitude: 18.1223683},
    teeBack: {latitude: 59.3776201, longitude: 18.1214564},
    },
    {
    greenBack: {latitude: 59.3839872, longitude: 18.1195783},
    greenMiddle: {latitude: 59.383862, longitude: 18.1196084},
    greenFront: {latitude: 59.383747, longitude: 18.1196485},
    teeFront: {latitude: 59.382914, longitude: 18.1199369},
    teeBack: {latitude: 59.3827405, longitude: 18.1199906},
    },
    {
    greenBack: {latitude: 59.3822599, longitude: 18.1265724},
    greenMiddle: {latitude: 59.3822897, longitude: 18.1263863},
    greenFront: {latitude: 59.382307, longitude: 18.1261513},
    teeFront: {latitude: 59.3837377, longitude: 18.1202427},
    teeBack: {latitude: 59.3842595, longitude: 18.1192342},
    },
    {
    greenBack: {latitude: 59.381231, longitude: 18.125955},
    greenMiddle: {latitude: 59.3812945, longitude: 18.1259223},
    greenFront: {latitude: 59.3813587, longitude: 18.1258973},
    teeFront: {latitude: 59.3815738, longitude: 18.1266331},
    teeBack: {latitude: 59.3819509, longitude: 18.1255012},
    },
    {
    greenBack: {latitude: 59.3812983, longitude: 18.1263136},
    greenMiddle: {latitude: 59.3813081, longitude: 18.1260094},
    greenFront: {latitude: 59.3813181, longitude: 18.1257436},
    teeFront: {latitude: 59.3818361, longitude: 18.122422},
    teeBack: {latitude: 59.3821913, longitude: 18.1206893},
    },
    {
    greenBack: {latitude: 59.3832515, longitude: 18.1299987},
    greenMiddle: {latitude: 59.383151, longitude: 18.1298678},
    greenFront: {latitude: 59.3830336, longitude: 18.129756},
    teeFront: {latitude: 59.3808525, longitude: 18.1271266},
    teeBack: {latitude: 59.3801257, longitude: 18.1269737},
    },
    {
    greenBack: {latitude: 59.3810724, longitude: 18.1297952},
    greenMiddle: {latitude: 59.3811442, longitude: 18.1298517},
    greenFront: {latitude: 59.3812176, longitude: 18.1299518},
    teeFront: {latitude: 59.3822091, longitude: 18.1303761},
    teeBack: {latitude: 59.382817, longitude: 18.1302742},
    },
    {
    greenBack: {latitude: 59.380369, longitude: 18.1351208},
    greenMiddle: {latitude: 59.3803559, longitude: 18.1348527},
    greenFront: {latitude: 59.3803335, longitude: 18.134579},
    teeFront: {latitude: 59.3805219, longitude: 18.1285052},
    teeBack: {latitude: 59.3803334, longitude: 18.1271105},
    },
    {
    greenBack: {latitude: 59.3797237, longitude: 18.1285452},
    greenMiddle: {latitude: 59.3796913, longitude: 18.128811},
    greenFront: {latitude: 59.379656, longitude: 18.1290602},
    teeFront: {latitude: 59.3795738, longitude: 18.1338267},
    teeBack: {latitude: 59.3800875, longitude: 18.1360583},
    },
  ],
};
  


type RoundContextType = {
  playerScores: number[];
  setPlayerScores: React.Dispatch<React.SetStateAction<number[]>>;
  courseObject: typeof defaultCourse;
  setCourseObject: React.Dispatch<React.SetStateAction<typeof defaultCourse>>;
  courseName: string;
  holeCount: number;
};


const RoundContext = createContext<RoundContextType | null>(null);


export function RoundProvider({ children }: { children: React.ReactNode }) {
  const [courseObject, setCourseObject] = useState(defaultCourse);
  const [playerScores, setPlayerScores] = useState<number[]>(Array(defaultCourse.holes.length).fill(0));

  const courseName = courseObject.name;
  const holeCount = courseObject.holes.length;

  return (
    <RoundContext.Provider
      value={{
        playerScores,
        setPlayerScores,
        courseObject,
        setCourseObject,
        courseName,
        holeCount,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
}

export function useRound() {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error('useRound must be used within a RoundProvider');
  }
  return context;
}
