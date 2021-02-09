import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import isEmail from 'sane-email-validation'
import { signup } from '../../store/auth'
import routes from '../routes'
import styles from './SignUp.module.css'

/* type: DataTypes.ENUM(Object.values(USER_TYPE)),
 * firstName: DataTypes.STRING,
 * lastName: DataTypes.STRING,
 * institution: DataTypes.STRING,
 * institutionAddress: DataTypes.STRING,
 * lab: DataTypes.STRING,
 * email: { type: DataTypes.STRING, unique: true },
 * password: DataTypes.STRING,
 * token: DataTypes.STRING(36), */

export default function SignUp() {
  const searchParams = new URLSearchParams(window.location.search)
  const history = useHistory()
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()

  const [validationMessage, setValidationMessage] = useState(undefined)

  const onSubmit = ev => {
    ev.preventDefault()
    setValidationMessage(undefined)
    const form = ev.target

    const data = {
      token: form.elements.token.value,
      email: form.elements.email.value,
      password: form.elements.password.value,
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      institution: form.elements.institution.value,
      institutionAddress: form.elements.institutionAddress.value,
      lab: form.elements.lab.value,
    }

    if (!isEmail(data.email))
      return setValidationMessage('Email is invalid')

    dispatch(signup(data))
    .then(user => {
      if (user)
        history.push(routes.byName.afterSignUp)
    })
  }

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input id='token' type='hidden' value={searchParams.get('token')} />
        <fieldset>
          <legend>Credentials</legend>
          <label htmlFor='email'>Email</label>
          <input id='email' type='email' required defaultValue={searchParams.get('email')} />
          <label htmlFor='password'>Password</label>
          <input id='password' type='password' required />
        </fieldset>

        <fieldset>
          <legend>Identification</legend>
          <label htmlFor='firstName'>First Name</label>
          <input id='firstName' type='text' required />
          <label htmlFor='lastName'>Last Name</label>
          <input id='lastName' type='text' required />
        </fieldset>

        <fieldset>
          <legend>Organization</legend>

          <div>
            <label htmlFor='lab'>Lab</label>
            <input id='lab' type='text' required />
          </div>
          <div>
            <label htmlFor='institution'>Institution</label>
            <input id='institution' type='text' required />
          </div>
          <div>
            <label htmlFor='institutionAddress'>Institution Address</label><br/>
            <textarea id='institutionAddress' required />
          </div>
        </fieldset>

        <button disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign Up'}
        </button>
        {validationMessage &&
          <div>
            {validationMessage}
          </div>
        }
        {error &&
          <div>
            {error.message}
          </div>
        }
      </form>
    </div>
  );
}
