import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: 'search',
  initialState: [],
  reducers: {
    setsearch: (state, action) => {
      return action.payload;
    },
  },
});

export const { setsearch } = searchSlice.actions;
export default searchSlice.reducer;
