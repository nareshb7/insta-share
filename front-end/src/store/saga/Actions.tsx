import {createAction} from '@reduxjs/toolkit'
import { CreateRoomPayload } from '../api/RoomHandlerApi'
import { Message } from '../sliceFiles/MessagesSlice'



export interface SendMessageType {
    content: string
    from: string,
    to: string,
    type?: 'message' | 'image' | 'zipfile' | 'pdf'
    fileId?: string
}

export const getRoomMessages = createAction<string>('GET_ROOM_MESSAGES')
export const assignMessages = createAction<Message[]>('ASSIGN_MESSAGES')
export const sendNewMessage = createAction<SendMessageType>('SEND_NEW_MESSAGE')
export const addNewMessage = createAction<Message>('SEND_MESSAGE_SUCCESS')
export const createRoomAction = createAction<CreateRoomPayload>('CREATE_ROOM')
export const joinRoomAction = createAction<CreateRoomPayload>('JOIN_ROOM')
export const getPublicRoomsAction = createAction('GET_PUBLIC_ROOMS')