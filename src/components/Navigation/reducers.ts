import {
  SET_IS_AUTHENTICATED,
  SET_USER_EMAIL
} from './constants';

const authInitialState = {
  isAuthenticated: false
}

export const setIsAuthenticated = (state = authInitialState, action: any) => {
  if (action.type === SET_IS_AUTHENTICATED) {
    return Object.assign({}, state, { isAuthenticated: action.payload });
  }
  return state;
}

const userEmailInitialState = {
  userEmail: ''
}

export const setUserEmail = (state = userEmailInitialState, action: any) => {
  if (action.type === SET_USER_EMAIL) {
    return Object.assign({}, state, { userEmail: action.payload }); 
  }
  return state;
}