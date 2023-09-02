import { all } from "redux-saga/effects";
import { messagesWatcher } from "./MessagesSaga";
import { roomWatcher } from "./RoomSagaHanlder";


export default function* rootSaga () {
    yield all([messagesWatcher(), roomWatcher()])
}