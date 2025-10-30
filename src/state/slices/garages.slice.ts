import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IClients } from '@/types/clients.type';
import { fetchGarages as fetchGaragesApi } from '@/services/clientsService/clients.service';
import type { GarageQuery } from './garageFilters.slice';

export type GaragesStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type GaragesState = {
  items: IClients[];
  status: GaragesStatus;
  error: string | null;
};

const initialState: GaragesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchGaragesThunk = createAsyncThunk<IClients[], GarageQuery | undefined>(
  'garages/fetchGarages',
  async (query, { rejectWithValue }) => {
    try {
      const data = await fetchGaragesApi({
        search: query?.search,
        digitalMonthlyPayer: query?.digitalMonthlyPayer,
      });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar garagens';
      return rejectWithValue(message);
    }
  }
);

const garagesSlice = createSlice({
  name: 'garages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGaragesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGaragesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchGaragesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Erro ao carregar garagens';
      });
  },
});

export default garagesSlice.reducer;