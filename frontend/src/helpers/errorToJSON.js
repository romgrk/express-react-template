/*
 * errorToJSON.js
 */

export default function errorToJSON(err) {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    fromAPI: err.fromAPI,
  }
}
