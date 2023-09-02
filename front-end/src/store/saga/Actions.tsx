import {createAction} from '@reduxjs/toolkit'
import { CreateRoomPayload } from '../api/RoomHandlerApi'

export const getRoomMessages = createAction('GET_ROOM_MESSAGES')
export const assignMessages = createAction<string[]>('ASSIGN_MESSAGES')
export const sendNewMessage = createAction<string>('SEND_NEW_MESSAGE')
export const addNewMessage = createAction<string>('SEND_MESSAGE_SUCCESS')
export const createRoomAction = createAction<CreateRoomPayload>('CREATE_ROOM')
export const joinRoomAction = createAction<CreateRoomPayload>('JOIN_ROOM')