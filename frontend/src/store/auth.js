import { createSlice } from '@reduxjs/toolkit'
import errorToJSON from '../helpers/errorToJSON'
import api from '../api'
import { USER_TYPE } from '../constants'
import { list as listUsers } from './user'

export const slice = createSlice({
  name: 'auth',
  initialState: {
    value: 0,
    isLoading: false,
    user: undefined,
    error: undefined,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
      state.error = undefined
    },
    setUser: (state, action) => {
      state.isLoading = false
      state.user = action.payload
      state.error = undefined
    },
    setError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
});

export const { setIsLoading, setUser, setError } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const isLoggedIn = () => (dispatch, getState) => {
  dispatch(setIsLoading(true))
  return api.auth.isLoggedIn()
  .then(user => afterLogin(dispatch, getState, user))
  .catch(handleError(dispatch))
}

export const login = credentials => (dispatch, getState) => {
  dispatch(setIsLoading(true))
  return api.auth.login(credentials)
  .then(user => afterLogin(dispatch, getState, user))
  .catch(handleError(dispatch))
}

export const logout = () => (dispatch, getState) => {
  dispatch(setIsLoading(true))
  return api.auth.logout()
  .then(() => dispatch(setUser(undefined)))
  .catch(handleError(dispatch))
}

export const signup = data => (dispatch, getState) => {
  dispatch(setIsLoading(true))
  return api.auth.signup(data)
  .then(user => afterLogin(dispatch, getState, user))
  .catch(handleError(dispatch))
}

export const resetPassword = email => (dispatch, getState) => {
  dispatch(setIsLoading(true))
  return api.auth.resetPassword(email)
  .then(() => afterLogin(dispatch, getState, false))
  .catch(handleError(dispatch))
}

export const changePassword = data => (dispatch, getState) => {
  dispatch(setIsLoading(true))
  return api.auth.changePassword(data)
  .then(user => afterLogin(dispatch, getState, user))
  .catch(handleError(dispatch))
}

function afterLogin(dispatch, getState, user) {
  if (user === false)
    return dispatch(setUser(undefined))
  if (user.type === USER_TYPE.ADMIN)
    dispatch(listUsers())
  dispatch(setUser(user))
  return getState().auth.user
}

function handleError(dispatch) {
  return error => {
    dispatch(setError(errorToJSON(error)))
    return undefined
  }
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectUser = state => state.auth.user;

export default slice.reducer;
