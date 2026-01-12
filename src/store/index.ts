import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { githubApi } from './api/githubApi';

export const store = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the [RootState](cci:2://file:///e:/CURRENT%20WORKING%20ON/portfolio/src/store/store.ts:16:0-16:58) and [AppDispatch](cci:2://file:///e:/CURRENT%20WORKING%20ON/portfolio/src/store/store.ts:17:0-17:48) types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type-safe hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;