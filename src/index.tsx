import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Security } from '@okta/okta-react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function onAuthRequired(): void {
  window.location.href = `http://localhost:${process.env.REACT_APP_PORT}/login`;
  console.log('env: ', process.env.REACT_APP_OKTA_URL)
}

ReactDOM.render(
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
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
