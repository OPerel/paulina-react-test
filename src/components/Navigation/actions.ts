import {
  SET_IS_AUTHENTICATED,
  SET_USER_EMAIL
} from './constants';

export const getIsAuthenticated = (isAuthenticated: boolean) => ({
  type: SET_IS_AUTHENTICATED,
  payload: isAuthenticated
})

export const getUserEmail = (userEmail: string) => ({
  type:  SET_USER_EMAIL,
  payload: userEmail
})
