import { create } from 'zustand';

type Stroke = {
  strokes: number[];
  setStroke: (holeIndex: number, value: number) => void;
  reset: () => void;
};

export const globalStateVar = create<Stroke>((set) => ({
  strokes: Array(18).fill(undefined),
  setStroke: (holeIndex, value) =>
    set((state) => {
      const updated = [...state.strokes];
      updated[holeIndex] = value;
      return { strokes: updated };
    }),
  reset: () => set({ strokes: Array(18).fill(undefined) }),
}));
