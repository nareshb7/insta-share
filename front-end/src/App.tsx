import React from 'react';
import Navigation from './pages/Navigation';
import RoutesPage from './RoutesComp';
import Footer from './pages/Footer';
import UserContext from './context/UserContext';
import { useSelector} from 'react-redux';
import { RootState } from './store/Store';
import Notification from './utils/Notification';


const App = () => {
  const {isNotificationEnabled, content, severity} = useSelector((state: RootState) => state.notification)
  return (
    <div className="App">
        <UserContext>
          <Navigation />
          <RoutesPage />
          <Footer />
          {
            isNotificationEnabled && <Notification content={content} severity={severity} />
          }
        </UserContext>
    </div>
  );
};

export default App;
