import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messageAdapter = createEntityAdapter();
const initialState = messageAdapter.getInitialState();

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messageAdapter.addMany,
  },
});

export const selectors = messageAdapter.getSelectors((state) => state.message);
export const { addMessages } = messageSlice.actions;
export default messageSlice.reducer;
