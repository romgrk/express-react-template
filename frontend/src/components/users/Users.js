import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isEmail from 'sane-email-validation'
import errorToJSON from '../../helpers/errorToJSON'
import { invite } from '../../store/user'
import styles from './Users.module.css'

export default function Users() {
  const isLoading = useSelector(s => s.user.isLoading)
  const users = useSelector(s => s.user.list)
  const error = useSelector(s => s.user.error)

  return (
    <div>
      <h1>Users</h1>

      <div className={styles.inviteContainer}>
        <h4>Invite new user</h4>
        <Invite />
      </div>

      <h4>List</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Email</td>
            <td>Lab</td>
            <td>Institution</td>
            <td>Address</td>
            <td>Signed Up</td>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.lab}</td>
              <td>{user.institution}</td>
              <td>{user.institutionAddress?.replace(/\n/g, ', ')}</td>
              <td>{String(user.password)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Invite() {
  const dispatch = useDispatch()
  const [state, setState] = useState({ isLoading: false, error: undefined })

  const onInvite = ev => {
    ev.preventDefault()
    const element = ev.target.elements.email
    const email = element.value

    if (!isEmail(email)) {
      return setState({ isLoading: false, error: 'Not a valid email' })
    }

    setState({ isLoading: true, error: undefined })
    dispatch(invite(email))
    .then(() => {
      setState({ isLoading: false, error: undefined })
      element.value = ''
    })
    .catch(err => setState({ isLoading: false, error: errorToJSON(err) }))
  }

  return (
    <form className={styles.inviteForm} onSubmit={onInvite}>
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' disabled={state.isLoading} />
      </div>
      <button disabled={state.isLoading}>
        Invite
      </button>
      {state.error && state.error.message}
    </form>
  )
}

