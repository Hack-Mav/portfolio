import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import githubReducer from './slices/githubSlice';
import { githubApi } from './api/githubApi';
import { GitHubState } from './slices/githubSlice.types';

// Define the root state type
export interface RootState {
  github: GitHubState;
  [githubApi.reducerPath]: ReturnType<typeof githubApi.reducer>;
}

export type AppStore = ReturnType<typeof createStore>;

export const createStore = () => {
  const store = configureStore({
    reducer: {
      github: githubReducer,
      [githubApi.reducerPath]: githubApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(githubApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Enable refetchOnFocus/refetchOnReconnect behaviors
  setupListeners(store.dispatch);

  return store;
};

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
