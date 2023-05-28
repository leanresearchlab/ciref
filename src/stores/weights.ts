import { create } from 'zustand';
type Weight = { key: string; value: number }
type Store = {
  weights: Weight[];
  setWeights: (weight: Weight) => void;
  reset: () => void;
};

export const useCreateWeights = create<Store>((set, get) => ({
  weights: [],
  setWeights: (weight: Weight) => {
    const weights = get().weights

    const findWeight = weights.findIndex(e => e.key === weight.key)
    if (findWeight !== -1) {
      weights[findWeight].value = weight.value
      set({ weights });

      return;
    }
    weights.push({ key: weight.key, value: weight.value })
    set({ weights });
  },
  reset: () => {set({ weights: [] }) }
}));
