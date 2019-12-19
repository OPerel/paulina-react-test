import { combineReducers } from 'redux';

import {
  SET_IS_AUTHENTICATED,
  SET_USER_EMAIL,
  SET_ACCESS_TOKEN,
  GetIsAuthenticatedAction,
  GetUserEmailAction,
  GetAccessTokenAction
} from './types';

const authInitialState = {
  isAuthenticated: false,
}

export const setIsAuthenticated = (state = authInitialState, action: GetIsAuthenticatedAction) => {
  if (action.type === SET_IS_AUTHENTICATED) {
    return Object.assign({}, state, { isAuthenticated: action.payload });
  }
  return state;
}

const userEmailInitialState = {
  userEmail: ''
}

export const setUserEmail = (state = userEmailInitialState, action: GetUserEmailAction) => {
  if (action.type === SET_USER_EMAIL) {
    return Object.assign({}, state, { userEmail: action.payload }); 
  }
  return state;
}

const accessTokenInitialState = {
  isPending: false,
  accessToken: '',
  err: ''
}

export const setAccessToken = (state = accessTokenInitialState, action: any) => {
  switch (action.type) {
    case 'REQUEST_PENDING':
      return Object.assign({}, state, { isPending: true }); 
    case SET_ACCESS_TOKEN:
      return Object.assign({}, state, { accessToken: action.payload });
    case 'REQUEST_FAILED':
      return Object.assign({}, state, { err: action.payload });
  }
  return state;
}

export const navReducers = combineReducers({ setIsAuthenticated, setUserEmail });

export type NavState = ReturnType<typeof navReducers>;