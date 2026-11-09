/**
 * Runs before the test framework and before any module imports.
 * jsdom omits these Node/web globals that react-router and axios reach for at import time.
 */
const { TextDecoder, TextEncoder } = require('node:util')

global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (value) => JSON.parse(JSON.stringify(value))
}

/**
 * The app uses a data router (createBrowserRouter), which wraps every navigation
 * in a fetch `Request`. jsdom has no `Request`. The app defines no loaders or
 * actions, so the router only needs the URL, method and abort signal; this
 * stand-in carries exactly those.
 */
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : String(input.url ?? input)
      this.method = (init.method ?? 'GET').toUpperCase()
      this.signal = init.signal
      this.headers = init.headers ?? {}
      this.body = init.body ?? null
    }
  }
}
