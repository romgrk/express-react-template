import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { login } from '../../store/auth'
import routes from '../routes'
import styles from './Login.module.css'

export default function Login() {
  const history = useHistory()
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const email = form.elements.email.value
    const password = form.elements.password.value
    dispatch(login({ email, password }))
    .then(() => history.push(routes.byName.afterLogin))
  }

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input id='email' type='text' />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input id='password' type='password' />
        </div>
        <button disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </button> <Link to={routes.byName.forgot}><small>Forgot password?</small></Link>
        {error &&
          <div>
            {error.message}
          </div>
        }
      </form>
    </div>
  );
}
