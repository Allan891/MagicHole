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
