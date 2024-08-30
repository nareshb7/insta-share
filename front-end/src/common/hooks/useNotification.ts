import React from 'react'
import { useDispatch } from 'react-redux'
import { Severity } from '../../utils/Notification'
import { addNotification } from '../../store/sliceFiles/Notification'

const useNotification = () => {
    const dispatch = useDispatch()
    const updateNotification =(content: string, severity : Severity)=> {
        dispatch(addNotification({content, severity}))
    }
  return {
    updateNotification
  }
}

export default useNotification