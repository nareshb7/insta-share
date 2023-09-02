import {configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'
import rootSaga from './saga'
import messageSlice from './sliceFiles/MessagesSlice'
import RoomSlice from './sliceFiles/RoomSlice'

const sagaMiddlewre = createSagaMiddleware()
export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
    reducer: {
        messages: messageSlice,
        room: RoomSlice
    },
    middleware: [sagaMiddlewre]
})

sagaMiddlewre.run(rootSaga)