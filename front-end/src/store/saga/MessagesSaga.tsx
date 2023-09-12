import { call, takeLatest, put} from 'redux-saga/effects'
import { SendMessageType, addNewMessage, assignMessages, getRoomMessages, sendNewMessage } from './Actions'
import { getMessagesApi, sendMessageAPi } from '../api/MessagesApi';
import { Message } from '../sliceFiles/MessagesSlice';


function* getMessagesWorker (action: { payload: string }): Generator<unknown, void, Message[]> {
    const data: Message[] = yield call(getMessagesApi, action.payload)
    yield put(assignMessages(data))
}

function* sendMessageWorker(action: { payload: SendMessageType }) {
    try {
      console.log('SENDMESSA::', action.payload)
      const data: Message = yield call(sendMessageAPi, action.payload);
      yield put(addNewMessage(data));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

export function* messagesWatcher () {
    yield takeLatest(getRoomMessages, getMessagesWorker)
    yield takeLatest(sendNewMessage, sendMessageWorker)
}
