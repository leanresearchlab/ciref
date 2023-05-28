import { create } from 'zustand';

type Store = {
  challenger: string;
  defineChallenger: (login: string) => void;
  challenged: string;
  defineChallenged: (login: string) => void;
};

export const useDuelStore = create<Store>((set) => ({
  challenger: '',
  challenged: '',
  defineChallenger: (login: string) => { set({ challenger: login }) },
  defineChallenged: (login: string) => {
    set({ challenged: login });
  },
}));
