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
  currentBag: [{id:1, type: 'wood', name: 'Wood 3'},{id:2, type: 'wedge', name: 'Sand wedge'},{id:3, type: 'putter', name: 'Putter'},{id: 4, type: 'iron', name: '9 iron'}], 
  setCurrentBag: (bag) => set({ currentBag: bag }), 
}));

export const SETTINGS = {
  TEST: false,
  HANDICAP: 0,
  LOCATION: '',
  LANGUAGE: '',
}

export const settingsList = async (): Promise<[]> => {
   return await db.getSettings();
};