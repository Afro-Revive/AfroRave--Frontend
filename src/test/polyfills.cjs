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
