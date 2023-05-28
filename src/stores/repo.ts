import { create } from 'zustand';

type Store = {
  repos: any[];
  setRepos: (repos: any[]) => void;
  selectedRepo: string;
  setSelectedRepo: (url: string) => void;
};

export const useSelectRepo = create<Store>((set) => ({
  repos: [],
  setRepos: (repos: any[]) => { set({ repos }) },
  selectedRepo: '',
  setSelectedRepo: (url: string) => {
    set({ selectedRepo: url });
  },
}));
