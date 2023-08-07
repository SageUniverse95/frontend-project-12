import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { removeChannel } from './channelSlice';

const messageAdapter = createEntityAdapter();
const initialState = messageAdapter.getInitialState();

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messageAdapter.addMany,
    addMessage: messageAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const curChannelId = action.payload;
      // eslint-disable-next-line max-len
      const restMessages = Object.values(state.entities).filter((item) => item.channelId !== curChannelId);
      messageAdapter.setAll(state, restMessages);
    });
  },
});

export const messageSelect = messageAdapter.getSelectors((state) => state.messages);
export const { addMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
