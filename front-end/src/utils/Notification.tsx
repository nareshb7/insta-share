import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeNotifcation } from '../store/sliceFiles/Notification';

export enum Severity {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
}
export interface NotificationProps {
  content: string;
  severity: Severity;
}

const Notification = ({ content, severity }: NotificationProps) => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(removeNotifcation());
  };
  useEffect(() => {
    setTimeout(() => {
      dispatch(removeNotifcation());
    }, 5000);
  }, []);
  return (
    <div className={`notification ${severity}`}>
      <span className="content">{content}</span>
      <span className={`line ${severity}`}></span>{' '}
      <span className="icon">
        {' '}
        &#9432;{' '}
        <span className="close-icon" onClick={handleClose}>
          {' '}
          X{' '}
        </span>{' '}
      </span>{' '}
    </div>
  );
};

export default Notification;
