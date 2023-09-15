import {configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'
import rootSaga from './saga'
import messageSlice from './sliceFiles/MessagesSlice'
import RoomSlice from './sliceFiles/RoomSlice'
import Notification from './sliceFiles/Notification'

const sagaMiddlewre = createSagaMiddleware()
export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
    reducer: {
        messages: messageSlice,
        room: RoomSlice,
        notification: Notification
    },
    middleware: [sagaMiddlewre]
})

sagaMiddlewre.run(rootSaga)