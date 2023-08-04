import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messageAdapter = createEntityAdapter();
const initialState = messageAdapter.getInitialState();

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messageAdapter.addMany,
    addMessage: messageAdapter.addOne,
  },
});

export const messageSelect = messageAdapter.getSelectors((state) => state.messages);
export const { addMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
