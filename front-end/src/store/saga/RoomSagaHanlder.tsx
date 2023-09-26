import { call, put, takeLatest } from "redux-saga/effects"
import { CreateRoomPayload, createRoomApi, getPublicRoomsApi, joinRoomApi } from "../api/RoomHandlerApi"
import { createRoomAction, getPublicRoomsAction, joinRoomAction } from "./Actions"
import { PublicRooms, RoomSliceState, addPublicRooms, fetchRoomDataFailure, joinRoom } from "../sliceFiles/RoomSlice"
import { addNotification } from "../sliceFiles/Notification"
import { Severity } from "../../utils/Notification"


function* createRooomWorker (action: {payload: CreateRoomPayload}): Generator<unknown, void, RoomSliceState> {
    try {
        const data = yield call(createRoomApi, action.payload)
        if (data?.error) {
            yield put(addNotification({content: data.error, severity: Severity.ERROR}))
            yield put(fetchRoomDataFailure(data.error as string));
        } else if (data.roomId) {
            yield put(joinRoom(data))
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e : any) {
        yield put(addNotification({content: e.error, severity: Severity.ERROR}))
        yield put(fetchRoomDataFailure(e as string));
    }
}

function* joinRoomWorker (action: {payload: CreateRoomPayload}): Generator<unknown, void, RoomSliceState> {
    try {
        const data = yield call(joinRoomApi, action.payload)
        if (data?.error) {
            yield put(fetchRoomDataFailure(data.error as string));
            yield put(addNotification({content: data.error, severity: Severity.ERROR}))
        } else if (data.roomId) {
            yield put(joinRoom(data))
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        yield put(addNotification({content: e.error, severity: Severity.ERROR}))
        yield put(fetchRoomDataFailure(e as string));
    }
}

function* getPublicRoomsWorker (): Generator<unknown, void, PublicRooms[]> {
    try {
        const rooms = yield call(getPublicRoomsApi)
        yield put(addPublicRooms(rooms))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        yield put(addNotification({content: e.error, severity: Severity.ERROR}))
        yield put(fetchRoomDataFailure(e as string));
    }
}

export function* roomWatcher () {
    yield takeLatest(getPublicRoomsAction, getPublicRoomsWorker);
    yield takeLatest(createRoomAction, createRooomWorker)
    yield takeLatest(joinRoomAction,joinRoomWorker )
}