import * as synctractor from 'synctractor'; 
synctractor.init();
synctractor.monitorFetch();
synctractor.monitorTimeout((_, t) => t !== 11000);

/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Security } from '@okta/okta-react';
import { Provider } from 'react-redux';

import configureStore from './store';

import './index.css';
import App from './App';

import * as serviceWorker from './serviceWorker';
/* eslint-disable */

const store = configureStore();

function onAuthRequired({ history }: any): void {
  history.push('/login');
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Security
        issuer={`${process.env.REACT_APP_OKTA_URL}/oauth2/default`}
        clientId={`${process.env.REACT_APP_OKTA_CLIENT_ID}`}
        redirectUri={`http://localhost:${process.env.REACT_APP_PORT}/implicit/callback`}
        onAuthRequired={onAuthRequired}
        pkce={true}
      >
        <App />
      </Security>
    </Router>,
  </Provider>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
