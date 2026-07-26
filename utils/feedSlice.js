import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    removeUserFromFeed: (state, action) => {
      if (!Array.isArray(state)) return null;
      return state.filter((user) => user._id !== action.payload);
    },
    removeFeed: (state, action) => null,
  },
});

export const { addFeed, removeUserFromFeed, removeFeed } = feedSlice.actions;

export default feedSlice.reducer;
