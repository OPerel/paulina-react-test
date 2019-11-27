import React from 'react';
import { Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';

import './App.css';

import MainNavigation from './components/Navigation/MainNavigation';
import LandingPage from './components/LandingPage/LandingPage';
import OktaLogin from './components/OktaAuth/OktaLogin';
import FlowManagement from './components/FlowManagement/FlowManagement';

const App: React.FC = () => { 
  return (
    <>
      <MainNavigation />
      <div className="App">
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" render={() => <OktaLogin baseUrl={process.env.REACT_APP_OKTA_URL} />} />
        <SecureRoute path="/flow-management" component={FlowManagement} />
        <Route path='/implicit/callback' component={ImplicitCallback} />
      </div>
    </>
  );
}

export default App;
