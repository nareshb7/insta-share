import React from 'react';
import Navigation from './pages/Navigation';
import RoutesPage from './RoutesComp';
import Footer from './pages/Footer';
import UserContext from './context/UserContext';
import {Provider} from 'react-redux';
import { store } from './store/Store';


const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <UserContext>
          <Navigation />
          <RoutesPage />
          <Footer />
        </UserContext>
      </Provider>
    </div>
  );
};

export default App;
