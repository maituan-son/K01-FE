import { Params } from "@/common/types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { query: Params } = {
  query: {},
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<Params>) => {
      state.query = action.payload;
    },
  },
});

export const { setQuery } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;