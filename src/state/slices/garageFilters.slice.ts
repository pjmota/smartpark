import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GarageQuery = {
  search?: string;
  digitalMonthlyPayer?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};

const initialState: GarageQuery = {
  page: 1,
  pageSize: 10,
  sortDir: 'asc',
};

const garageFiltersSlice = createSlice({
  name: 'garageFilters',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<GarageQuery>>) {
      Object.assign(state, action.payload);
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { setFilters, setPage, reset } = garageFiltersSlice.actions;
export default garageFiltersSlice.reducer;