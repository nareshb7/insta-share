import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationProps, Severity } from "../../utils/Notification";

interface NotificationSlice extends NotificationProps {
    isNotificationEnabled : boolean
}

const initialState: NotificationSlice = {
    content: '',
    severity: Severity.SUCCESS,
    isNotificationEnabled: false
}

const noitifactionSlice = createSlice({
    name: 'Notification',
    initialState,
    reducers: {
        addNotification: (state,action: PayloadAction<NotificationProps>) => {
            state.content = action.payload.content
            state.isNotificationEnabled = true
            state.severity = action.payload.severity
        },
        removeNotifcation : (state) => {
            state.isNotificationEnabled = false
        }
    }
})

export const {addNotification, removeNotifcation} = noitifactionSlice.actions
export default noitifactionSlice.reducer