import { configureStore } from '@reduxjs/toolkit';
import garageFiltersReducer from './slices/garageFilters.slice';
import garagesReducer from './slices/garages.slice';

export const store = configureStore({
  reducer: {
    garageFilters: garageFiltersReducer,
    garages: garagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;