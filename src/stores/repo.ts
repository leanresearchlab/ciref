import { create } from 'zustand';

type RepoType = {
  id: string;
  repoId: string;
  repoName: string;
  repoUrl: string;
  username: string;
  active: boolean;
}

type Store = {
  repos: RepoType[];
  setRepos: (repos: RepoType[]) => void;
  selectedRepo: string;
  setSelectedRepo: (url: string) => void;
};

export const useSelectRepo = create<Store>((set) => ({
  repos: [],
  setRepos: (repos: RepoType[]) => { set({ repos }) },
  selectedRepo: '',
  setSelectedRepo: (url: string) => {
    set({ selectedRepo: url });
  },
}));
