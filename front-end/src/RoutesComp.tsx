import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUserContext } from './context/UserContext';
import MessagesPage from './pages/MessagesPage';
import Login from './pages/Login';
// import { useUserContext } from '../context/UserContext';


const RoutesPage = () => {
  const userContext = useUserContext()
  if (userContext === null) {
    return <div>Loading...</div>
  }
  // const {userData} = userContext
  return (
    <div className="routes">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/messages"
          element={<MessagesPage />}
        />
      </Routes>
    </div>
  );
};
export default RoutesPage;

