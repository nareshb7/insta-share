import { createSlice,  PayloadAction } from "@reduxjs/toolkit";


interface Users {
    userName: string
}
export interface PublicRooms {
    isProtected: boolean
    messages: string[]
    password: string
    roomId: string
    roomName: string
    userName: string
    users: Users
    _id: string
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
    publicRooms: PublicRooms[]
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
    isSuccess: false,
    publicRooms: []
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
        addPublicRooms: (state, action:  PayloadAction<PublicRooms[]>) => {
            state.publicRooms = action.payload
        },
        fetchRoomDataFailure: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        updateSuccessState: (state)=> {
            state.isSuccess = false
        }
    }
})

export const {joinRoom, fetchRoomDataStart, fetchRoomDataFailure, updateSuccessState, addPublicRooms} = roomSlice.actions
export default roomSlice.reducer