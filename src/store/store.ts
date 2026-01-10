import { configureStore } from '@reduxjs/toolkit';
import githubReducer from './slices/githubSlice';
import { GitHubState } from './slices/githubSlice.types';

export interface RootState {
  github: GitHubState;
}

export type AppStore = ReturnType<typeof createStore>;

export const createStore = () => {
  return configureStore({
    reducer: {
      github: githubReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
