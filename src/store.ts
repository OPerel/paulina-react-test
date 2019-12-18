import { createStore, applyMiddleware, combineReducers } from 'redux';
// import { createLogger } from 'redux-logger';
// import thunkMiddleware from 'redux-thunk';

import { setIsAuthenticated, setUserEmail, setAccessToken, navReducers } from './components/Navigation/reducers';

const rootReducer = combineReducers({ setIsAuthenticated, setUserEmail, setAccessToken })
// export type NavState = ReturnType<>

// const logger = createLogger();

export default function configureStore() {
  const store = createStore(rootReducer, /**applyMiddleware(logger)*/);
  return store;
}
