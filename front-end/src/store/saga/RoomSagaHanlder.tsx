import { call, put, takeLatest } from "redux-saga/effects"
import { CreateRoomPayload, createRoomApi, joinRoomApi } from "../api/RoomHandlerApi"
import { createRoomAction, joinRoomAction } from "./Actions"
import { RoomSliceState, createRoom, fetchRoomDataFailure, joinRoom } from "../sliceFiles/RoomSlice"


function* createRooomWorker (action: {payload: CreateRoomPayload}): Generator<unknown, void, RoomSliceState> {
    try {
        const data = yield call(createRoomApi, action.payload)
        console.log('CREATE_ROM::', data)
        yield put(createRoom(data))
    } catch (e) {
        if (e) {
            yield put(fetchRoomDataFailure(e.message as string));
            console.error('CREATE_ROOM_ERROR::', e);
          } else {
            // Handle other types of errors
            console.error('Other error:', e);
          }
    }
}
function* joinRoomWorker (action: {payload: CreateRoomPayload}): Generator<unknown, void, RoomSliceState> {
    try {
        const data = yield call(joinRoomApi, action.payload )
        yield put(joinRoom(data))
    } catch (e) {
        console.error('JOIN_ROOM_ERROR::', e)
    }
}

export function* roomWatcher () {
    yield takeLatest(createRoomAction, createRooomWorker)
    yield takeLatest(joinRoomAction,joinRoomWorker )
}