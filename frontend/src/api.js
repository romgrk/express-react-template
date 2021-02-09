/*
 * api.js
 */

import { stringify as qs } from 'querystring';

const API_BASE_PATH = '/api'

const api = {
  auth: {
    isLoggedIn: () => get('/auth/is-logged-in'),
    login: credentials => post('/auth/login', credentials),
    logout: () => post('/auth/logout'),
    signup: data => post('/auth/signup', data),
    resetPassword: email => post('/auth/reset-password', { email }),
    changePassword: data => post('/auth/change-password', data),
  },

  user: {
    list: () => get('/user/list'),
    invite: email => post('/user/invite', { email }),
  },
}

export default api


// Helpers

const ongoingRequests = {}

function apiFetch(method, route, body, options = { abort: false, complex: false }) {
  const baseRoute = getPathname(route)

  const headers = {}

  if (!isFormData(body) && isObject(body))
    headers["content-type"] = "application/json"

  // For abortable requests
  let signal
  if (options.abort) {
    const controller = new AbortController()
    signal = controller.signal
    if (ongoingRequests[baseRoute]) {
      ongoingRequests[baseRoute].abort()
    }
    ongoingRequests[baseRoute] = controller
  }

  const request = fetch(`${API_BASE_PATH}${route}`, {
    credentials: 'include',
    method,
    headers,
    signal,
    body:
      isFormData(body) ?
        body :
      isObject(body) ?
        JSON.stringify(body) :
        undefined,
  })

  return request.then(res => {
    if (options.abort) {
      delete ongoingRequests[baseRoute]
    }
    return res
  })
  .then(attachData)
  .then(response => {
    if (!response.ok) {
      return Promise.reject(createHTTPError(response));
    }
    if (!response.data.ok) {
      return Promise.reject(createAPIError(response));
    }
    return response.data.data;
  })
}

function get(route, queryParams, options) {
  const fullRoute = route + (queryParams ? '?' + qs(queryParams) : '')
  return apiFetch('GET', fullRoute, undefined, options);
}

function post(route, body, options) {
  return apiFetch('POST', route, body, options);
}

function put(route, body, options) {
  return apiFetch('PUT', route, body, options);
}


function createHTTPError(response) {
  const message =
    `HTTP error ${response.status}: ` + response.statusText + ': ' + response.url

  const error = new Error(message);
  error.name = 'HTTPError';
  error.url = response.url;
  error.status = response.status;
  error.statusText = response.statusText;
  error.stack = []

  return error;
}

function createAPIError(response) {
  const message =
    'API error: ' + response.data.message

  const error = new Error(message);
  error.name = 'APIError';
  error.fromAPI = true
  error.url = response.url;
  error.message = response.data.message
  error.stack = response.data.stack

  return error;
}

function attachData(response) {
  const contentType = response.headers.get('content-type') || '' ;
  const isJSON = contentType.includes('/json')
  response.isJSON = isJSON
  return (isJSON ? response.json() : response.text())
  .then(data => {
    response.data = data;
    return response;
  })
  .catch(() => {
    response.data = {};
    return response;
  })
}

function form(params) {
  const formData = new FormData()
  for (let key in params) {
    const value = params[key]
    formData.append(key, value)
  }
  return formData
}

function isObject(object) {
  return object !== null && typeof object === 'object'
}

function isFormData(object) {
  return object instanceof FormData
}

function getPathname(route) {
  return route.replace(/\?.*$/, '')
}
