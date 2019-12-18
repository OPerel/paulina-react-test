import {
  SET_IS_AUTHENTICATED,
  SET_USER_EMAIL,
  SET_ACCESS_TOKEN
} from './types';

export const getIsAuthenticated = (isAuthenticated: boolean) => ({
  type: SET_IS_AUTHENTICATED,
  payload: isAuthenticated
})

export const getUserEmail = (userEmail: string) => ({
  type:  SET_USER_EMAIL,
  payload: userEmail
})

export const getAccessToken = (accessToken: string) => ({
  type:  SET_ACCESS_TOKEN,
  payload: accessToken
})
