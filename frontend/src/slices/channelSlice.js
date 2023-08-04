import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelAdapter = createEntityAdapter();
const initialState = channelAdapter.getInitialState({
  currentChannelID: null,
});

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChanels: channelAdapter.addMany,
    updateChannel: channelAdapter.updateOne,
    addChannel: channelAdapter.addOne,
    addCurrentId: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.currentChannelID = payload;
    },
  },
});

export const {
  addChanels, addCurrentId, addChannel, updateChannel,
} = channelSlice.actions;
export const channelsSelect = channelAdapter.getSelectors((state) => state.channels);
export default channelSlice.reducer;
