// Add TextEncoder and TextDecoder polyfills for Jest
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
// Use type assertion in the runtime context
global.TextDecoder = TextDecoder; 