import { call, takeLatest, put} from 'redux-saga/effects'
import { SendMessageType, addNewMessage, assignMessages, getRoomMessages, sendNewMessage } from './Actions'
import { getMessagesApi, sendMessageAPi } from '../api/MessagesApi';
import { Message } from '../sliceFiles/MessagesSlice';
import { addNotification } from '../sliceFiles/Notification';
import { Severity } from '../../utils/Notification';


function* getMessagesWorker (action: { payload: string }): Generator<unknown, void, Message[]> {
    const data: Message[] = yield call(getMessagesApi, action.payload)
    yield put(assignMessages(data))
}

function* sendMessageWorker(action: { payload: SendMessageType }) {
    try {
      const data: Message = yield call(sendMessageAPi, action.payload);
      yield put(addNewMessage(data));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      yield put(addNotification({content: error.error, severity: Severity.ERROR}))
    }
  }

export function* messagesWatcher () {
    yield takeLatest(getRoomMessages, getMessagesWorker)
    yield takeLatest(sendNewMessage, sendMessageWorker)
}
