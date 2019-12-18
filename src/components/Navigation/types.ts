export type IsAuthenticated = boolean;
export type UserEmail = string;
export type AccessToken = string;

export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED';
export const SET_USER_EMAIL = 'SET_USER_EMAIL';
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';

export interface GetIsAuthenticatedAction {
  type: typeof SET_IS_AUTHENTICATED,
  payload: IsAuthenticated
}

export interface GetUserEmailAction {
  type: typeof SET_USER_EMAIL,
  payload: UserEmail
}

export interface GetAccessTokenAction {
  type: typeof SET_ACCESS_TOKEN,
  payload: AccessToken
}
