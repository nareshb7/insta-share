import { createSlice,  PayloadAction } from "@reduxjs/toolkit";


interface Users {
    userName: string
}
export interface RoomSliceState {
    roomId: string,
    roomName: string,
    userName: string,
    isProtected: boolean,
    users: Users[],
    messages: string[],
    password: string,
    createdAt: Date,
    isLoading: boolean,
    error: string,
    isSuccess: boolean
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
    error:'',
    isSuccess: false
}


const roomSlice = createSlice({
    name:'room',
    initialState,
    reducers: {
        fetchRoomDataStart: (state)=> {
            state.isLoading= true
            state.error = ''
        },
        joinRoom : (state, action: PayloadAction<RoomSliceState>) => {
            const { isProtected, messages, roomId, roomName, userName, users, createdAt, password} = action.payload
            state.isLoading = false
            state.isSuccess = true
            state.messages = messages
            state.roomId = roomId
            state.roomName = roomName
            state.userName = userName
            state.users = users
            state.createdAt = createdAt
            state.password = password
            state.isProtected = isProtected  
        },
        fetchRoomDataFailure: (state, action) => {
            state.isLoading = false
            state.error = action.payload

        }
    }
})

export const {joinRoom, fetchRoomDataStart, fetchRoomDataFailure} = roomSlice.actions
export default roomSlice.reducer