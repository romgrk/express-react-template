/*
 * handlers.js
 */


exports.errorHandler = res => err => {
  const message = err.toString()
  const stack = process.env.NODE_ENV === 'production' ? null : err.stack
  const result = { ok: false, message, stack }
  if (err.meta)
    result.meta = err.meta
  if (err.response && err.response.body)
    result.data = err.response.body
  res.json(result)
  res.end()
}

exports.okHandler = res => () => {
  res.json({ ok: true, data: null })
  res.end()
}

exports.dataHandler = res => data => {
  res.json({ ok: true, data: data })
  res.end()
}

exports.warningHandler = res => ([data, message]) => {
  const result = { ok: true, data }
  if (message && message.length > 0) {
    result.warning = true
    result.message = asString(message)
  }
  res.json(result)
  res.end()
}

function asString(value) {
  if (Array.isArray(value))
    return value.join('\n')
  return '' + value
}
