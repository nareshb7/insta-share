import { createSlice } from "@reduxjs/toolkit";

export interface RoomSliceState {
    roomId: string,
    roomName: string,
    userName: string,
    isProtected: boolean,
    users: string[],
    messages: string[],
    password: string,
    createdAt: Date,
    isLoading: boolean,
    error: string
}

const initialState: RoomSliceState = {
    roomId: '',
    roomName: '',
    userName: '',
    isProtected: false,
    users: [],
    messages: [],
    password: '',
    createdAt: new Date(),
    isLoading: false,
    error:''
}


const roomSlice = createSlice({
    name:'room',
    initialState,
    reducers: {
        fetchRoomDataStart: (state)=> {
            state.isLoading= true
        },
        createRoom : (state, action) => {
            state.isLoading = false
            state = action.payload
        },
        joinRoom : (state,action) => {
            state.isLoading= false
            state = action.payload
        },
        fetchRoomDataFailure: (state, action) => {
            state.isLoading = false
            state.error = action.payload

        }
    }
})

export const {createRoom, joinRoom, fetchRoomDataStart, fetchRoomDataFailure} = roomSlice.actions
export default roomSlice.reducer