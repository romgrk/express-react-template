/*
 * routes.js
 */

import { Redirect } from 'react-router-dom'

import { USER_TYPE } from '../constants'
import Forgot from './forgot/Forgot'
import Login from './login/Login'
import SignUp from './signup/SignUp'
import Users from './users/Users'

const byName = {
  login: '/login',
  forgot: '/forgot-password',
  profile: '/user/profile',
  afterLogin: '/user/profile',
  afterSignUp: '/user/profile',
}

const loginCondition = u => u ? null : <Redirect to={byName.login} />
const adminCondition = u => u?.type === USER_TYPE.ADMIN ? null : <Redirect to={byName.login} />
const notLoginCondition = u => !u ? null : <Redirect to={byName.profile} />

const list = [
  {
    path: '/signup',
    render: () => <SignUp />,
    if: notLoginCondition,
  },
  {
    path: byName.login,
    render: () => <Login />,
    if: notLoginCondition,
  },
  {
    path: byName.forgot,
    render: () => <Forgot />,
    if: notLoginCondition,
  },
  {
    path: byName.profile,
    render: () => 'Profile',
    if: loginCondition,
  },
  {
    path: '/user/submission',
    render: () => 'Submit',
    if: loginCondition,
  },
  {
    path: '/user/history',
    render: () => 'History',
    if: loginCondition,
  },
  {
    path: '/admin/users',
    render: () => <Users />,
    if: adminCondition,
  },
  {
    path: '/',
    render: () => 'Home',
  },
]

export default { list, byName }
