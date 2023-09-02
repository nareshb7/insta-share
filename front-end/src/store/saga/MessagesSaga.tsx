import { call, takeLatest, put} from 'redux-saga/effects'
import { addNewMessage, assignMessages, sendNewMessage } from './Actions'
import { getMessagesApi, sendMessageAPi } from '../api/MessagesApi';


function* getMessagesWorker (): Generator<unknown, void, string[]> {
    const data = yield call(getMessagesApi)
    yield put(assignMessages(data))
}

function* sendMessageWorker(action: { payload: string }) {
    try {
      const data: string = yield call(sendMessageAPi, action.payload);
      yield put(addNewMessage(data));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

export function* messagesWatcher () {
    yield takeLatest('GET_ROOM_MESSAGES', getMessagesWorker)
    yield takeLatest(sendNewMessage, sendMessageWorker)
}
