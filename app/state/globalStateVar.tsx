import { create } from 'zustand';

import db from '../db/db';

type Location = {
  latitude : number;
  longitude : number;
};


type Stroke = {
  selectedCourse: any;
  setSelectedCourse: (course: any) => void;
  strokes: number[];
  setStroke: (holeIndex: number, value: number) => void;
  currentHole: number;
  setCurrentHole: (hole: number) => void;
  reset: () => void;
  location: Location | null;
  setLocation: (loc: Location) => void;
  currentBag: object[];
  setCurrentBag: (bag: object[]) => void;
  testMode: boolean;
  setTestMode: (testMode: boolean) => void;
};

export const globalStateVar = create<Stroke>((set) => ({
  currentHole: 0,
  setCurrentHole: (hole) => set({ currentHole: hole }),
  selectedCourse: null,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  strokes: Array(18).fill(undefined),
  setStroke: (holeIndex, value) =>
    set((state) => {
      const updated = [...state.strokes];
      updated[holeIndex] = value;
      return { strokes: updated };
    }),
  reset: () => set({ strokes: Array(18).fill(undefined) }),
  location: null,
  setLocation: (loc) => set({ location : loc}),
  currentBag: [], 
  setCurrentBag: (bag) => set({ currentBag: bag }), 
  testMode: false,
  setTestMode: (testMode) => set({ testMode }), 
}));

// Initialize testMode from settingsList
db.getSettings().then(settings => {
  // Assuming settings is an array of objects with a 'toggleButton' key
  const toggleButton = settings["toggleButton"] ?? false;
  const toggleButtonValue = toggleButton === '1' ? true : false;
  globalStateVar.getState().setTestMode(toggleButtonValue);
});

export const SETTINGS = {
  TEST: false,
  HANDICAP: 0,
  LOCATION: '',
  LANGUAGE: '',
}

export const settingsList = async (): Promise<[]> => {
   return await db.getSettings();
};