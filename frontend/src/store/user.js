import { createSlice } from '@reduxjs/toolkit'
import errorToJSON from '../helpers/errorToJSON'
import api from '../api'

export const slice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    isLoaded: false,
    list: [],
    error: undefined,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
      state.error = undefined
    },
    setList: (state, action) => {
      state.isLoading = false
      state.isLoaded = true
      state.list = action.payload
    },
    setError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
});

export const { setIsLoading, setList, setError } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const list = () => dispatch => {
  dispatch(setIsLoading(true))
  return api.user.list()
  .then(users => dispatch(setList(users)))
  .catch(error => dispatch(setError(errorToJSON(error))))
}

export const invite = email => (dispatch, getState) => {
  return api.user.invite(email)
  .then(user => {
    const previousUsers = getState().user.list
    const users = previousUsers
      .filter(u => u.email !== email)
      .concat(user)
    dispatch(setList(users))
  })
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectUser = state => state.auth.user;

export default slice.reducer;
