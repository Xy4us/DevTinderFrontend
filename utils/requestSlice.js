import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) => {
      if (!Array.isArray(state)) return null;
      return state.filter((req) => req._id !== action.payload);
    },
    removeRequests: () => null,
  },
});

export const { addRequests, removeRequest, removeRequests } =
  requestSlice.actions;

export default requestSlice.reducer;
