import { createSlice } from '@reduxjs/toolkit';
import { addNewMessage, assignMessages } from '../saga/Actions';

export interface Message {
  content: string;
  from: string;
  to: string;
  type: string;
  __v?: string;
  _id?: string;
}

interface MessageSlice {
  messages: Message[];
  roomId: string;
  roomMembers: string[];
}

const initialState: MessageSlice = {
  messages: [],
  roomId: '',
  roomMembers: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    getMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignMessages, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(addNewMessage, (state, action) => {
        state.messages = [...state.messages, action.payload];
      });
  },
});

export const { getMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
