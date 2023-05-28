import { create } from 'zustand';

type Store = {
  option:string;
  setOption: (option: string) => void;
  startDate: Date;
  defineStartDate: (startDate: Date) => void;
  endDate: Date;
  defineEndDate: (endDate: Date) => void;
};

export const useTimeWindow = create<Store>((set) => ({
  option: 'allProject',
  setOption: (option: string) => { set({ option }) },
  startDate: undefined,
  endDate: undefined,
  defineStartDate: (startDate: Date) => { set({ startDate }) },
  defineEndDate: (endDate: Date) => {
    set({ endDate });
  },
}));
