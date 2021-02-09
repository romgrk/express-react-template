import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { resetPassword, changePassword } from '../../store/auth'
import routes from '../routes'
import styles from './Forgot.module.css'

export default function Forgot() {
  const searchParams = new URLSearchParams(window.location.search)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const hasData = Boolean(email && token)

  return (
    <div>
      {hasData ?
        <ChangePassword email={email} token={token} /> :
        <ResetPassword />
      }
    </div>
  );
}

function ChangePassword({ email, token }) {
  const history = useHistory()
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const password = form.elements.password.value
    dispatch(changePassword({ email, token, password }))
    .then(user => {
      if (user)
        history.push(routes.byName.afterLogin)
    })
  }

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div>
          <label htmlFor='password'>Password</label>
          <input id='password' type='password' required disabled={isLoading}/>
        </div>
        <button disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Reset Password'}
        </button>
        {error &&
          <div>
            {error.message}
          </div>
        }
      </form>
    </div>
  );
}

function ResetPassword() {
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()
  const [didReset, setDidReset] = useState(false)

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const email = form.elements.email.value
    dispatch(resetPassword(email))
    .then(() => setDidReset(true))
  }

  if (didReset)
    return (
      <div>
        Sent password reset link, check your email inbox.
      </div>
    )

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' required />
      </div>
      <button disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Reset Password'}
      </button>
      {error &&
        <div>
          {error.message}
        </div>
      }
    </form>
  )
}
