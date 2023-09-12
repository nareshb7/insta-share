import { call, put, takeLatest } from "redux-saga/effects"
import { CreateRoomPayload, createRoomApi, joinRoomApi } from "../api/RoomHandlerApi"
import { createRoomAction, joinRoomAction } from "./Actions"
import { RoomSliceState, fetchRoomDataFailure, joinRoom } from "../sliceFiles/RoomSlice"


function* createRooomWorker (action: {payload: CreateRoomPayload}): Generator<unknown, void, RoomSliceState> {
    try {
        const data = yield call(createRoomApi, action.payload)
        if (data?.error) {
            yield put(fetchRoomDataFailure(data.error as string));
        } else if (data.roomId) {
            yield put(joinRoom(data))
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e : any) {
        yield put(fetchRoomDataFailure(e as string));
        console.error('CREATE_ROOM_ERROR::', e.Error);
    }
}
function* joinRoomWorker (action: {payload: CreateRoomPayload}): Generator<unknown, void, RoomSliceState> {
    try {
        const data = yield call(joinRoomApi, action.payload)
        console.log('SAGA::', data)
        if (data?.error) {
            yield put(fetchRoomDataFailure(data.error as string));
        } else if (data.roomId) {
            console.log('SAGA::SUCCESS', data)
            yield put(joinRoom(data))
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        yield put(fetchRoomDataFailure(e as string));
        console.error('JOIN_ROOM_ERROR::', e)
    }
}

export function* roomWatcher () {
    yield takeLatest(createRoomAction, createRooomWorker)
    yield takeLatest(joinRoomAction,joinRoomWorker )
}