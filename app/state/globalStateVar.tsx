import { create } from 'zustand';
import db from '../db/db';

type Stroke = {
  selectedCourse: any;
  setSelectedCourse: (course: any) => void;
  strokes: number[];
  setStroke: (holeIndex: number, value: number) => void;
  reset: () => void;
};

export const globalStateVar = create<Stroke>((set) => ({
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