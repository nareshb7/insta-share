import { RoomSliceState } from "../sliceFiles/RoomSlice"
import { BE_URL } from "./MessagesApi"

export interface CreateRoomPayload {
    roomId:string,
    userName: string,
    isProtected: boolean
    password?: string
    roomName?: string
}
export interface JoinRoomPayload {
    roomId: string,
    userName: string
}

export const createRoomApi = async (params: CreateRoomPayload):Promise<RoomSliceState> => {
    console.log('API::', params)
    return fetch(`${BE_URL}/room/createroom`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({params})
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
}

export const joinRoomApi =async (params: CreateRoomPayload): Promise<RoomSliceState> => {
    return fetch(`${BE_URL}/room/joinroom`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({params})
    }).then(res => res.json())
    .then(data => data)
    .catch(err => err)
}