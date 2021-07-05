(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
     * @Author XIAO-LI-PIN
     * @Description 通用模板
     * @Date 2021-04-14 下午 20:24
     * @Version 1.1
     */
const OverrideComponent_1 = require("./OverrideComponent");
class AGenericTemplate extends OverrideComponent_1.default {
    /**
     * 一律使用onCreate() 代替  onLoad()
     * @protected
     */
    onLoad() {
        this.onCreate();
    }
    start() {
        this.languageSetting();
    }
}
exports.default = AGenericTemplate;
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/AGenericTemplate.ts","/")

},{"./OverrideComponent":2,"_process":6,"buffer":4,"timers":7}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @Author XIAO-LI-PIN
 * @Description (Override)擴展cc.Component
 * @Date 2021-05-28 上午 10:11
 * @Version 1.0
 */
class OverrideComponent extends cc.Component {
    constructor() {
        super();
        this.scheduleTag = new Array();
    }
    /**
     * 獲取當前使用中的計時器
     * @returns {Array<Function>}
     */
    getScheduleTag() {
        return this.scheduleTag;
    }
    /**
     * 獲取當前還尚未釋放的計時器數量
     * @returns {number}
     */
    getScheduleAmount() {
        return this.scheduleTag.length;
    }
    /**
     * 可選循環次數計時器,額外新增增加保存使用中的計時器方法,與原版cocos使用上並無差別
     * @param {Function} callback - 返回方法
     * @param {number} interval - 間格時間
     * @param {number} repeat - 重複次數
     * @param {number} delay - 延遲時間
     */
    schedule(callback, interval, repeat, delay) {
        super.schedule(this.checkScheduleRepeat(callback, repeat), interval, repeat, delay);
        this.scheduleTag.push(callback);
    }
    /**
     * 確認當前計時器是否有使用重複次數
     * @protected
     */
    checkScheduleRepeat(callback, repeat) {
        if (repeat > 0) {
            callback.prototype = () => {
                repeat--;
                if (repeat < 0)
                    this.unschedule(callback);
                callback.apply(this);
            };
        }
        else {
            return callback;
        }
        return callback.prototype;
    }
    /**
     * 單次計時器,額外新增增加保存使用中的計時器方法,與原版cocos使用上並無差別
     * @param {Function} callback - 返回方法
     * @param {number} delay - 延遲時間
     */
    scheduleOnce(callback, delay) {
        callback.prototype = () => {
            this.unschedule(callback.prototype);
            callback.apply(this);
        };
        this.schedule(callback.prototype, 0, 0, delay);
    }
    /**
     * 清除單個計時器方法,額外新增刪除使用中的計時器紀錄,與原版cocos使用上並無差別
     * @param {Function} callback - 當初綁定的方法
     */
    unschedule(callback) {
        super.unschedule(this.checkScheduleTag(callback));
        let index = this.checkScheduleCallFunIndex(callback);
        if (index > -1) {
            this.scheduleTag.splice(index, 1);
        }
    }
    /**
     * 判斷當前方法是否正在等待計時器callback中
     * @param {Function} callback - 原本綁定該計時器的方法
     * @returns {number} - 返回當前this.getScheduleTag[]執行中的index位置,如果該陣列內無該方法,返回-1
     * @protected
     */
    checkScheduleCallFunIndex(callback) {
        let index;
        if (this.getScheduleTag().indexOf(callback) != -1) {
            index = this.scheduleTag.indexOf(callback);
        }
        else if (this.getScheduleTag().indexOf(callback.prototype) != -1) {
            index = this.scheduleTag.indexOf(callback.prototype);
        }
        else {
            return -1;
        }
        return index;
    }
    /**
     * 確認當前該方法以甚麼形式執行的,原型鏈 or 基礎方法
     * @param {Function} callback - 原本綁定該計時器的方法
     * @returns {Function} - 返回當前this.getScheduleTag[]內的該方法,如果該陣列內無該方法,返回undefined
     * @protected
     */
    checkScheduleTag(callback) {
        let fun = undefined;
        let index = this.checkScheduleCallFunIndex(callback);
        if (index > -1) {
            fun = this.scheduleTag[index];
        }
        return fun;
    }
    /**
     * 清除當前所有使用中的計時器,額外新增清空計時器數量方法,與原版cocos使用上並無差別
     */
    unscheduleAllCallbacks() {
        super.unscheduleAllCallbacks();
        this.scheduleTag.length = 0;
    }
}
exports.default = OverrideComponent;
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/OverrideComponent.ts","/")

},{"_process":6,"buffer":4,"timers":7}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/../../node_modules/base64-js/index.js","/../../node_modules/base64-js")

},{"_process":6,"buffer":4,"timers":7}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/../../node_modules/buffer/index.js","/../../node_modules/buffer")

},{"_process":6,"base64-js":3,"buffer":4,"ieee754":5,"timers":7}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")

},{"_process":6,"buffer":4,"timers":7}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/../../node_modules/process/browser.js","/../../node_modules/process")

},{"_process":6,"buffer":4,"timers":7}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
// DOM APIs, for completeness

if (typeof setTimeout !== 'undefined') exports.setTimeout = function() { return setTimeout.apply(window, arguments); };
if (typeof clearTimeout !== 'undefined') exports.clearTimeout = function() { clearTimeout.apply(window, arguments); };
if (typeof setInterval !== 'undefined') exports.setInterval = function() { return setInterval.apply(window, arguments); };
if (typeof clearInterval !== 'undefined') exports.clearInterval = function() { clearInterval.apply(window, arguments); };

// TODO: Change to more effiecient list approach used in Node.js
// For now, we just implement the APIs using the primitives above.

exports.enroll = function(item, delay) {
  item._timeoutID = setTimeout(item._onTimeout, delay);
};

exports.unenroll = function(item) {
  clearTimeout(item._timeoutID);
};

exports.active = function(item) {
  // our naive impl doesn't care (correctness is still preserved)
};

exports.setImmediate = require('process/browser.js').nextTick;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/../../node_modules/timers-browserify/main.js","/../../node_modules/timers-browserify")

},{"_process":6,"buffer":4,"process/browser.js":8,"timers":7}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate,clearImmediate,__filename,__dirname){(function (){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate,require("timers").clearImmediate,"/../../node_modules/timers-browserify/node_modules/process/browser.js","/../../node_modules/timers-browserify/node_modules/process")

},{"_process":6,"buffer":4,"timers":7}]},{},[1])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJBR2VuZXJpY1RlbXBsYXRlLnRzIiwiT3ZlcnJpZGVDb21wb25lbnQudHMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7Ozs7T0FLTztBQUNQLDJEQUFvRDtBQUVwRCxNQUE4QixnQkFBaUIsU0FBUSwyQkFBaUI7SUFZaEU7OztPQUdHO0lBQ08sTUFBTTtRQUNaLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRVMsS0FBSztRQUNYLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQixDQUFDO0NBQ0o7QUF2QkwsbUNBdUJLOzs7Ozs7O0FDL0JMOzs7OztHQUtHO0FBQ0gsTUFBcUIsaUJBQWtCLFNBQVEsRUFBRSxDQUFDLFNBQVM7SUFTdkQ7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxLQUFLLEVBQVksQ0FBQztJQUM3QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sY0FBYztRQUNwQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNPLGlCQUFpQjtRQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ25DLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxRQUFRLENBQUMsUUFBa0IsRUFBRSxRQUFpQixFQUFFLE1BQWUsRUFBRSxLQUFjO1FBQ2xGLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7O09BR0c7SUFDTyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtRQUMxQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDWixRQUFRLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRTtnQkFDdEIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxNQUFNLEdBQUcsQ0FBQztvQkFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMxQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQTtTQUNKO2FBQU07WUFDSCxPQUFPLFFBQVEsQ0FBQztTQUNuQjtRQUNELE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxRQUFrQixFQUFFLEtBQWM7UUFDbEQsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUE7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksVUFBVSxDQUFDLFFBQWtCO1FBQ2hDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08seUJBQXlCLENBQUMsUUFBa0I7UUFDbEQsSUFBSSxLQUFhLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQy9DLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM5QzthQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDaEUsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN4RDthQUFNO1lBQ0gsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sZ0JBQWdCLENBQUMsUUFBa0I7UUFDekMsSUFBSSxHQUFHLEdBQWEsU0FBUyxDQUFDO1FBQzlCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNaLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSSxzQkFBc0I7UUFDekIsS0FBSyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQTVIRCxvQ0E0SEM7Ozs7O0FDbElEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2p2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZmNjLXRlbXBsYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxyXG4gICAgICogQEF1dGhvciBYSUFPLUxJLVBJTlxyXG4gICAgICogQERlc2NyaXB0aW9uIOmAmueUqOaooeadv1xyXG4gICAgICogQERhdGUgMjAyMS0wNC0xNCDkuIvljYggMjA6MjRcclxuICAgICAqIEBWZXJzaW9uIDEuMVxyXG4gICAgICovXHJcbmltcG9ydCBPdmVycmlkZUNvbXBvbmVudCBmcm9tIFwiLi9PdmVycmlkZUNvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQUdlbmVyaWNUZW1wbGF0ZSBleHRlbmRzIE92ZXJyaWRlQ29tcG9uZW50IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Ieq6KiC576p5Yid5aeL54uA5oWLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uQ3JlYXRlKCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiqnuezu+ioree9rlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBhYnN0cmFjdCBsYW5ndWFnZVNldHRpbmcoKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5LiA5b6L5L2/55Sob25DcmVhdGUoKSDku6Pmm78gIG9uTG9hZCgpXHJcbiAgICAgICAgICogQHByb3RlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBvbkxvYWQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMub25DcmVhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5sYW5ndWFnZVNldHRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9IiwiLyoqXHJcbiAqIEBBdXRob3IgWElBTy1MSS1QSU5cclxuICogQERlc2NyaXB0aW9uIChPdmVycmlkZSnmk7TlsZVjYy5Db21wb25lbnRcclxuICogQERhdGUgMjAyMS0wNS0yOCDkuIrljYggMTA6MTFcclxuICogQFZlcnNpb24gMS4wXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdmVycmlkZUNvbXBvbmVudCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkv53lrZjnlbbliY3kvb/nlKjkuK3nmoToqIjmmYLlmajmlrnms5Us5aaC5p6c6Kmy6KiI5pmC5Zmo5Z+36KGM5a6MLOacg+iHquWLlea4heepuuipsuaWueazlVxyXG4gICAgICogQHR5cGUge0FycmF5PEZ1bmN0aW9uPn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2NoZWR1bGVUYWc6IEFycmF5PEZ1bmN0aW9uPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVUYWcgPSBuZXcgQXJyYXk8RnVuY3Rpb24+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnjbLlj5bnlbbliY3kvb/nlKjkuK3nmoToqIjmmYLlmahcclxuICAgICAqIEByZXR1cm5zIHtBcnJheTxGdW5jdGlvbj59XHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBnZXRTY2hlZHVsZVRhZygpOiBBcnJheTxGdW5jdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlVGFnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog542y5Y+W55W25YmN6YKE5bCa5pyq6YeL5pS+55qE6KiI5pmC5Zmo5pW46YePXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U2NoZWR1bGVBbW91bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZVRhZy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj6/pgbjlvqrnkrDmrKHmlbjoqIjmmYLlmags6aGN5aSW5paw5aKe5aKe5Yqg5L+d5a2Y5L2/55So5Lit55qE6KiI5pmC5Zmo5pa55rOVLOiIh+WOn+eJiGNvY29z5L2/55So5LiK5Lim54Sh5beu5YilXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIOi/lOWbnuaWueazlVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGludGVydmFsIC0g6ZaT5qC85pmC6ZaTXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0IC0g6YeN6KSH5qyh5pW4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVsYXkgLSDlu7bpgbLmmYLplpNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjaGVkdWxlKGNhbGxiYWNrOiBGdW5jdGlvbiwgaW50ZXJ2YWw/OiBudW1iZXIsIHJlcGVhdD86IG51bWJlciwgZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5zY2hlZHVsZSh0aGlzLmNoZWNrU2NoZWR1bGVSZXBlYXQoY2FsbGJhY2ssIHJlcGVhdCksIGludGVydmFsLCByZXBlYXQsIGRlbGF5KTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlVGFnLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56K66KqN55W25YmN6KiI5pmC5Zmo5piv5ZCm5pyJ5L2/55So6YeN6KSH5qyh5pW4XHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBjaGVja1NjaGVkdWxlUmVwZWF0KGNhbGxiYWNrLCByZXBlYXQpOiBGdW5jdGlvbiB7XHJcbiAgICAgICAgaWYgKHJlcGVhdCA+IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sucHJvdG90eXBlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVwZWF0LS07XHJcbiAgICAgICAgICAgICAgICBpZiAocmVwZWF0IDwgMCkgdGhpcy51bnNjaGVkdWxlKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FsbGJhY2sucHJvdG90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Zau5qyh6KiI5pmC5ZmoLOmhjeWkluaWsOWinuWinuWKoOS/neWtmOS9v+eUqOS4reeahOioiOaZguWZqOaWueazlSzoiIfljp/niYhjb2Nvc+S9v+eUqOS4iuS4pueEoeW3ruWIpVxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSDov5Tlm57mlrnms5VcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWxheSAtIOW7tumBsuaZgumWk1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2NoZWR1bGVPbmNlKGNhbGxiYWNrOiBGdW5jdGlvbiwgZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjYWxsYmFjay5wcm90b3R5cGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudW5zY2hlZHVsZShjYWxsYmFjay5wcm90b3R5cGUpO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZShjYWxsYmFjay5wcm90b3R5cGUsIDAsIDAsIGRlbGF5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOWWruWAi+ioiOaZguWZqOaWueazlSzpoY3lpJbmlrDlop7liKrpmaTkvb/nlKjkuK3nmoToqIjmmYLlmajntIDpjIQs6IiH5Y6f54mIY29jb3Pkvb/nlKjkuIrkuKbnhKHlt67liKVcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0g55W25Yid57aB5a6a55qE5pa55rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bnNjaGVkdWxlKGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLnVuc2NoZWR1bGUodGhpcy5jaGVja1NjaGVkdWxlVGFnKGNhbGxiYWNrKSk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5jaGVja1NjaGVkdWxlQ2FsbEZ1bkluZGV4KGNhbGxiYWNrKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlVGFnLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pa355W25YmN5pa55rOV5piv5ZCm5q2j5Zyo562J5b6F6KiI5pmC5ZmoY2FsbGJhY2vkuK1cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0g5Y6f5pys57aB5a6a6Kmy6KiI5pmC5Zmo55qE5pa55rOVXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIOi/lOWbnueVtuWJjXRoaXMuZ2V0U2NoZWR1bGVUYWdbXeWft+ihjOS4reeahGluZGV45L2N572uLOWmguaenOipsumZo+WIl+WFp+eEoeipsuaWueazlSzov5Tlm54tMVxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tTY2hlZHVsZUNhbGxGdW5JbmRleChjYWxsYmFjazogRnVuY3Rpb24pOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyO1xyXG4gICAgICAgIGlmICh0aGlzLmdldFNjaGVkdWxlVGFnKCkuaW5kZXhPZihjYWxsYmFjaykgIT0gLTEpIHtcclxuICAgICAgICAgICAgaW5kZXggPSB0aGlzLnNjaGVkdWxlVGFnLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nZXRTY2hlZHVsZVRhZygpLmluZGV4T2YoY2FsbGJhY2sucHJvdG90eXBlKSAhPSAtMSkge1xyXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuc2NoZWR1bGVUYWcuaW5kZXhPZihjYWxsYmFjay5wcm90b3R5cGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56K66KqN55W25YmN6Kmy5pa55rOV5Lul55Sa6bq85b2i5byP5Z+36KGM55qELOWOn+Wei+mPiCBvciDln7rnpI7mlrnms5VcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0g5Y6f5pys57aB5a6a6Kmy6KiI5pmC5Zmo55qE5pa55rOVXHJcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IC0g6L+U5Zue55W25YmNdGhpcy5nZXRTY2hlZHVsZVRhZ1td5YWn55qE6Kmy5pa55rOVLOWmguaenOipsumZo+WIl+WFp+eEoeipsuaWueazlSzov5Tlm551bmRlZmluZWRcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGNoZWNrU2NoZWR1bGVUYWcoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xyXG4gICAgICAgIGxldCBmdW46IEZ1bmN0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuY2hlY2tTY2hlZHVsZUNhbGxGdW5JbmRleChjYWxsYmFjayk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgZnVuID0gdGhpcy5zY2hlZHVsZVRhZ1tpbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmdW47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTnlbbliY3miYDmnInkvb/nlKjkuK3nmoToqIjmmYLlmags6aGN5aSW5paw5aKe5riF56m66KiI5pmC5Zmo5pW46YeP5pa55rOVLOiIh+WOn+eJiGNvY29z5L2/55So5LiK5Lim54Sh5beu5YilXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzKCk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLnVuc2NoZWR1bGVBbGxDYWxsYmFja3MoKTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlVGFnLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICB2YXIgaVxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHxcbiAgICAgIHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAyKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMSkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArXG4gICAgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9XG4gICAgICAoKHVpbnQ4W2ldIDw8IDE2KSAmIDB4RkYwMDAwKSArXG4gICAgICAoKHVpbnQ4W2kgKyAxXSA8PCA4KSAmIDB4RkYwMCkgK1xuICAgICAgKHVpbnQ4W2kgKyAyXSAmIDB4RkYpXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG52YXIgS19NQVhfTEVOR1RIID0gMHg3ZmZmZmZmZlxuZXhwb3J0cy5rTWF4TGVuZ3RoID0gS19NQVhfTEVOR1RIXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFByaW50IHdhcm5pbmcgYW5kIHJlY29tbWVuZCB1c2luZyBgYnVmZmVyYCB2NC54IHdoaWNoIGhhcyBhbiBPYmplY3RcbiAqICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIFdlIHJlcG9ydCB0aGF0IHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGlmIHRoZSBhcmUgbm90IHN1YmNsYXNzYWJsZVxuICogdXNpbmcgX19wcm90b19fLiBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YFxuICogKFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4KS4gSUUgMTAgbGFja3Mgc3VwcG9ydFxuICogZm9yIF9fcHJvdG9fXyBhbmQgaGFzIGEgYnVnZ3kgdHlwZWQgYXJyYXkgaW1wbGVtZW50YXRpb24uXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5pZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgJ1RoaXMgYnJvd3NlciBsYWNrcyB0eXBlZCBhcnJheSAoVWludDhBcnJheSkgc3VwcG9ydCB3aGljaCBpcyByZXF1aXJlZCBieSAnICtcbiAgICAnYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4nXG4gIClcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICAvLyBDYW4gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWQ/XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHsgX19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9IH1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MlxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdwYXJlbnQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ5dGVPZmZzZXRcbiAgfVxufSlcblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgbGVuZ3RoICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgYnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGJ1ZlxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdUaGUgXCJzdHJpbmdcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAhPSBudWxsICYmXG4gICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgdmFsdWU6IG51bGwsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuZnVuY3Rpb24gZnJvbSAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh2YWx1ZSlcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICcgK1xuICAgICAgJ29yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHZhbHVlKVxuICAgIClcbiAgfVxuXG4gIGlmIChpc0luc3RhbmNlKHZhbHVlLCBBcnJheUJ1ZmZlcikgfHxcbiAgICAgICh2YWx1ZSAmJiBpc0luc3RhbmNlKHZhbHVlLmJ1ZmZlciwgQXJyYXlCdWZmZXIpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICApXG4gIH1cblxuICB2YXIgdmFsdWVPZiA9IHZhbHVlLnZhbHVlT2YgJiYgdmFsdWUudmFsdWVPZigpXG4gIGlmICh2YWx1ZU9mICE9IG51bGwgJiYgdmFsdWVPZiAhPT0gdmFsdWUpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odmFsdWVPZiwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgdmFyIGIgPSBmcm9tT2JqZWN0KHZhbHVlKVxuICBpZiAoYikgcmV0dXJuIGJcblxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvUHJpbWl0aXZlICE9IG51bGwgJiZcbiAgICAgIHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFxuICAgICAgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSgnc3RyaW5nJyksIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aFxuICAgIClcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICcgK1xuICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIE5vdGU6IENoYW5nZSBwcm90b3R5cGUgKmFmdGVyKiBCdWZmZXIuZnJvbSBpcyBkZWZpbmVkIHRvIHdvcmthcm91bmQgQ2hyb21lIGJ1Zzpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvMTQ4XG5CdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG5CdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgc2l6ZSArICdcIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gXCJzaXplXCInKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSBidWYud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIGJ1ZiA9IGJ1Zi5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyIChhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcIm9mZnNldFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wibGVuZ3RoXCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIHZhciBidWZcbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAob2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgIH1cbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gIH1cblxuICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlICYmXG4gICAgYiAhPT0gQnVmZmVyLnByb3RvdHlwZSAvLyBzbyBCdWZmZXIuaXNCdWZmZXIoQnVmZmVyLnByb3RvdHlwZSkgd2lsbCBiZSBmYWxzZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYSwgVWludDhBcnJheSkpIGEgPSBCdWZmZXIuZnJvbShhLCBhLm9mZnNldCwgYS5ieXRlTGVuZ3RoKVxuICBpZiAoaXNJbnN0YW5jZShiLCBVaW50OEFycmF5KSkgYiA9IEJ1ZmZlci5mcm9tKGIsIGIub2Zmc2V0LCBiLmJ5dGVMZW5ndGgpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcImJ1ZjFcIiwgXCJidWYyXCIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknXG4gICAgKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKGlzSW5zdGFuY2UoYnVmLCBVaW50OEFycmF5KSkge1xuICAgICAgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBpc0luc3RhbmNlKHN0cmluZywgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJzdHJpbmdcIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBvciBBcnJheUJ1ZmZlci4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIHN0cmluZ1xuICAgIClcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBtdXN0TWF0Y2ggPSAoYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdID09PSB0cnVlKVxuICBpZiAoIW11c3RNYXRjaCAmJiBsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHtcbiAgICAgICAgICByZXR1cm4gbXVzdE1hdGNoID8gLTEgOiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICB9XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhpcyBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIChhbmQgdGhlIGBpcy1idWZmZXJgIG5wbSBwYWNrYWdlKVxuLy8gdG8gZGV0ZWN0IGEgQnVmZmVyIGluc3RhbmNlLiBJdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgYGluc3RhbmNlb2YgQnVmZmVyYFxuLy8gcmVsaWFibHkgaW4gYSBicm93c2VyaWZ5IGNvbnRleHQgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBkaWZmZXJlbnRcbi8vIGNvcGllcyBvZiB0aGUgJ2J1ZmZlcicgcGFja2FnZSBpbiB1c2UuIFRoaXMgbWV0aG9kIHdvcmtzIGV2ZW4gZm9yIEJ1ZmZlclxuLy8gaW5zdGFuY2VzIHRoYXQgd2VyZSBjcmVhdGVkIGZyb20gYW5vdGhlciBjb3B5IG9mIHRoZSBgYnVmZmVyYCBwYWNrYWdlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTU0XG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nID0gQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZ1xuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLnJlcGxhY2UoLyguezJ9KS9nLCAnJDEgJykudHJpbSgpXG4gIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKGlzSW5zdGFuY2UodGFyZ2V0LCBVaW50OEFycmF5KSkge1xuICAgIHRhcmdldCA9IEJ1ZmZlci5mcm9tKHRhcmdldCwgdGFyZ2V0Lm9mZnNldCwgdGFyZ2V0LmJ5dGVMZW5ndGgpXG4gIH1cbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidGFyZ2V0XCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB0YXJnZXQpXG4gICAgKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBVc2UgYnVpbHQtaW4gd2hlbiBhdmFpbGFibGUsIG1pc3NpbmcgZnJvbSBJRTExXG4gICAgdGhpcy5jb3B5V2l0aGluKHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKVxuICB9IGVsc2UgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yICh2YXIgaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyB2YWwgK1xuICAgICAgICAnXCIgaXMgaW52YWxpZCBmb3IgYXJndW1lbnQgXCJ2YWx1ZVwiJylcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSB0YWtlcyBlcXVhbCBzaWducyBhcyBlbmQgb2YgdGhlIEJhc2U2NCBlbmNvZGluZ1xuICBzdHIgPSBzdHIuc3BsaXQoJz0nKVswXVxuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbi8vIEFycmF5QnVmZmVyIG9yIFVpbnQ4QXJyYXkgb2JqZWN0cyBmcm9tIG90aGVyIGNvbnRleHRzIChpLmUuIGlmcmFtZXMpIGRvIG5vdCBwYXNzXG4vLyB0aGUgYGluc3RhbmNlb2ZgIGNoZWNrIGJ1dCB0aGV5IHNob3VsZCBiZSB0cmVhdGVkIGFzIG9mIHRoYXQgdHlwZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNJbnN0YW5jZSAob2JqLCB0eXBlKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiB0eXBlIHx8XG4gICAgKG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lICE9IG51bGwgJiZcbiAgICAgIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlLm5hbWUpXG59XG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIC8vIEZvciBJRTExIHN1cHBvcnRcbiAgcmV0dXJuIG9iaiAhPT0gb2JqIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG4iLCIvKiEgaWVlZTc1NC4gQlNELTMtQ2xhdXNlIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPiAqL1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmlmICh0eXBlb2Ygc2V0VGltZW91dCAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc2V0VGltZW91dC5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7IH07XG5pZiAodHlwZW9mIGNsZWFyVGltZW91dCAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKSB7IGNsZWFyVGltZW91dC5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7IH07XG5pZiAodHlwZW9mIHNldEludGVydmFsICE9PSAndW5kZWZpbmVkJykgZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc2V0SW50ZXJ2YWwuYXBwbHkod2luZG93LCBhcmd1bWVudHMpOyB9O1xuaWYgKHR5cGVvZiBjbGVhckludGVydmFsICE9PSAndW5kZWZpbmVkJykgZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24oKSB7IGNsZWFySW50ZXJ2YWwuYXBwbHkod2luZG93LCBhcmd1bWVudHMpOyB9O1xuXG4vLyBUT0RPOiBDaGFuZ2UgdG8gbW9yZSBlZmZpZWNpZW50IGxpc3QgYXBwcm9hY2ggdXNlZCBpbiBOb2RlLmpzXG4vLyBGb3Igbm93LCB3ZSBqdXN0IGltcGxlbWVudCB0aGUgQVBJcyB1c2luZyB0aGUgcHJpbWl0aXZlcyBhYm92ZS5cblxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBkZWxheSkge1xuICBpdGVtLl90aW1lb3V0SUQgPSBzZXRUaW1lb3V0KGl0ZW0uX29uVGltZW91dCwgZGVsYXkpO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX3RpbWVvdXRJRCk7XG59O1xuXG5leHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgLy8gb3VyIG5haXZlIGltcGwgZG9lc24ndCBjYXJlIChjb3JyZWN0bmVzcyBpcyBzdGlsbCBwcmVzZXJ2ZWQpXG59O1xuXG5leHBvcnRzLnNldEltbWVkaWF0ZSA9IHJlcXVpcmUoJ3Byb2Nlc3MvYnJvd3Nlci5qcycpLm5leHRUaWNrO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWljbTkzYzJWeUxYQmhZMnN2WDNCeVpXeDFaR1V1YW5NaUxDSkJSMlZ1WlhKcFkxUmxiWEJzWVhSbExuUnpJaXdpVDNabGNuSnBaR1ZEYjIxd2IyNWxiblF1ZEhNaUxDSXVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZbUZ6WlRZMExXcHpMMmx1WkdWNExtcHpJaXdpTGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJKMVptWmxjaTlwYm1SbGVDNXFjeUlzSWk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5cFpXVmxOelUwTDJsdVpHVjRMbXB6SWl3aUxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwzQnliMk5sYzNNdlluSnZkM05sY2k1cWN5SXNJaTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTkwYVcxbGNuTXRZbkp2ZDNObGNtbG1lUzl0WVdsdUxtcHpJaXdpTGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDNScGJXVnljeTFpY205M2MyVnlhV1o1TDI1dlpHVmZiVzlrZFd4bGN5OXdjbTlqWlhOekwySnliM2R6WlhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3pzN1FVTkJRVHM3T3pzN1QwRkxUenRCUVVOUUxESkVRVUZ2UkR0QlFVVndSQ3hOUVVFNFFpeG5Ra0ZCYVVJc1UwRkJVU3d5UWtGQmFVSTdTVUZaYUVVN096dFBRVWRITzBsQlEwOHNUVUZCVFR0UlFVTmFMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF6dEpRVU53UWl4RFFVRkRPMGxCUlZNc1MwRkJTenRSUVVOWUxFbEJRVWtzUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXp0SlFVTXpRaXhEUVVGRE8wTkJRMG83UVVGMlFrd3NiVU5CZFVKTE96czdPenM3TzBGREwwSk1PenM3T3p0SFFVdEhPMEZCUTBnc1RVRkJjVUlzYVVKQlFXdENMRk5CUVZFc1JVRkJSU3hEUVVGRExGTkJRVk03U1VGVGRrUTdVVUZEU1N4TFFVRkxMRVZCUVVVc1EwRkJRenRSUVVOU0xFbEJRVWtzUTBGQlF5eFhRVUZYTEVkQlFVY3NTVUZCU1N4TFFVRkxMRVZCUVZrc1EwRkJRenRKUVVNM1F5eERRVUZETzBsQlJVUTdPenRQUVVkSE8wbEJRMDhzWTBGQll6dFJRVU53UWl4UFFVRlBMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU03U1VGRE5VSXNRMEZCUXp0SlFVVkVPenM3VDBGSFJ6dEpRVU5QTEdsQ1FVRnBRanRSUVVOMlFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRE8wbEJRMjVETEVOQlFVTTdTVUZGUkRzN096czdPMDlCVFVjN1NVRkRTU3hSUVVGUkxFTkJRVU1zVVVGQmEwSXNSVUZCUlN4UlFVRnBRaXhGUVVGRkxFMUJRV1VzUlVGQlJTeExRVUZqTzFGQlEyeEdMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEcxQ1FVRnRRaXhEUVVGRExGRkJRVkVzUlVGQlJTeE5RVUZOTEVOQlFVTXNSVUZCUlN4UlFVRlJMRVZCUVVVc1RVRkJUU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzFGQlEzQkdMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMGxCUTNCRExFTkJRVU03U1VGRlJEczdPMDlCUjBjN1NVRkRUeXh0UWtGQmJVSXNRMEZCUXl4UlFVRlJMRVZCUVVVc1RVRkJUVHRSUVVNeFF5eEpRVUZKTEUxQlFVMHNSMEZCUnl4RFFVRkRMRVZCUVVVN1dVRkRXaXhSUVVGUkxFTkJRVU1zVTBGQlV5eEhRVUZITEVkQlFVY3NSVUZCUlR0blFrRkRkRUlzVFVGQlRTeEZRVUZGTEVOQlFVTTdaMEpCUTFRc1NVRkJTU3hOUVVGTkxFZEJRVWNzUTBGQlF6dHZRa0ZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzJkQ1FVTXhReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMWxCUTNwQ0xFTkJRVU1zUTBGQlFUdFRRVU5LTzJGQlFVMDdXVUZEU0N4UFFVRlBMRkZCUVZFc1EwRkJRenRUUVVOdVFqdFJRVU5FTEU5QlFVOHNVVUZCVVN4RFFVRkRMRk5CUVZNc1EwRkJRenRKUVVNNVFpeERRVUZETzBsQlJVUTdPenM3VDBGSlJ6dEpRVU5KTEZsQlFWa3NRMEZCUXl4UlFVRnJRaXhGUVVGRkxFdEJRV003VVVGRGJFUXNVVUZCVVN4RFFVRkRMRk5CUVZNc1IwRkJSeXhIUVVGSExFVkJRVVU3V1VGRGRFSXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdXVUZEY0VNc1VVRkJVU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTjZRaXhEUVVGRExFTkJRVUU3VVVGRFJDeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRkZCUVZFc1EwRkJReXhUUVVGVExFVkJRVVVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVOdVJDeERRVUZETzBsQlJVUTdPenRQUVVkSE8wbEJRMGtzVlVGQlZTeERRVUZETEZGQlFXdENPMUZCUTJoRExFdEJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRiRVFzU1VGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMSGxDUVVGNVFpeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUTNKRUxFbEJRVWtzUzBGQlN5eEhRVUZITEVOQlFVTXNRMEZCUXl4RlFVRkZPMWxCUTFvc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8xTkJRM0pETzBsQlEwd3NRMEZCUXp0SlFVVkVPenM3T3p0UFFVdEhPMGxCUTA4c2VVSkJRWGxDTEVOQlFVTXNVVUZCYTBJN1VVRkRiRVFzU1VGQlNTeExRVUZoTEVOQlFVTTdVVUZEYkVJc1NVRkJTU3hKUVVGSkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eEZRVUZGTzFsQlF5OURMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRUUVVNNVF6dGhRVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkRMR05CUVdNc1JVRkJSU3hEUVVGRExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFVkJRVVU3V1VGRGFFVXNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRUUVVONFJEdGhRVUZOTzFsQlEwZ3NUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVOaU8xRkJRMFFzVDBGQlR5eExRVUZMTEVOQlFVTTdTVUZEYWtJc1EwRkJRenRKUVVWRU96czdPenRQUVV0SE8wbEJRMDhzWjBKQlFXZENMRU5CUVVNc1VVRkJhMEk3VVVGRGVrTXNTVUZCU1N4SFFVRkhMRWRCUVdFc1UwRkJVeXhEUVVGRE8xRkJRemxDTEVsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVOeVJDeEpRVUZKTEV0QlFVc3NSMEZCUnl4RFFVRkRMRU5CUVVNc1JVRkJSVHRaUVVOYUxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8xTkJRMnBETzFGQlEwUXNUMEZCVHl4SFFVRkhMRU5CUVVNN1NVRkRaaXhEUVVGRE8wbEJSVVE3TzA5QlJVYzdTVUZEU1N4elFrRkJjMEk3VVVGRGVrSXNTMEZCU3l4RFFVRkRMSE5DUVVGelFpeEZRVUZGTEVOQlFVTTdVVUZETDBJc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUTJoRExFTkJRVU03UTBGRFNqdEJRVFZJUkN4dlEwRTBTRU03T3pzN08wRkRiRWxFTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96czdPenRCUTNSS1FUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenM3T3p0QlEycDJSRUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN096czdRVU55UmtFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdPenM3UVVONFRFRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96czdPenRCUTNaQ1FUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpaG1kVzVqZEdsdmJpZ3BlMloxYm1OMGFXOXVJSElvWlN4dUxIUXBlMloxYm1OMGFXOXVJRzhvYVN4bUtYdHBaaWdoYmx0cFhTbDdhV1lvSVdWYmFWMHBlM1poY2lCalBWd2lablZ1WTNScGIyNWNJajA5ZEhsd1pXOW1JSEpsY1hWcGNtVW1KbkpsY1hWcGNtVTdhV1lvSVdZbUptTXBjbVYwZFhKdUlHTW9hU3doTUNrN2FXWW9kU2x5WlhSMWNtNGdkU2hwTENFd0tUdDJZWElnWVQxdVpYY2dSWEp5YjNJb1hDSkRZVzV1YjNRZ1ptbHVaQ0J0YjJSMWJHVWdKMXdpSzJrclhDSW5YQ0lwTzNSb2NtOTNJR0V1WTI5a1pUMWNJazFQUkZWTVJWOU9UMVJmUms5VlRrUmNJaXhoZlhaaGNpQndQVzViYVYwOWUyVjRjRzl5ZEhNNmUzMTlPMlZiYVYxYk1GMHVZMkZzYkNod0xtVjRjRzl5ZEhNc1puVnVZM1JwYjI0b2NpbDdkbUZ5SUc0OVpWdHBYVnN4WFZ0eVhUdHlaWFIxY200Z2J5aHVmSHh5S1gwc2NDeHdMbVY0Y0c5eWRITXNjaXhsTEc0c2RDbDljbVYwZFhKdUlHNWJhVjB1Wlhod2IzSjBjMzFtYjNJb2RtRnlJSFU5WENKbWRXNWpkR2x2Ymx3aVBUMTBlWEJsYjJZZ2NtVnhkV2x5WlNZbWNtVnhkV2x5WlN4cFBUQTdhVHgwTG14bGJtZDBhRHRwS3lzcGJ5aDBXMmxkS1R0eVpYUjFjbTRnYjMxeVpYUjFjbTRnY24wcEtDa2lMQ0l2S2lwY2NseHVJQ0FnSUNBcUlFQkJkWFJvYjNJZ1dFbEJUeTFNU1MxUVNVNWNjbHh1SUNBZ0lDQXFJRUJFWlhOamNtbHdkR2x2YmlEcGdKcm5sS2ptcUtIbW5iOWNjbHh1SUNBZ0lDQXFJRUJFWVhSbElESXdNakV0TURRdE1UUWc1TGlMNVkySUlESXdPakkwWEhKY2JpQWdJQ0FnS2lCQVZtVnljMmx2YmlBeExqRmNjbHh1SUNBZ0lDQXFMMXh5WEc1cGJYQnZjblFnVDNabGNuSnBaR1ZEYjIxd2IyNWxiblFnWm5KdmJTQmNJaTR2VDNabGNuSnBaR1ZEYjIxd2IyNWxiblJjSWp0Y2NseHVYSEpjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR0ZpYzNSeVlXTjBJR05zWVhOeklFRkhaVzVsY21salZHVnRjR3hoZEdVZ1pYaDBaVzVrY3lCUGRtVnljbWxrWlVOdmJYQnZibVZ1ZENCN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDQWdJQ0FxSU9pSHF1aW9ndWUrcWVXSW5lV25pK2VMZ09hRmkxeHlYRzRnSUNBZ0lDQWdJQ0FxTDF4eVhHNGdJQ0FnSUNBZ0lIQnliM1JsWTNSbFpDQmhZbk4wY21GamRDQnZia055WldGMFpTZ3BPaUIyYjJsa08xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdktpcGNjbHh1SUNBZ0lDQWdJQ0FnS2lEb3FwN25zN3ZvcUszbnZhNWNjbHh1SUNBZ0lDQWdJQ0FnS2k5Y2NseHVJQ0FnSUNBZ0lDQndjbTkwWldOMFpXUWdZV0p6ZEhKaFkzUWdiR0Z1WjNWaFoyVlRaWFIwYVc1bktDazZJSFp2YVdRN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDQWdJQ0FxSU9TNGdPVytpK1M5ditlVXFHOXVRM0psWVhSbEtDa2c1THVqNXB1L0lDQnZia3h2WVdRb0tWeHlYRzRnSUNBZ0lDQWdJQ0FxSUVCd2NtOTBaV04wWldSY2NseHVJQ0FnSUNBZ0lDQWdLaTljY2x4dUlDQWdJQ0FnSUNCd2NtOTBaV04wWldRZ2IyNU1iMkZrS0NrNklIWnZhV1FnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtOXVRM0psWVhSbEtDazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J3Y205MFpXTjBaV1FnYzNSaGNuUW9LVG9nZG05cFpDQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YkdGdVozVmhaMlZUWlhSMGFXNW5LQ2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZTSXNJaThxS2x4eVhHNGdLaUJBUVhWMGFHOXlJRmhKUVU4dFRFa3RVRWxPWEhKY2JpQXFJRUJFWlhOamNtbHdkR2x2YmlBb1QzWmxjbkpwWkdVcDVwTzA1YkdWWTJNdVEyOXRjRzl1Wlc1MFhISmNiaUFxSUVCRVlYUmxJREl3TWpFdE1EVXRNamdnNUxpSzVZMklJREV3T2pFeFhISmNiaUFxSUVCV1pYSnphVzl1SURFdU1GeHlYRzRnS2k5Y2NseHVaWGh3YjNKMElHUmxabUYxYkhRZ1kyeGhjM01nVDNabGNuSnBaR1ZEYjIxd2IyNWxiblFnWlhoMFpXNWtjeUJqWXk1RGIyMXdiMjVsYm5RZ2UxeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzVMK2Q1YTJZNTVXMjVZbU41TDIvNTVTbzVMaXQ1NXFFNktpSTVwbUM1Wm1vNXBhNTVyT1ZMT1dtZ3VhZW5PaXBzdWlvaU9hWmd1V1pxT1dmdCtpaGpPV3VqQ3ptbklQb2g2cmxpNVhtdUlYbnFicm9xYkxtbHJubXM1VmNjbHh1SUNBZ0lDQXFJRUIwZVhCbElIdEJjbkpoZVR4R2RXNWpkR2x2Ymo1OVhISmNiaUFnSUNBZ0tpQkFjSEpwZG1GMFpWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQndjbWwyWVhSbElISmxZV1J2Ym14NUlITmphR1ZrZFd4bFZHRm5PaUJCY25KaGVUeEdkVzVqZEdsdmJqNDdYSEpjYmx4eVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb0tTQjdYSEpjYmlBZ0lDQWdJQ0FnYzNWd1pYSW9LVHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbk5qYUdWa2RXeGxWR0ZuSUQwZ2JtVjNJRUZ5Y21GNVBFWjFibU4wYVc5dVBpZ3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2c1NDJ5NVkrVzU1VzI1WW1ONUwyLzU1U281TGl0NTVxRTZLaUk1cG1DNVptb1hISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdWN5QjdRWEp5WVhrOFJuVnVZM1JwYjI0K2ZWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQndjbTkwWldOMFpXUWdaMlYwVTJOb1pXUjFiR1ZVWVdjb0tUb2dRWEp5WVhrOFJuVnVZM1JwYjI0K0lIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1elkyaGxaSFZzWlZSaFp6dGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlPZU5zdVdQbHVlVnR1V0pqZW1DaE9Xd211YWNxdW1IaSthVXZ1ZWFoT2lvaU9hWmd1V1pxT2FWdU9tSGoxeHlYRzRnSUNBZ0lDb2dRSEpsZEhWeWJuTWdlMjUxYldKbGNuMWNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdjSEp2ZEdWamRHVmtJR2RsZEZOamFHVmtkV3hsUVcxdmRXNTBLQ2s2SUc1MWJXSmxjaUI3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjMk5vWldSMWJHVlVZV2N1YkdWdVozUm9PMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2c1WSt2NllHNDViNnE1NUt3NXF5aDVwVzQ2S2lJNXBtQzVabW9MT21oamVXa2x1YVdzT1dpbnVXaW51V0tvT1MvbmVXdG1PUzl2K2VVcU9TNHJlZWFoT2lvaU9hWmd1V1pxT2FXdWVhemxTem9pSWZsanAvbmlZaGpiMk52YytTOXYrZVVxT1M0aXVTNHB1ZUVvZVczcnVXSXBWeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdZMkZzYkdKaFkyc2dMU0RvdjVUbG01N21scm5tczVWY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN2JuVnRZbVZ5ZlNCcGJuUmxjblpoYkNBdElPbVdrK2Fndk9hWmd1bVdrMXh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHR1ZFcxaVpYSjlJSEpsY0dWaGRDQXRJT21IamVpa2grYXNvZWFWdUZ4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEo5SUdSbGJHRjVJQzBnNWJ1MjZZR3k1cG1DNlphVFhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIQjFZbXhwWXlCelkyaGxaSFZzWlNoallXeHNZbUZqYXpvZ1JuVnVZM1JwYjI0c0lHbHVkR1Z5ZG1Gc1B6b2diblZ0WW1WeUxDQnlaWEJsWVhRL09pQnVkVzFpWlhJc0lHUmxiR0Y1UHpvZ2JuVnRZbVZ5S1RvZ2RtOXBaQ0I3WEhKY2JpQWdJQ0FnSUNBZ2MzVndaWEl1YzJOb1pXUjFiR1VvZEdocGN5NWphR1ZqYTFOamFHVmtkV3hsVW1Wd1pXRjBLR05oYkd4aVlXTnJMQ0J5WlhCbFlYUXBMQ0JwYm5SbGNuWmhiQ3dnY21Wd1pXRjBMQ0JrWld4aGVTazdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXpZMmhsWkhWc1pWUmhaeTV3ZFhOb0tHTmhiR3hpWVdOcktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlPZWl1dWlxamVlVnR1V0pqZWlvaU9hWmd1V1pxT2FZcitXUXB1YWNpZVM5ditlVXFPbUhqZWlraCthc29lYVZ1Rnh5WEc0Z0lDQWdJQ29nUUhCeWIzUmxZM1JsWkZ4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCd2NtOTBaV04wWldRZ1kyaGxZMnRUWTJobFpIVnNaVkpsY0dWaGRDaGpZV3hzWW1GamF5d2djbVZ3WldGMEtUb2dSblZ1WTNScGIyNGdlMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaHlaWEJsWVhRZ1BpQXdLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR05oYkd4aVlXTnJMbkJ5YjNSdmRIbHdaU0E5SUNncElEMCtJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGNHVmhkQzB0TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSEpsY0dWaGRDQThJREFwSUhSb2FYTXVkVzV6WTJobFpIVnNaU2hqWVd4c1ltRmpheWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCallXeHNZbUZqYXk1aGNIQnNlU2gwYUdsektUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCallXeHNZbUZqYXp0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR05oYkd4aVlXTnJMbkJ5YjNSdmRIbHdaVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJT1dXcnVhc29laW9pT2FaZ3VXWnFDenBvWTNscEpibWxyRGxvcDdsb3A3bGlxRGt2NTNsclpqa3ZiL25sS2prdUszbm1vVG9xSWptbVlMbG1ham1scm5tczVVczZJaUg1WTZmNTRtSVkyOWpiM1BrdmIvbmxLamt1SXJrdUtibmhLSGx0NjdsaUtWY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHTmhiR3hpWVdOcklDMGc2TCtVNVp1ZTVwYTU1ck9WWEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnWkdWc1lYa2dMU0RsdTdicGdiTG1tWUxwbHBOY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2NIVmliR2xqSUhOamFHVmtkV3hsVDI1alpTaGpZV3hzWW1GamF6b2dSblZ1WTNScGIyNHNJR1JsYkdGNVB6b2diblZ0WW1WeUtUb2dkbTlwWkNCN1hISmNiaUFnSUNBZ0lDQWdZMkZzYkdKaFkyc3VjSEp2ZEc5MGVYQmxJRDBnS0NrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5WdWMyTm9aV1IxYkdVb1kyRnNiR0poWTJzdWNISnZkRzkwZVhCbEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRnNiR0poWTJzdVlYQndiSGtvZEdocGN5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11YzJOb1pXUjFiR1VvWTJGc2JHSmhZMnN1Y0hKdmRHOTBlWEJsTENBd0xDQXdMQ0JrWld4aGVTazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRG11SVhwbWFUbGxxN2xnSXZvcUlqbW1ZTGxtYWptbHJubXM1VXM2YUdONWFTVzVwYXc1YUtlNVlpcTZabWs1TDIvNTVTbzVMaXQ1NXFFNktpSTVwbUM1Wm1vNTdTQTZZeUVMT2lJaCtXT24rZUppR052WTI5ejVMMi81NVNvNUxpSzVMaW01NFNoNWJldTVZaWxYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JqWVd4c1ltRmpheUF0SU9lVnR1V0luZWUyZ2VXdW11ZWFoT2FXdWVhemxWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQndkV0pzYVdNZ2RXNXpZMmhsWkhWc1pTaGpZV3hzWW1GamF6b2dSblZ1WTNScGIyNHBPaUIyYjJsa0lIdGNjbHh1SUNBZ0lDQWdJQ0J6ZFhCbGNpNTFibk5qYUdWa2RXeGxLSFJvYVhNdVkyaGxZMnRUWTJobFpIVnNaVlJoWnloallXeHNZbUZqYXlrcE8xeHlYRzRnSUNBZ0lDQWdJR3hsZENCcGJtUmxlQ0E5SUhSb2FYTXVZMmhsWTJ0VFkyaGxaSFZzWlVOaGJHeEdkVzVKYm1SbGVDaGpZV3hzWW1GamF5azdYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tHbHVaR1Y0SUQ0Z0xURXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1elkyaGxaSFZzWlZSaFp5NXpjR3hwWTJVb2FXNWtaWGdzSURFcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJT1dJcE9hV3QrZVZ0dVdKamVhV3VlYXpsZWFZcitXUXB1YXRvK1djcU9ldGllVytoZWlvaU9hWmd1V1pxR05oYkd4aVlXTnI1TGl0WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBaMWJtTjBhVzl1ZlNCallXeHNZbUZqYXlBdElPV09uK2Fjck9lMmdlV3VtdWlwc3Vpb2lPYVpndVdacU9lYWhPYVd1ZWF6bFZ4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5Ym5NZ2UyNTFiV0psY24wZ0xTRG92NVRsbTU3bmxiYmxpWTEwYUdsekxtZGxkRk5qYUdWa2RXeGxWR0ZuVzEzbG43Zm9vWXprdUszbm1vUnBibVJsZU9TOWplZTlyaXpscG9MbW5wem9xYkxwbWFQbGlKZmxoYWZuaEtIb3FiTG1scm5tczVVczZMK1U1WnVlTFRGY2NseHVJQ0FnSUNBcUlFQndjbTkwWldOMFpXUmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdjSEp2ZEdWamRHVmtJR05vWldOclUyTm9aV1IxYkdWRFlXeHNSblZ1U1c1a1pYZ29ZMkZzYkdKaFkyczZJRVoxYm1OMGFXOXVLVG9nYm5WdFltVnlJSHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdhVzVrWlhnNklHNTFiV0psY2p0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NW5aWFJUWTJobFpIVnNaVlJoWnlncExtbHVaR1Y0VDJZb1kyRnNiR0poWTJzcElDRTlJQzB4S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsdVpHVjRJRDBnZEdocGN5NXpZMmhsWkhWc1pWUmhaeTVwYm1SbGVFOW1LR05oYkd4aVlXTnJLVHRjY2x4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tIUm9hWE11WjJWMFUyTm9aV1IxYkdWVVlXY29LUzVwYm1SbGVFOW1LR05oYkd4aVlXTnJMbkJ5YjNSdmRIbHdaU2tnSVQwZ0xURXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhVzVrWlhnZ1BTQjBhR2x6TG5OamFHVmtkV3hsVkdGbkxtbHVaR1Y0VDJZb1kyRnNiR0poWTJzdWNISnZkRzkwZVhCbEtUdGNjbHh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z0xURTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCcGJtUmxlRHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJT2VpdXVpcWplZVZ0dVdKamVpcHN1YVd1ZWF6bGVTN3BlZVVtdW02dk9XOW91VzhqK1dmdCtpaGpPZWFoQ3psanAvbG5vdnBqNGdnYjNJZzVaKzY1NlNPNXBhNTVyT1ZYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JqWVd4c1ltRmpheUF0SU9XT24rYWNyT2UyZ2VXdW11aXBzdWlvaU9hWmd1V1pxT2VhaE9hV3VlYXpsVnh5WEc0Z0lDQWdJQ29nUUhKbGRIVnlibk1nZTBaMWJtTjBhVzl1ZlNBdElPaS9sT1dibnVlVnR1V0pqWFJvYVhNdVoyVjBVMk5vWldSMWJHVlVZV2RiWGVXRnArZWFoT2lwc3VhV3VlYXpsU3pscG9MbW5wem9xYkxwbWFQbGlKZmxoYWZuaEtIb3FiTG1scm5tczVVczZMK1U1WnVlZFc1a1pXWnBibVZrWEhKY2JpQWdJQ0FnS2lCQWNISnZkR1ZqZEdWa1hISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIQnliM1JsWTNSbFpDQmphR1ZqYTFOamFHVmtkV3hsVkdGbktHTmhiR3hpWVdOck9pQkdkVzVqZEdsdmJpazZJRVoxYm1OMGFXOXVJSHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdablZ1T2lCR2RXNWpkR2x2YmlBOUlIVnVaR1ZtYVc1bFpEdGNjbHh1SUNBZ0lDQWdJQ0JzWlhRZ2FXNWtaWGdnUFNCMGFHbHpMbU5vWldOclUyTm9aV1IxYkdWRFlXeHNSblZ1U1c1a1pYZ29ZMkZzYkdKaFkyc3BPMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaHBibVJsZUNBK0lDMHhLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1oxYmlBOUlIUm9hWE11YzJOb1pXUjFiR1ZVWVdkYmFXNWtaWGhkTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdablZ1TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nNXJpRjZabWs1NVcyNVltTjVvbUE1cHlKNUwyLzU1U281TGl0NTVxRTZLaUk1cG1DNVptb0xPbWhqZVdrbHVhV3NPV2ludWE0aGVlcHV1aW9pT2FaZ3VXWnFPYVZ1T21IaithV3VlYXpsU3pvaUlmbGpwL25pWWhqYjJOdmMrUzl2K2VVcU9TNGl1UzRwdWVFb2VXM3J1V0lwVnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0J3ZFdKc2FXTWdkVzV6WTJobFpIVnNaVUZzYkVOaGJHeGlZV05yY3lncE9pQjJiMmxrSUh0Y2NseHVJQ0FnSUNBZ0lDQnpkWEJsY2k1MWJuTmphR1ZrZFd4bFFXeHNRMkZzYkdKaFkydHpLQ2s3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WTJobFpIVnNaVlJoWnk1c1pXNW5kR2dnUFNBd08xeHlYRzRnSUNBZ2ZWeHlYRzU5SWl3aUozVnpaU0J6ZEhKcFkzUW5YRzVjYm1WNGNHOXlkSE11WW5sMFpVeGxibWQwYUNBOUlHSjVkR1ZNWlc1bmRHaGNibVY0Y0c5eWRITXVkRzlDZVhSbFFYSnlZWGtnUFNCMGIwSjVkR1ZCY25KaGVWeHVaWGh3YjNKMGN5NW1jbTl0UW5sMFpVRnljbUY1SUQwZ1puSnZiVUo1ZEdWQmNuSmhlVnh1WEc1MllYSWdiRzl2YTNWd0lEMGdXMTFjYm5aaGNpQnlaWFpNYjI5cmRYQWdQU0JiWFZ4dWRtRnlJRUZ5Y2lBOUlIUjVjR1Z2WmlCVmFXNTBPRUZ5Y21GNUlDRTlQU0FuZFc1a1pXWnBibVZrSnlBL0lGVnBiblE0UVhKeVlYa2dPaUJCY25KaGVWeHVYRzUyWVhJZ1kyOWtaU0E5SUNkQlFrTkVSVVpIU0VsS1MweE5UazlRVVZKVFZGVldWMWhaV21GaVkyUmxabWRvYVdwcmJHMXViM0J4Y25OMGRYWjNlSGw2TURFeU16UTFOamM0T1NzdkoxeHVabTl5SUNoMllYSWdhU0E5SURBc0lHeGxiaUE5SUdOdlpHVXViR1Z1WjNSb095QnBJRHdnYkdWdU95QXJLMmtwSUh0Y2JpQWdiRzl2YTNWd1cybGRJRDBnWTI5a1pWdHBYVnh1SUNCeVpYWk1iMjlyZFhCYlkyOWtaUzVqYUdGeVEyOWtaVUYwS0drcFhTQTlJR2xjYm4xY2JseHVMeThnVTNWd2NHOXlkQ0JrWldOdlpHbHVaeUJWVWt3dGMyRm1aU0JpWVhObE5qUWdjM1J5YVc1bmN5d2dZWE1nVG05a1pTNXFjeUJrYjJWekxseHVMeThnVTJWbE9pQm9kSFJ3Y3pvdkwyVnVMbmRwYTJsd1pXUnBZUzV2Y21jdmQybHJhUzlDWVhObE5qUWpWVkpNWDJGd2NHeHBZMkYwYVc5dWMxeHVjbVYyVEc5dmEzVndXeWN0Snk1amFHRnlRMjlrWlVGMEtEQXBYU0E5SURZeVhHNXlaWFpNYjI5cmRYQmJKMThuTG1Ob1lYSkRiMlJsUVhRb01DbGRJRDBnTmpOY2JseHVablZ1WTNScGIyNGdaMlYwVEdWdWN5QW9ZalkwS1NCN1hHNGdJSFpoY2lCc1pXNGdQU0JpTmpRdWJHVnVaM1JvWEc1Y2JpQWdhV1lnS0d4bGJpQWxJRFFnUGlBd0tTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkSmJuWmhiR2xrSUhOMGNtbHVaeTRnVEdWdVozUm9JRzExYzNRZ1ltVWdZU0J0ZFd4MGFYQnNaU0J2WmlBMEp5bGNiaUFnZlZ4dVhHNGdJQzh2SUZSeWFXMGdiMlptSUdWNGRISmhJR0o1ZEdWeklHRm1kR1Z5SUhCc1lXTmxhRzlzWkdWeUlHSjVkR1Z6SUdGeVpTQm1iM1Z1WkZ4dUlDQXZMeUJUWldVNklHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOWlaV0YwWjJGdGJXbDBMMkpoYzJVMk5DMXFjeTlwYzNOMVpYTXZOREpjYmlBZ2RtRnlJSFpoYkdsa1RHVnVJRDBnWWpZMExtbHVaR1Y0VDJZb0p6MG5LVnh1SUNCcFppQW9kbUZzYVdSTVpXNGdQVDA5SUMweEtTQjJZV3hwWkV4bGJpQTlJR3hsYmx4dVhHNGdJSFpoY2lCd2JHRmpaVWh2YkdSbGNuTk1aVzRnUFNCMllXeHBaRXhsYmlBOVBUMGdiR1Z1WEc0Z0lDQWdQeUF3WEc0Z0lDQWdPaUEwSUMwZ0tIWmhiR2xrVEdWdUlDVWdOQ2xjYmx4dUlDQnlaWFIxY200Z1czWmhiR2xrVEdWdUxDQndiR0ZqWlVodmJHUmxjbk5NWlc1ZFhHNTlYRzVjYmk4dklHSmhjMlUyTkNCcGN5QTBMek1nS3lCMWNDQjBieUIwZDI4Z1kyaGhjbUZqZEdWeWN5QnZaaUIwYUdVZ2IzSnBaMmx1WVd3Z1pHRjBZVnh1Wm5WdVkzUnBiMjRnWW5sMFpVeGxibWQwYUNBb1lqWTBLU0I3WEc0Z0lIWmhjaUJzWlc1eklEMGdaMlYwVEdWdWN5aGlOalFwWEc0Z0lIWmhjaUIyWVd4cFpFeGxiaUE5SUd4bGJuTmJNRjFjYmlBZ2RtRnlJSEJzWVdObFNHOXNaR1Z5YzB4bGJpQTlJR3hsYm5OYk1WMWNiaUFnY21WMGRYSnVJQ2dvZG1Gc2FXUk1aVzRnS3lCd2JHRmpaVWh2YkdSbGNuTk1aVzRwSUNvZ015QXZJRFFwSUMwZ2NHeGhZMlZJYjJ4a1pYSnpUR1Z1WEc1OVhHNWNibVoxYm1OMGFXOXVJRjlpZVhSbFRHVnVaM1JvSUNoaU5qUXNJSFpoYkdsa1RHVnVMQ0J3YkdGalpVaHZiR1JsY25OTVpXNHBJSHRjYmlBZ2NtVjBkWEp1SUNnb2RtRnNhV1JNWlc0Z0t5QndiR0ZqWlVodmJHUmxjbk5NWlc0cElDb2dNeUF2SURRcElDMGdjR3hoWTJWSWIyeGtaWEp6VEdWdVhHNTlYRzVjYm1aMWJtTjBhVzl1SUhSdlFubDBaVUZ5Y21GNUlDaGlOalFwSUh0Y2JpQWdkbUZ5SUhSdGNGeHVJQ0IyWVhJZ2JHVnVjeUE5SUdkbGRFeGxibk1vWWpZMEtWeHVJQ0IyWVhJZ2RtRnNhV1JNWlc0Z1BTQnNaVzV6V3pCZFhHNGdJSFpoY2lCd2JHRmpaVWh2YkdSbGNuTk1aVzRnUFNCc1pXNXpXekZkWEc1Y2JpQWdkbUZ5SUdGeWNpQTlJRzVsZHlCQmNuSW9YMko1ZEdWTVpXNW5kR2dvWWpZMExDQjJZV3hwWkV4bGJpd2djR3hoWTJWSWIyeGtaWEp6VEdWdUtTbGNibHh1SUNCMllYSWdZM1Z5UW5sMFpTQTlJREJjYmx4dUlDQXZMeUJwWmlCMGFHVnlaU0JoY21VZ2NHeGhZMlZvYjJ4a1pYSnpMQ0J2Ym14NUlHZGxkQ0IxY0NCMGJ5QjBhR1VnYkdGemRDQmpiMjF3YkdWMFpTQTBJR05vWVhKelhHNGdJSFpoY2lCc1pXNGdQU0J3YkdGalpVaHZiR1JsY25OTVpXNGdQaUF3WEc0Z0lDQWdQeUIyWVd4cFpFeGxiaUF0SURSY2JpQWdJQ0E2SUhaaGJHbGtUR1Z1WEc1Y2JpQWdkbUZ5SUdsY2JpQWdabTl5SUNocElEMGdNRHNnYVNBOElHeGxianNnYVNBclBTQTBLU0I3WEc0Z0lDQWdkRzF3SUQxY2JpQWdJQ0FnSUNoeVpYWk1iMjlyZFhCYllqWTBMbU5vWVhKRGIyUmxRWFFvYVNsZElEdzhJREU0S1NCOFhHNGdJQ0FnSUNBb2NtVjJURzl2YTNWd1cySTJOQzVqYUdGeVEyOWtaVUYwS0drZ0t5QXhLVjBnUER3Z01USXBJSHhjYmlBZ0lDQWdJQ2h5WlhaTWIyOXJkWEJiWWpZMExtTm9ZWEpEYjJSbFFYUW9hU0FySURJcFhTQThQQ0EyS1NCOFhHNGdJQ0FnSUNCeVpYWk1iMjlyZFhCYllqWTBMbU5vWVhKRGIyUmxRWFFvYVNBcklETXBYVnh1SUNBZ0lHRnljbHRqZFhKQ2VYUmxLeXRkSUQwZ0tIUnRjQ0ErUGlBeE5pa2dKaUF3ZUVaR1hHNGdJQ0FnWVhKeVcyTjFja0o1ZEdVcksxMGdQU0FvZEcxd0lENCtJRGdwSUNZZ01IaEdSbHh1SUNBZ0lHRnljbHRqZFhKQ2VYUmxLeXRkSUQwZ2RHMXdJQ1lnTUhoR1JseHVJQ0I5WEc1Y2JpQWdhV1lnS0hCc1lXTmxTRzlzWkdWeWMweGxiaUE5UFQwZ01pa2dlMXh1SUNBZ0lIUnRjQ0E5WEc0Z0lDQWdJQ0FvY21WMlRHOXZhM1Z3VzJJMk5DNWphR0Z5UTI5a1pVRjBLR2twWFNBOFBDQXlLU0I4WEc0Z0lDQWdJQ0FvY21WMlRHOXZhM1Z3VzJJMk5DNWphR0Z5UTI5a1pVRjBLR2tnS3lBeEtWMGdQajRnTkNsY2JpQWdJQ0JoY25KYlkzVnlRbmwwWlNzclhTQTlJSFJ0Y0NBbUlEQjRSa1pjYmlBZ2ZWeHVYRzRnSUdsbUlDaHdiR0ZqWlVodmJHUmxjbk5NWlc0Z1BUMDlJREVwSUh0Y2JpQWdJQ0IwYlhBZ1BWeHVJQ0FnSUNBZ0tISmxka3h2YjJ0MWNGdGlOalF1WTJoaGNrTnZaR1ZCZENocEtWMGdQRHdnTVRBcElIeGNiaUFnSUNBZ0lDaHlaWFpNYjI5cmRYQmJZalkwTG1Ob1lYSkRiMlJsUVhRb2FTQXJJREVwWFNBOFBDQTBLU0I4WEc0Z0lDQWdJQ0FvY21WMlRHOXZhM1Z3VzJJMk5DNWphR0Z5UTI5a1pVRjBLR2tnS3lBeUtWMGdQajRnTWlsY2JpQWdJQ0JoY25KYlkzVnlRbmwwWlNzclhTQTlJQ2gwYlhBZ1BqNGdPQ2tnSmlBd2VFWkdYRzRnSUNBZ1lYSnlXMk4xY2tKNWRHVXJLMTBnUFNCMGJYQWdKaUF3ZUVaR1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1lYSnlYRzU5WEc1Y2JtWjFibU4wYVc5dUlIUnlhWEJzWlhSVWIwSmhjMlUyTkNBb2JuVnRLU0I3WEc0Z0lISmxkSFZ5YmlCc2IyOXJkWEJiYm5WdElENCtJREU0SUNZZ01IZ3pSbDBnSzF4dUlDQWdJR3h2YjJ0MWNGdHVkVzBnUGo0Z01USWdKaUF3ZUROR1hTQXJYRzRnSUNBZ2JHOXZhM1Z3VzI1MWJTQStQaUEySUNZZ01IZ3pSbDBnSzF4dUlDQWdJR3h2YjJ0MWNGdHVkVzBnSmlBd2VETkdYVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmxibU52WkdWRGFIVnVheUFvZFdsdWREZ3NJSE4wWVhKMExDQmxibVFwSUh0Y2JpQWdkbUZ5SUhSdGNGeHVJQ0IyWVhJZ2IzVjBjSFYwSUQwZ1cxMWNiaUFnWm05eUlDaDJZWElnYVNBOUlITjBZWEowT3lCcElEd2daVzVrT3lCcElDczlJRE1wSUh0Y2JpQWdJQ0IwYlhBZ1BWeHVJQ0FnSUNBZ0tDaDFhVzUwT0Z0cFhTQThQQ0F4TmlrZ0ppQXdlRVpHTURBd01Da2dLMXh1SUNBZ0lDQWdLQ2gxYVc1ME9GdHBJQ3NnTVYwZ1BEd2dPQ2tnSmlBd2VFWkdNREFwSUN0Y2JpQWdJQ0FnSUNoMWFXNTBPRnRwSUNzZ01sMGdKaUF3ZUVaR0tWeHVJQ0FnSUc5MWRIQjFkQzV3ZFhOb0tIUnlhWEJzWlhSVWIwSmhjMlUyTkNoMGJYQXBLVnh1SUNCOVhHNGdJSEpsZEhWeWJpQnZkWFJ3ZFhRdWFtOXBiaWduSnlsY2JuMWNibHh1Wm5WdVkzUnBiMjRnWm5KdmJVSjVkR1ZCY25KaGVTQW9kV2x1ZERncElIdGNiaUFnZG1GeUlIUnRjRnh1SUNCMllYSWdiR1Z1SUQwZ2RXbHVkRGd1YkdWdVozUm9YRzRnSUhaaGNpQmxlSFJ5WVVKNWRHVnpJRDBnYkdWdUlDVWdNeUF2THlCcFppQjNaU0JvWVhabElERWdZbmwwWlNCc1pXWjBMQ0J3WVdRZ01pQmllWFJsYzF4dUlDQjJZWElnY0dGeWRITWdQU0JiWFZ4dUlDQjJZWElnYldGNFEyaDFibXRNWlc1bmRHZ2dQU0F4TmpNNE15QXZMeUJ0ZFhOMElHSmxJRzExYkhScGNHeGxJRzltSUROY2JseHVJQ0F2THlCbmJ5QjBhSEp2ZFdkb0lIUm9aU0JoY25KaGVTQmxkbVZ5ZVNCMGFISmxaU0JpZVhSbGN5d2dkMlVuYkd3Z1pHVmhiQ0IzYVhSb0lIUnlZV2xzYVc1bklITjBkV1ptSUd4aGRHVnlYRzRnSUdadmNpQW9kbUZ5SUdrZ1BTQXdMQ0JzWlc0eUlEMGdiR1Z1SUMwZ1pYaDBjbUZDZVhSbGN6c2dhU0E4SUd4bGJqSTdJR2tnS3owZ2JXRjRRMmgxYm10TVpXNW5kR2dwSUh0Y2JpQWdJQ0J3WVhKMGN5NXdkWE5vS0dWdVkyOWtaVU5vZFc1cktIVnBiblE0TENCcExDQW9hU0FySUcxaGVFTm9kVzVyVEdWdVozUm9LU0ErSUd4bGJqSWdQeUJzWlc0eUlEb2dLR2tnS3lCdFlYaERhSFZ1YTB4bGJtZDBhQ2twS1Z4dUlDQjlYRzVjYmlBZ0x5OGdjR0ZrSUhSb1pTQmxibVFnZDJsMGFDQjZaWEp2Y3l3Z1luVjBJRzFoYTJVZ2MzVnlaU0IwYnlCdWIzUWdabTl5WjJWMElIUm9aU0JsZUhSeVlTQmllWFJsYzF4dUlDQnBaaUFvWlhoMGNtRkNlWFJsY3lBOVBUMGdNU2tnZTF4dUlDQWdJSFJ0Y0NBOUlIVnBiblE0VzJ4bGJpQXRJREZkWEc0Z0lDQWdjR0Z5ZEhNdWNIVnphQ2hjYmlBZ0lDQWdJR3h2YjJ0MWNGdDBiWEFnUGo0Z01sMGdLMXh1SUNBZ0lDQWdiRzl2YTNWd1d5aDBiWEFnUER3Z05Da2dKaUF3ZUROR1hTQXJYRzRnSUNBZ0lDQW5QVDBuWEc0Z0lDQWdLVnh1SUNCOUlHVnNjMlVnYVdZZ0tHVjRkSEpoUW5sMFpYTWdQVDA5SURJcElIdGNiaUFnSUNCMGJYQWdQU0FvZFdsdWREaGJiR1Z1SUMwZ01sMGdQRHdnT0NrZ0t5QjFhVzUwT0Z0c1pXNGdMU0F4WFZ4dUlDQWdJSEJoY25SekxuQjFjMmdvWEc0Z0lDQWdJQ0JzYjI5cmRYQmJkRzF3SUQ0K0lERXdYU0FyWEc0Z0lDQWdJQ0JzYjI5cmRYQmJLSFJ0Y0NBK1BpQTBLU0FtSURCNE0wWmRJQ3RjYmlBZ0lDQWdJR3h2YjJ0MWNGc29kRzF3SUR3OElESXBJQ1lnTUhnelJsMGdLMXh1SUNBZ0lDQWdKejBuWEc0Z0lDQWdLVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSEJoY25SekxtcHZhVzRvSnljcFhHNTlYRzRpTENJdktpRmNiaUFxSUZSb1pTQmlkV1ptWlhJZ2JXOWtkV3hsSUdaeWIyMGdibTlrWlM1cWN5d2dabTl5SUhSb1pTQmljbTkzYzJWeUxseHVJQ3BjYmlBcUlFQmhkWFJvYjNJZ0lDQkdaWEp2YzNNZ1FXSnZkV3RvWVdScGFtVm9JRHhvZEhSd2N6b3ZMMlpsY205emN5NXZjbWMrWEc0Z0tpQkFiR2xqWlc1elpTQWdUVWxVWEc0Z0tpOWNiaThxSUdWemJHbHVkQzFrYVhOaFlteGxJRzV2TFhCeWIzUnZJQ292WEc1Y2JpZDFjMlVnYzNSeWFXTjBKMXh1WEc1MllYSWdZbUZ6WlRZMElEMGdjbVZ4ZFdseVpTZ25ZbUZ6WlRZMExXcHpKeWxjYm5aaGNpQnBaV1ZsTnpVMElEMGdjbVZ4ZFdseVpTZ25hV1ZsWlRjMU5DY3BYRzVjYm1WNGNHOXlkSE11UW5WbVptVnlJRDBnUW5WbVptVnlYRzVsZUhCdmNuUnpMbE5zYjNkQ2RXWm1aWElnUFNCVGJHOTNRblZtWm1WeVhHNWxlSEJ2Y25SekxrbE9VMUJGUTFSZlRVRllYMEpaVkVWVElEMGdOVEJjYmx4dWRtRnlJRXRmVFVGWVgweEZUa2RVU0NBOUlEQjROMlptWm1abVptWmNibVY0Y0c5eWRITXVhMDFoZUV4bGJtZDBhQ0E5SUV0ZlRVRllYMHhGVGtkVVNGeHVYRzR2S2lwY2JpQXFJRWxtSUdCQ2RXWm1aWEl1VkZsUVJVUmZRVkpTUVZsZlUxVlFVRTlTVkdBNlhHNGdLaUFnSUQwOVBTQjBjblZsSUNBZ0lGVnpaU0JWYVc1ME9FRnljbUY1SUdsdGNHeGxiV1Z1ZEdGMGFXOXVJQ2htWVhOMFpYTjBLVnh1SUNvZ0lDQTlQVDBnWm1Gc2MyVWdJQ0JRY21sdWRDQjNZWEp1YVc1bklHRnVaQ0J5WldOdmJXMWxibVFnZFhOcGJtY2dZR0oxWm1abGNtQWdkalF1ZUNCM2FHbGphQ0JvWVhNZ1lXNGdUMkpxWldOMFhHNGdLaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lHbHRjR3hsYldWdWRHRjBhVzl1SUNodGIzTjBJR052YlhCaGRHbGliR1VzSUdWMlpXNGdTVVUyS1Z4dUlDcGNiaUFxSUVKeWIzZHpaWEp6SUhSb1lYUWdjM1Z3Y0c5eWRDQjBlWEJsWkNCaGNuSmhlWE1nWVhKbElFbEZJREV3S3l3Z1JtbHlaV1p2ZUNBMEt5d2dRMmh5YjIxbElEY3JMQ0JUWVdaaGNta2dOUzR4S3l4Y2JpQXFJRTl3WlhKaElERXhMallyTENCcFQxTWdOQzR5S3k1Y2JpQXFYRzRnS2lCWFpTQnlaWEJ2Y25RZ2RHaGhkQ0IwYUdVZ1luSnZkM05sY2lCa2IyVnpJRzV2ZENCemRYQndiM0owSUhSNWNHVmtJR0Z5Y21GNWN5QnBaaUIwYUdVZ1lYSmxJRzV2ZENCemRXSmpiR0Z6YzJGaWJHVmNiaUFxSUhWemFXNW5JRjlmY0hKdmRHOWZYeTRnUm1seVpXWnZlQ0EwTFRJNUlHeGhZMnR6SUhOMWNIQnZjblFnWm05eUlHRmtaR2x1WnlCdVpYY2djSEp2Y0dWeWRHbGxjeUIwYnlCZ1ZXbHVkRGhCY25KaGVXQmNiaUFxSUNoVFpXVTZJR2gwZEhCek9pOHZZblZuZW1sc2JHRXViVzk2YVd4c1lTNXZjbWN2YzJodmQxOWlkV2N1WTJkcFAybGtQVFk1TlRRek9Da3VJRWxGSURFd0lHeGhZMnR6SUhOMWNIQnZjblJjYmlBcUlHWnZjaUJmWDNCeWIzUnZYMThnWVc1a0lHaGhjeUJoSUdKMVoyZDVJSFI1Y0dWa0lHRnljbUY1SUdsdGNHeGxiV1Z1ZEdGMGFXOXVMbHh1SUNvdlhHNUNkV1ptWlhJdVZGbFFSVVJmUVZKU1FWbGZVMVZRVUU5U1ZDQTlJSFI1Y0dWa1FYSnlZWGxUZFhCd2IzSjBLQ2xjYmx4dWFXWWdLQ0ZDZFdabVpYSXVWRmxRUlVSZlFWSlNRVmxmVTFWUVVFOVNWQ0FtSmlCMGVYQmxiMllnWTI5dWMyOXNaU0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVpjYmlBZ0lDQjBlWEJsYjJZZ1kyOXVjMjlzWlM1bGNuSnZjaUE5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNCamIyNXpiMnhsTG1WeWNtOXlLRnh1SUNBZ0lDZFVhR2x6SUdKeWIzZHpaWElnYkdGamEzTWdkSGx3WldRZ1lYSnlZWGtnS0ZWcGJuUTRRWEp5WVhrcElITjFjSEJ2Y25RZ2QyaHBZMmdnYVhNZ2NtVnhkV2x5WldRZ1lua2dKeUFyWEc0Z0lDQWdKMkJpZFdabVpYSmdJSFkxTG5ndUlGVnpaU0JnWW5WbVptVnlZQ0IyTkM1NElHbG1JSGx2ZFNCeVpYRjFhWEpsSUc5c1pDQmljbTkzYzJWeUlITjFjSEJ2Y25RdUoxeHVJQ0FwWEc1OVhHNWNibVoxYm1OMGFXOXVJSFI1Y0dWa1FYSnlZWGxUZFhCd2IzSjBJQ2dwSUh0Y2JpQWdMeThnUTJGdUlIUjVjR1ZrSUdGeWNtRjVJR2x1YzNSaGJtTmxjeUJqWVc0Z1ltVWdZWFZuYldWdWRHVmtQMXh1SUNCMGNua2dlMXh1SUNBZ0lIWmhjaUJoY25JZ1BTQnVaWGNnVldsdWREaEJjbkpoZVNneEtWeHVJQ0FnSUdGeWNpNWZYM0J5YjNSdlgxOGdQU0I3SUY5ZmNISnZkRzlmWHpvZ1ZXbHVkRGhCY25KaGVTNXdjbTkwYjNSNWNHVXNJR1p2YnpvZ1puVnVZM1JwYjI0Z0tDa2dleUJ5WlhSMWNtNGdORElnZlNCOVhHNGdJQ0FnY21WMGRYSnVJR0Z5Y2k1bWIyOG9LU0E5UFQwZ05ESmNiaUFnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0I5WEc1OVhHNWNiazlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoQ2RXWm1aWEl1Y0hKdmRHOTBlWEJsTENBbmNHRnlaVzUwSnl3Z2UxeHVJQ0JsYm5WdFpYSmhZbXhsT2lCMGNuVmxMRnh1SUNCblpYUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JwWmlBb0lVSjFabVpsY2k1cGMwSjFabVpsY2loMGFHbHpLU2tnY21WMGRYSnVJSFZ1WkdWbWFXNWxaRnh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbUoxWm1abGNseHVJQ0I5WEc1OUtWeHVYRzVQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1FuVm1abVZ5TG5CeWIzUnZkSGx3WlN3Z0oyOW1abk5sZENjc0lIdGNiaUFnWlc1MWJXVnlZV0pzWlRvZ2RISjFaU3hjYmlBZ1oyVjBPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYVdZZ0tDRkNkV1ptWlhJdWFYTkNkV1ptWlhJb2RHaHBjeWtwSUhKbGRIVnliaUIxYm1SbFptbHVaV1JjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVpZVhSbFQyWm1jMlYwWEc0Z0lIMWNibjBwWEc1Y2JtWjFibU4wYVc5dUlHTnlaV0YwWlVKMVptWmxjaUFvYkdWdVozUm9LU0I3WEc0Z0lHbG1JQ2hzWlc1bmRHZ2dQaUJMWDAxQldGOU1SVTVIVkVncElIdGNiaUFnSUNCMGFISnZkeUJ1WlhjZ1VtRnVaMlZGY25KdmNpZ25WR2hsSUhaaGJIVmxJRndpSnlBcklHeGxibWQwYUNBcklDZGNJaUJwY3lCcGJuWmhiR2xrSUdadmNpQnZjSFJwYjI0Z1hDSnphWHBsWENJbktWeHVJQ0I5WEc0Z0lDOHZJRkpsZEhWeWJpQmhiaUJoZFdkdFpXNTBaV1FnWUZWcGJuUTRRWEp5WVhsZ0lHbHVjM1JoYm1ObFhHNGdJSFpoY2lCaWRXWWdQU0J1WlhjZ1ZXbHVkRGhCY25KaGVTaHNaVzVuZEdncFhHNGdJR0oxWmk1ZlgzQnliM1J2WDE4Z1BTQkNkV1ptWlhJdWNISnZkRzkwZVhCbFhHNGdJSEpsZEhWeWJpQmlkV1pjYm4xY2JseHVMeW9xWEc0Z0tpQlVhR1VnUW5WbVptVnlJR052Ym5OMGNuVmpkRzl5SUhKbGRIVnlibk1nYVc1emRHRnVZMlZ6SUc5bUlHQlZhVzUwT0VGeWNtRjVZQ0IwYUdGMElHaGhkbVVnZEdobGFYSmNiaUFxSUhCeWIzUnZkSGx3WlNCamFHRnVaMlZrSUhSdklHQkNkV1ptWlhJdWNISnZkRzkwZVhCbFlDNGdSblZ5ZEdobGNtMXZjbVVzSUdCQ2RXWm1aWEpnSUdseklHRWdjM1ZpWTJ4aGMzTWdiMlpjYmlBcUlHQlZhVzUwT0VGeWNtRjVZQ3dnYzI4Z2RHaGxJSEpsZEhWeWJtVmtJR2x1YzNSaGJtTmxjeUIzYVd4c0lHaGhkbVVnWVd4c0lIUm9aU0J1YjJSbElHQkNkV1ptWlhKZ0lHMWxkR2h2WkhOY2JpQXFJR0Z1WkNCMGFHVWdZRlZwYm5RNFFYSnlZWGxnSUcxbGRHaHZaSE11SUZOeGRXRnlaU0JpY21GamEyVjBJRzV2ZEdGMGFXOXVJSGR2Y210eklHRnpJR1Y0Y0dWamRHVmtJQzB0SUdsMFhHNGdLaUJ5WlhSMWNtNXpJR0VnYzJsdVoyeGxJRzlqZEdWMExseHVJQ3BjYmlBcUlGUm9aU0JnVldsdWREaEJjbkpoZVdBZ2NISnZkRzkwZVhCbElISmxiV0ZwYm5NZ2RXNXRiMlJwWm1sbFpDNWNiaUFxTDF4dVhHNW1kVzVqZEdsdmJpQkNkV1ptWlhJZ0tHRnlaeXdnWlc1amIyUnBibWRQY2s5bVpuTmxkQ3dnYkdWdVozUm9LU0I3WEc0Z0lDOHZJRU52YlcxdmJpQmpZWE5sTGx4dUlDQnBaaUFvZEhsd1pXOW1JR0Z5WnlBOVBUMGdKMjUxYldKbGNpY3BJSHRjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JR1Z1WTI5a2FXNW5UM0pQWm1aelpYUWdQVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtGeHVJQ0FnSUNBZ0lDQW5WR2hsSUZ3aWMzUnlhVzVuWENJZ1lYSm5kVzFsYm5RZ2JYVnpkQ0JpWlNCdlppQjBlWEJsSUhOMGNtbHVaeTRnVW1WalpXbDJaV1FnZEhsd1pTQnVkVzFpWlhJblhHNGdJQ0FnSUNBcFhHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQmhiR3h2WTFWdWMyRm1aU2hoY21jcFhHNGdJSDFjYmlBZ2NtVjBkWEp1SUdaeWIyMG9ZWEpuTENCbGJtTnZaR2x1WjA5eVQyWm1jMlYwTENCc1pXNW5kR2dwWEc1OVhHNWNiaTh2SUVacGVDQnpkV0poY25KaGVTZ3BJR2x1SUVWVE1qQXhOaTRnVTJWbE9pQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZabVZ5YjNOekwySjFabVpsY2k5d2RXeHNMemszWEc1cFppQW9kSGx3Wlc5bUlGTjViV0p2YkNBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NnSmlZZ1UzbHRZbTlzTG5Od1pXTnBaWE1nSVQwZ2JuVnNiQ0FtSmx4dUlDQWdJRUoxWm1abGNsdFRlVzFpYjJ3dWMzQmxZMmxsYzEwZ1BUMDlJRUoxWm1abGNpa2dlMXh1SUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29RblZtWm1WeUxDQlRlVzFpYjJ3dWMzQmxZMmxsY3l3Z2UxeHVJQ0FnSUhaaGJIVmxPaUJ1ZFd4c0xGeHVJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dkSEoxWlN4Y2JpQWdJQ0JsYm5WdFpYSmhZbXhsT2lCbVlXeHpaU3hjYmlBZ0lDQjNjbWwwWVdKc1pUb2dabUZzYzJWY2JpQWdmU2xjYm4xY2JseHVRblZtWm1WeUxuQnZiMnhUYVhwbElEMGdPREU1TWlBdkx5QnViM1FnZFhObFpDQmllU0IwYUdseklHbHRjR3hsYldWdWRHRjBhVzl1WEc1Y2JtWjFibU4wYVc5dUlHWnliMjBnS0haaGJIVmxMQ0JsYm1OdlpHbHVaMDl5VDJabWMyVjBMQ0JzWlc1bmRHZ3BJSHRjYmlBZ2FXWWdLSFI1Y0dWdlppQjJZV3gxWlNBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQnlaWFIxY200Z1puSnZiVk4wY21sdVp5aDJZV3gxWlN3Z1pXNWpiMlJwYm1kUGNrOW1abk5sZENsY2JpQWdmVnh1WEc0Z0lHbG1JQ2hCY25KaGVVSjFabVpsY2k1cGMxWnBaWGNvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWnliMjFCY25KaGVVeHBhMlVvZG1Gc2RXVXBYRzRnSUgxY2JseHVJQ0JwWmlBb2RtRnNkV1VnUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJSFJvY205M0lGUjVjR1ZGY25KdmNpaGNiaUFnSUNBZ0lDZFVhR1VnWm1seWMzUWdZWEpuZFcxbGJuUWdiWFZ6ZENCaVpTQnZibVVnYjJZZ2RIbHdaU0J6ZEhKcGJtY3NJRUoxWm1abGNpd2dRWEp5WVhsQ2RXWm1aWElzSUVGeWNtRjVMQ0FuSUN0Y2JpQWdJQ0FnSUNkdmNpQkJjbkpoZVMxc2FXdGxJRTlpYW1WamRDNGdVbVZqWldsMlpXUWdkSGx3WlNBbklDc2dLSFI1Y0dWdlppQjJZV3gxWlNsY2JpQWdJQ0FwWEc0Z0lIMWNibHh1SUNCcFppQW9hWE5KYm5OMFlXNWpaU2gyWVd4MVpTd2dRWEp5WVhsQ2RXWm1aWElwSUh4OFhHNGdJQ0FnSUNBb2RtRnNkV1VnSmlZZ2FYTkpibk4wWVc1alpTaDJZV3gxWlM1aWRXWm1aWElzSUVGeWNtRjVRblZtWm1WeUtTa3BJSHRjYmlBZ0lDQnlaWFIxY200Z1puSnZiVUZ5Y21GNVFuVm1abVZ5S0haaGJIVmxMQ0JsYm1OdlpHbHVaMDl5VDJabWMyVjBMQ0JzWlc1bmRHZ3BYRzRnSUgxY2JseHVJQ0JwWmlBb2RIbHdaVzltSUhaaGJIVmxJRDA5UFNBbmJuVnRZbVZ5SnlrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCVWVYQmxSWEp5YjNJb1hHNGdJQ0FnSUNBblZHaGxJRndpZG1Gc2RXVmNJaUJoY21kMWJXVnVkQ0J0ZFhOMElHNXZkQ0JpWlNCdlppQjBlWEJsSUc1MWJXSmxjaTRnVW1WalpXbDJaV1FnZEhsd1pTQnVkVzFpWlhJblhHNGdJQ0FnS1Z4dUlDQjlYRzVjYmlBZ2RtRnlJSFpoYkhWbFQyWWdQU0IyWVd4MVpTNTJZV3gxWlU5bUlDWW1JSFpoYkhWbExuWmhiSFZsVDJZb0tWeHVJQ0JwWmlBb2RtRnNkV1ZQWmlBaFBTQnVkV3hzSUNZbUlIWmhiSFZsVDJZZ0lUMDlJSFpoYkhWbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUVKMVptWmxjaTVtY205dEtIWmhiSFZsVDJZc0lHVnVZMjlrYVc1blQzSlBabVp6WlhRc0lHeGxibWQwYUNsY2JpQWdmVnh1WEc0Z0lIWmhjaUJpSUQwZ1puSnZiVTlpYW1WamRDaDJZV3gxWlNsY2JpQWdhV1lnS0dJcElISmxkSFZ5YmlCaVhHNWNiaUFnYVdZZ0tIUjVjR1Z2WmlCVGVXMWliMndnSVQwOUlDZDFibVJsWm1sdVpXUW5JQ1ltSUZONWJXSnZiQzUwYjFCeWFXMXBkR2wyWlNBaFBTQnVkV3hzSUNZbVhHNGdJQ0FnSUNCMGVYQmxiMllnZG1Gc2RXVmJVM2x0WW05c0xuUnZVSEpwYldsMGFYWmxYU0E5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lISmxkSFZ5YmlCQ2RXWm1aWEl1Wm5KdmJTaGNiaUFnSUNBZ0lIWmhiSFZsVzFONWJXSnZiQzUwYjFCeWFXMXBkR2wyWlYwb0ozTjBjbWx1WnljcExDQmxibU52WkdsdVowOXlUMlptYzJWMExDQnNaVzVuZEdoY2JpQWdJQ0FwWEc0Z0lIMWNibHh1SUNCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtGeHVJQ0FnSUNkVWFHVWdabWx5YzNRZ1lYSm5kVzFsYm5RZ2JYVnpkQ0JpWlNCdmJtVWdiMllnZEhsd1pTQnpkSEpwYm1jc0lFSjFabVpsY2l3Z1FYSnlZWGxDZFdabVpYSXNJRUZ5Y21GNUxDQW5JQ3RjYmlBZ0lDQW5iM0lnUVhKeVlYa3RiR2xyWlNCUFltcGxZM1F1SUZKbFkyVnBkbVZrSUhSNWNHVWdKeUFySUNoMGVYQmxiMllnZG1Gc2RXVXBYRzRnSUNsY2JuMWNibHh1THlvcVhHNGdLaUJHZFc1amRHbHZibUZzYkhrZ1pYRjFhWFpoYkdWdWRDQjBieUJDZFdabVpYSW9ZWEpuTENCbGJtTnZaR2x1WnlrZ1luVjBJSFJvY205M2N5QmhJRlI1Y0dWRmNuSnZjbHh1SUNvZ2FXWWdkbUZzZFdVZ2FYTWdZU0J1ZFcxaVpYSXVYRzRnS2lCQ2RXWm1aWEl1Wm5KdmJTaHpkSEpiTENCbGJtTnZaR2x1WjEwcFhHNGdLaUJDZFdabVpYSXVabkp2YlNoaGNuSmhlU2xjYmlBcUlFSjFabVpsY2k1bWNtOXRLR0oxWm1abGNpbGNiaUFxSUVKMVptWmxjaTVtY205dEtHRnljbUY1UW5WbVptVnlXeXdnWW5sMFpVOW1abk5sZEZzc0lHeGxibWQwYUYxZEtWeHVJQ29xTDF4dVFuVm1abVZ5TG1aeWIyMGdQU0JtZFc1amRHbHZiaUFvZG1Gc2RXVXNJR1Z1WTI5a2FXNW5UM0pQWm1aelpYUXNJR3hsYm1kMGFDa2dlMXh1SUNCeVpYUjFjbTRnWm5KdmJTaDJZV3gxWlN3Z1pXNWpiMlJwYm1kUGNrOW1abk5sZEN3Z2JHVnVaM1JvS1Z4dWZWeHVYRzR2THlCT2IzUmxPaUJEYUdGdVoyVWdjSEp2ZEc5MGVYQmxJQ3BoWm5SbGNpb2dRblZtWm1WeUxtWnliMjBnYVhNZ1pHVm1hVzVsWkNCMGJ5QjNiM0pyWVhKdmRXNWtJRU5vY205dFpTQmlkV2M2WEc0dkx5Qm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZabVZ5YjNOekwySjFabVpsY2k5d2RXeHNMekUwT0Z4dVFuVm1abVZ5TG5CeWIzUnZkSGx3WlM1ZlgzQnliM1J2WDE4Z1BTQlZhVzUwT0VGeWNtRjVMbkJ5YjNSdmRIbHdaVnh1UW5WbVptVnlMbDlmY0hKdmRHOWZYeUE5SUZWcGJuUTRRWEp5WVhsY2JseHVablZ1WTNScGIyNGdZWE56WlhKMFUybDZaU0FvYzJsNlpTa2dlMXh1SUNCcFppQW9kSGx3Wlc5bUlITnBlbVVnSVQwOUlDZHVkVzFpWlhJbktTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lGUjVjR1ZGY25KdmNpZ25YQ0p6YVhwbFhDSWdZWEpuZFcxbGJuUWdiWFZ6ZENCaVpTQnZaaUIwZVhCbElHNTFiV0psY2ljcFhHNGdJSDBnWld4elpTQnBaaUFvYzJsNlpTQThJREFwSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnVW1GdVoyVkZjbkp2Y2lnblZHaGxJSFpoYkhWbElGd2lKeUFySUhOcGVtVWdLeUFuWENJZ2FYTWdhVzUyWVd4cFpDQm1iM0lnYjNCMGFXOXVJRndpYzJsNlpWd2lKeWxjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCaGJHeHZZeUFvYzJsNlpTd2dabWxzYkN3Z1pXNWpiMlJwYm1jcElIdGNiaUFnWVhOelpYSjBVMmw2WlNoemFYcGxLVnh1SUNCcFppQW9jMmw2WlNBOFBTQXdLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHTnlaV0YwWlVKMVptWmxjaWh6YVhwbEtWeHVJQ0I5WEc0Z0lHbG1JQ2htYVd4c0lDRTlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0F2THlCUGJteDVJSEJoZVNCaGRIUmxiblJwYjI0Z2RHOGdaVzVqYjJScGJtY2dhV1lnYVhRbmN5QmhJSE4wY21sdVp5NGdWR2hwYzF4dUlDQWdJQzh2SUhCeVpYWmxiblJ6SUdGalkybGtaVzUwWVd4c2VTQnpaVzVrYVc1bklHbHVJR0VnYm5WdFltVnlJSFJvWVhRZ2QyOTFiR1JjYmlBZ0lDQXZMeUJpWlNCcGJuUmxjbkJ5WlhSMFpXUWdZWE1nWVNCemRHRnlkQ0J2Wm1aelpYUXVYRzRnSUNBZ2NtVjBkWEp1SUhSNWNHVnZaaUJsYm1OdlpHbHVaeUE5UFQwZ0ozTjBjbWx1WnlkY2JpQWdJQ0FnSUQ4Z1kzSmxZWFJsUW5WbVptVnlLSE5wZW1VcExtWnBiR3dvWm1sc2JDd2daVzVqYjJScGJtY3BYRzRnSUNBZ0lDQTZJR055WldGMFpVSjFabVpsY2loemFYcGxLUzVtYVd4c0tHWnBiR3dwWEc0Z0lIMWNiaUFnY21WMGRYSnVJR055WldGMFpVSjFabVpsY2loemFYcGxLVnh1ZlZ4dVhHNHZLaXBjYmlBcUlFTnlaV0YwWlhNZ1lTQnVaWGNnWm1sc2JHVmtJRUoxWm1abGNpQnBibk4wWVc1alpTNWNiaUFxSUdGc2JHOWpLSE5wZW1WYkxDQm1hV3hzV3l3Z1pXNWpiMlJwYm1kZFhTbGNiaUFxS2k5Y2JrSjFabVpsY2k1aGJHeHZZeUE5SUdaMWJtTjBhVzl1SUNoemFYcGxMQ0JtYVd4c0xDQmxibU52WkdsdVp5a2dlMXh1SUNCeVpYUjFjbTRnWVd4c2IyTW9jMmw2WlN3Z1ptbHNiQ3dnWlc1amIyUnBibWNwWEc1OVhHNWNibVoxYm1OMGFXOXVJR0ZzYkc5alZXNXpZV1psSUNoemFYcGxLU0I3WEc0Z0lHRnpjMlZ5ZEZOcGVtVW9jMmw2WlNsY2JpQWdjbVYwZFhKdUlHTnlaV0YwWlVKMVptWmxjaWh6YVhwbElEd2dNQ0EvSURBZ09pQmphR1ZqYTJWa0tITnBlbVVwSUh3Z01DbGNibjFjYmx4dUx5b3FYRzRnS2lCRmNYVnBkbUZzWlc1MElIUnZJRUoxWm1abGNpaHVkVzBwTENCaWVTQmtaV1poZFd4MElHTnlaV0YwWlhNZ1lTQnViMjR0ZW1WeWJ5MW1hV3hzWldRZ1FuVm1abVZ5SUdsdWMzUmhibU5sTGx4dUlDb2dLaTljYmtKMVptWmxjaTVoYkd4dlkxVnVjMkZtWlNBOUlHWjFibU4wYVc5dUlDaHphWHBsS1NCN1hHNGdJSEpsZEhWeWJpQmhiR3h2WTFWdWMyRm1aU2h6YVhwbEtWeHVmVnh1THlvcVhHNGdLaUJGY1hWcGRtRnNaVzUwSUhSdklGTnNiM2RDZFdabVpYSW9iblZ0S1N3Z1lua2daR1ZtWVhWc2RDQmpjbVZoZEdWeklHRWdibTl1TFhwbGNtOHRabWxzYkdWa0lFSjFabVpsY2lCcGJuTjBZVzVqWlM1Y2JpQXFMMXh1UW5WbVptVnlMbUZzYkc5alZXNXpZV1psVTJ4dmR5QTlJR1oxYm1OMGFXOXVJQ2h6YVhwbEtTQjdYRzRnSUhKbGRIVnliaUJoYkd4dlkxVnVjMkZtWlNoemFYcGxLVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm1jbTl0VTNSeWFXNW5JQ2h6ZEhKcGJtY3NJR1Z1WTI5a2FXNW5LU0I3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdaVzVqYjJScGJtY2dJVDA5SUNkemRISnBibWNuSUh4OElHVnVZMjlrYVc1bklEMDlQU0FuSnlrZ2UxeHVJQ0FnSUdWdVkyOWthVzVuSUQwZ0ozVjBaamduWEc0Z0lIMWNibHh1SUNCcFppQW9JVUoxWm1abGNpNXBjMFZ1WTI5a2FXNW5LR1Z1WTI5a2FXNW5LU2tnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJVZVhCbFJYSnliM0lvSjFWdWEyNXZkMjRnWlc1amIyUnBibWM2SUNjZ0t5QmxibU52WkdsdVp5bGNiaUFnZlZ4dVhHNGdJSFpoY2lCc1pXNW5kR2dnUFNCaWVYUmxUR1Z1WjNSb0tITjBjbWx1Wnl3Z1pXNWpiMlJwYm1jcElId2dNRnh1SUNCMllYSWdZblZtSUQwZ1kzSmxZWFJsUW5WbVptVnlLR3hsYm1kMGFDbGNibHh1SUNCMllYSWdZV04wZFdGc0lEMGdZblZtTG5keWFYUmxLSE4wY21sdVp5d2daVzVqYjJScGJtY3BYRzVjYmlBZ2FXWWdLR0ZqZEhWaGJDQWhQVDBnYkdWdVozUm9LU0I3WEc0Z0lDQWdMeThnVjNKcGRHbHVaeUJoSUdobGVDQnpkSEpwYm1jc0lHWnZjaUJsZUdGdGNHeGxMQ0IwYUdGMElHTnZiblJoYVc1eklHbHVkbUZzYVdRZ1kyaGhjbUZqZEdWeWN5QjNhV3hzWEc0Z0lDQWdMeThnWTJGMWMyVWdaWFpsY25sMGFHbHVaeUJoWm5SbGNpQjBhR1VnWm1seWMzUWdhVzUyWVd4cFpDQmphR0Z5WVdOMFpYSWdkRzhnWW1VZ2FXZHViM0psWkM0Z0tHVXVaeTVjYmlBZ0lDQXZMeUFuWVdKNGVHTmtKeUIzYVd4c0lHSmxJSFJ5WldGMFpXUWdZWE1nSjJGaUp5bGNiaUFnSUNCaWRXWWdQU0JpZFdZdWMyeHBZMlVvTUN3Z1lXTjBkV0ZzS1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUdKMVpseHVmVnh1WEc1bWRXNWpkR2x2YmlCbWNtOXRRWEp5WVhsTWFXdGxJQ2hoY25KaGVTa2dlMXh1SUNCMllYSWdiR1Z1WjNSb0lEMGdZWEp5WVhrdWJHVnVaM1JvSUR3Z01DQS9JREFnT2lCamFHVmphMlZrS0dGeWNtRjVMbXhsYm1kMGFDa2dmQ0F3WEc0Z0lIWmhjaUJpZFdZZ1BTQmpjbVZoZEdWQ2RXWm1aWElvYkdWdVozUm9LVnh1SUNCbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOElHeGxibWQwYURzZ2FTQXJQU0F4S1NCN1hHNGdJQ0FnWW5WbVcybGRJRDBnWVhKeVlYbGJhVjBnSmlBeU5UVmNiaUFnZlZ4dUlDQnlaWFIxY200Z1luVm1YRzU5WEc1Y2JtWjFibU4wYVc5dUlHWnliMjFCY25KaGVVSjFabVpsY2lBb1lYSnlZWGtzSUdKNWRHVlBabVp6WlhRc0lHeGxibWQwYUNrZ2UxeHVJQ0JwWmlBb1lubDBaVTltWm5ObGRDQThJREFnZkh3Z1lYSnlZWGt1WW5sMFpVeGxibWQwYUNBOElHSjVkR1ZQWm1aelpYUXBJSHRjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dVbUZ1WjJWRmNuSnZjaWduWENKdlptWnpaWFJjSWlCcGN5QnZkWFJ6YVdSbElHOW1JR0oxWm1abGNpQmliM1Z1WkhNbktWeHVJQ0I5WEc1Y2JpQWdhV1lnS0dGeWNtRjVMbUo1ZEdWTVpXNW5kR2dnUENCaWVYUmxUMlptYzJWMElDc2dLR3hsYm1kMGFDQjhmQ0F3S1NrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCU1lXNW5aVVZ5Y205eUtDZGNJbXhsYm1kMGFGd2lJR2x6SUc5MWRITnBaR1VnYjJZZ1luVm1abVZ5SUdKdmRXNWtjeWNwWEc0Z0lIMWNibHh1SUNCMllYSWdZblZtWEc0Z0lHbG1JQ2hpZVhSbFQyWm1jMlYwSUQwOVBTQjFibVJsWm1sdVpXUWdKaVlnYkdWdVozUm9JRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNCaWRXWWdQU0J1WlhjZ1ZXbHVkRGhCY25KaGVTaGhjbkpoZVNsY2JpQWdmU0JsYkhObElHbG1JQ2hzWlc1bmRHZ2dQVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUdKMVppQTlJRzVsZHlCVmFXNTBPRUZ5Y21GNUtHRnljbUY1TENCaWVYUmxUMlptYzJWMEtWeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHSjFaaUE5SUc1bGR5QlZhVzUwT0VGeWNtRjVLR0Z5Y21GNUxDQmllWFJsVDJabWMyVjBMQ0JzWlc1bmRHZ3BYRzRnSUgxY2JseHVJQ0F2THlCU1pYUjFjbTRnWVc0Z1lYVm5iV1Z1ZEdWa0lHQlZhVzUwT0VGeWNtRjVZQ0JwYm5OMFlXNWpaVnh1SUNCaWRXWXVYMTl3Y205MGIxOWZJRDBnUW5WbVptVnlMbkJ5YjNSdmRIbHdaVnh1SUNCeVpYUjFjbTRnWW5WbVhHNTlYRzVjYm1aMWJtTjBhVzl1SUdaeWIyMVBZbXBsWTNRZ0tHOWlhaWtnZTF4dUlDQnBaaUFvUW5WbVptVnlMbWx6UW5WbVptVnlLRzlpYWlrcElIdGNiaUFnSUNCMllYSWdiR1Z1SUQwZ1kyaGxZMnRsWkNodlltb3ViR1Z1WjNSb0tTQjhJREJjYmlBZ0lDQjJZWElnWW5WbUlEMGdZM0psWVhSbFFuVm1abVZ5S0d4bGJpbGNibHh1SUNBZ0lHbG1JQ2hpZFdZdWJHVnVaM1JvSUQwOVBTQXdLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZblZtWEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMkpxTG1OdmNIa29ZblZtTENBd0xDQXdMQ0JzWlc0cFhHNGdJQ0FnY21WMGRYSnVJR0oxWmx4dUlDQjlYRzVjYmlBZ2FXWWdLRzlpYWk1c1pXNW5kR2dnSVQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdiMkpxTG14bGJtZDBhQ0FoUFQwZ0oyNTFiV0psY2ljZ2ZId2diblZ0WW1WeVNYTk9ZVTRvYjJKcUxteGxibWQwYUNrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCamNtVmhkR1ZDZFdabVpYSW9NQ2xjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUdaeWIyMUJjbkpoZVV4cGEyVW9iMkpxS1Z4dUlDQjlYRzVjYmlBZ2FXWWdLRzlpYWk1MGVYQmxJRDA5UFNBblFuVm1abVZ5SnlBbUppQkJjbkpoZVM1cGMwRnljbUY1S0c5aWFpNWtZWFJoS1NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJtY205dFFYSnlZWGxNYVd0bEtHOWlhaTVrWVhSaEtWeHVJQ0I5WEc1OVhHNWNibVoxYm1OMGFXOXVJR05vWldOclpXUWdLR3hsYm1kMGFDa2dlMXh1SUNBdkx5Qk9iM1JsT2lCallXNXViM1FnZFhObElHQnNaVzVuZEdnZ1BDQkxYMDFCV0Y5TVJVNUhWRWhnSUdobGNtVWdZbVZqWVhWelpTQjBhR0YwSUdaaGFXeHpJSGRvWlc1Y2JpQWdMeThnYkdWdVozUm9JR2x6SUU1aFRpQW9kMmhwWTJnZ2FYTWdiM1JvWlhKM2FYTmxJR052WlhKalpXUWdkRzhnZW1WeWJ5NHBYRzRnSUdsbUlDaHNaVzVuZEdnZ1BqMGdTMTlOUVZoZlRFVk9SMVJJS1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUZKaGJtZGxSWEp5YjNJb0owRjBkR1Z0Y0hRZ2RHOGdZV3hzYjJOaGRHVWdRblZtWm1WeUlHeGhjbWRsY2lCMGFHRnVJRzFoZUdsdGRXMGdKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSjNOcGVtVTZJREI0SnlBcklFdGZUVUZZWDB4RlRrZFVTQzUwYjFOMGNtbHVaeWd4TmlrZ0t5QW5JR0o1ZEdWekp5bGNiaUFnZlZ4dUlDQnlaWFIxY200Z2JHVnVaM1JvSUh3Z01GeHVmVnh1WEc1bWRXNWpkR2x2YmlCVGJHOTNRblZtWm1WeUlDaHNaVzVuZEdncElIdGNiaUFnYVdZZ0tDdHNaVzVuZEdnZ0lUMGdiR1Z1WjNSb0tTQjdJQzh2SUdWemJHbHVkQzFrYVhOaFlteGxMV3hwYm1VZ1pYRmxjV1Z4WEc0Z0lDQWdiR1Z1WjNSb0lEMGdNRnh1SUNCOVhHNGdJSEpsZEhWeWJpQkNkV1ptWlhJdVlXeHNiMk1vSzJ4bGJtZDBhQ2xjYm4xY2JseHVRblZtWm1WeUxtbHpRblZtWm1WeUlEMGdablZ1WTNScGIyNGdhWE5DZFdabVpYSWdLR0lwSUh0Y2JpQWdjbVYwZFhKdUlHSWdJVDBnYm5Wc2JDQW1KaUJpTGw5cGMwSjFabVpsY2lBOVBUMGdkSEoxWlNBbUpseHVJQ0FnSUdJZ0lUMDlJRUoxWm1abGNpNXdjbTkwYjNSNWNHVWdMeThnYzI4Z1FuVm1abVZ5TG1selFuVm1abVZ5S0VKMVptWmxjaTV3Y205MGIzUjVjR1VwSUhkcGJHd2dZbVVnWm1Gc2MyVmNibjFjYmx4dVFuVm1abVZ5TG1OdmJYQmhjbVVnUFNCbWRXNWpkR2x2YmlCamIyMXdZWEpsSUNoaExDQmlLU0I3WEc0Z0lHbG1JQ2hwYzBsdWMzUmhibU5sS0dFc0lGVnBiblE0UVhKeVlYa3BLU0JoSUQwZ1FuVm1abVZ5TG1aeWIyMG9ZU3dnWVM1dlptWnpaWFFzSUdFdVlubDBaVXhsYm1kMGFDbGNiaUFnYVdZZ0tHbHpTVzV6ZEdGdVkyVW9ZaXdnVldsdWREaEJjbkpoZVNrcElHSWdQU0JDZFdabVpYSXVabkp2YlNoaUxDQmlMbTltWm5ObGRDd2dZaTVpZVhSbFRHVnVaM1JvS1Z4dUlDQnBaaUFvSVVKMVptWmxjaTVwYzBKMVptWmxjaWhoS1NCOGZDQWhRblZtWm1WeUxtbHpRblZtWm1WeUtHSXBLU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRlI1Y0dWRmNuSnZjaWhjYmlBZ0lDQWdJQ2RVYUdVZ1hDSmlkV1l4WENJc0lGd2lZblZtTWx3aUlHRnlaM1Z0Wlc1MGN5QnRkWE4wSUdKbElHOXVaU0J2WmlCMGVYQmxJRUoxWm1abGNpQnZjaUJWYVc1ME9FRnljbUY1SjF4dUlDQWdJQ2xjYmlBZ2ZWeHVYRzRnSUdsbUlDaGhJRDA5UFNCaUtTQnlaWFIxY200Z01GeHVYRzRnSUhaaGNpQjRJRDBnWVM1c1pXNW5kR2hjYmlBZ2RtRnlJSGtnUFNCaUxteGxibWQwYUZ4dVhHNGdJR1p2Y2lBb2RtRnlJR2tnUFNBd0xDQnNaVzRnUFNCTllYUm9MbTFwYmloNExDQjVLVHNnYVNBOElHeGxianNnS3l0cEtTQjdYRzRnSUNBZ2FXWWdLR0ZiYVYwZ0lUMDlJR0piYVYwcElIdGNiaUFnSUNBZ0lIZ2dQU0JoVzJsZFhHNGdJQ0FnSUNCNUlEMGdZbHRwWFZ4dUlDQWdJQ0FnWW5KbFlXdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnBaaUFvZUNBOElIa3BJSEpsZEhWeWJpQXRNVnh1SUNCcFppQW9lU0E4SUhncElISmxkSFZ5YmlBeFhHNGdJSEpsZEhWeWJpQXdYRzU5WEc1Y2JrSjFabVpsY2k1cGMwVnVZMjlrYVc1bklEMGdablZ1WTNScGIyNGdhWE5GYm1OdlpHbHVaeUFvWlc1amIyUnBibWNwSUh0Y2JpQWdjM2RwZEdOb0lDaFRkSEpwYm1jb1pXNWpiMlJwYm1jcExuUnZURzkzWlhKRFlYTmxLQ2twSUh0Y2JpQWdJQ0JqWVhObElDZG9aWGduT2x4dUlDQWdJR05oYzJVZ0ozVjBaamduT2x4dUlDQWdJR05oYzJVZ0ozVjBaaTA0SnpwY2JpQWdJQ0JqWVhObElDZGhjMk5wYVNjNlhHNGdJQ0FnWTJGelpTQW5iR0YwYVc0eEp6cGNiaUFnSUNCallYTmxJQ2RpYVc1aGNua25PbHh1SUNBZ0lHTmhjMlVnSjJKaGMyVTJOQ2M2WEc0Z0lDQWdZMkZ6WlNBbmRXTnpNaWM2WEc0Z0lDQWdZMkZ6WlNBbmRXTnpMVEluT2x4dUlDQWdJR05oYzJVZ0ozVjBaakUyYkdVbk9seHVJQ0FnSUdOaGMyVWdKM1YwWmkweE5teGxKenBjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdaR1ZtWVhWc2REcGNiaUFnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNCOVhHNTlYRzVjYmtKMVptWmxjaTVqYjI1allYUWdQU0JtZFc1amRHbHZiaUJqYjI1allYUWdLR3hwYzNRc0lHeGxibWQwYUNrZ2UxeHVJQ0JwWmlBb0lVRnljbUY1TG1selFYSnlZWGtvYkdsemRDa3BJSHRjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dWSGx3WlVWeWNtOXlLQ2RjSW14cGMzUmNJaUJoY21kMWJXVnVkQ0J0ZFhOMElHSmxJR0Z1SUVGeWNtRjVJRzltSUVKMVptWmxjbk1uS1Z4dUlDQjlYRzVjYmlBZ2FXWWdLR3hwYzNRdWJHVnVaM1JvSUQwOVBTQXdLU0I3WEc0Z0lDQWdjbVYwZFhKdUlFSjFabVpsY2k1aGJHeHZZeWd3S1Z4dUlDQjlYRzVjYmlBZ2RtRnlJR2xjYmlBZ2FXWWdLR3hsYm1kMGFDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnYkdWdVozUm9JRDBnTUZ4dUlDQWdJR1p2Y2lBb2FTQTlJREE3SUdrZ1BDQnNhWE4wTG14bGJtZDBhRHNnS3l0cEtTQjdYRzRnSUNBZ0lDQnNaVzVuZEdnZ0t6MGdiR2x6ZEZ0cFhTNXNaVzVuZEdoY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCMllYSWdZblZtWm1WeUlEMGdRblZtWm1WeUxtRnNiRzlqVlc1ellXWmxLR3hsYm1kMGFDbGNiaUFnZG1GeUlIQnZjeUE5SURCY2JpQWdabTl5SUNocElEMGdNRHNnYVNBOElHeHBjM1F1YkdWdVozUm9PeUFySzJrcElIdGNiaUFnSUNCMllYSWdZblZtSUQwZ2JHbHpkRnRwWFZ4dUlDQWdJR2xtSUNocGMwbHVjM1JoYm1ObEtHSjFaaXdnVldsdWREaEJjbkpoZVNrcElIdGNiaUFnSUNBZ0lHSjFaaUE5SUVKMVptWmxjaTVtY205dEtHSjFaaWxjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLQ0ZDZFdabVpYSXVhWE5DZFdabVpYSW9ZblZtS1NrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lGUjVjR1ZGY25KdmNpZ25YQ0pzYVhOMFhDSWdZWEpuZFcxbGJuUWdiWFZ6ZENCaVpTQmhiaUJCY25KaGVTQnZaaUJDZFdabVpYSnpKeWxjYmlBZ0lDQjlYRzRnSUNBZ1luVm1MbU52Y0hrb1luVm1abVZ5TENCd2IzTXBYRzRnSUNBZ2NHOXpJQ3M5SUdKMVppNXNaVzVuZEdoY2JpQWdmVnh1SUNCeVpYUjFjbTRnWW5WbVptVnlYRzU5WEc1Y2JtWjFibU4wYVc5dUlHSjVkR1ZNWlc1bmRHZ2dLSE4wY21sdVp5d2daVzVqYjJScGJtY3BJSHRjYmlBZ2FXWWdLRUoxWm1abGNpNXBjMEoxWm1abGNpaHpkSEpwYm1jcEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhOMGNtbHVaeTVzWlc1bmRHaGNiaUFnZlZ4dUlDQnBaaUFvUVhKeVlYbENkV1ptWlhJdWFYTldhV1YzS0hOMGNtbHVaeWtnZkh3Z2FYTkpibk4wWVc1alpTaHpkSEpwYm1jc0lFRnljbUY1UW5WbVptVnlLU2tnZTF4dUlDQWdJSEpsZEhWeWJpQnpkSEpwYm1jdVlubDBaVXhsYm1kMGFGeHVJQ0I5WEc0Z0lHbG1JQ2gwZVhCbGIyWWdjM1J5YVc1bklDRTlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJVZVhCbFJYSnliM0lvWEc0Z0lDQWdJQ0FuVkdobElGd2ljM1J5YVc1blhDSWdZWEpuZFcxbGJuUWdiWFZ6ZENCaVpTQnZibVVnYjJZZ2RIbHdaU0J6ZEhKcGJtY3NJRUoxWm1abGNpd2diM0lnUVhKeVlYbENkV1ptWlhJdUlDY2dLMXh1SUNBZ0lDQWdKMUpsWTJWcGRtVmtJSFI1Y0dVZ0p5QXJJSFI1Y0dWdlppQnpkSEpwYm1kY2JpQWdJQ0FwWEc0Z0lIMWNibHh1SUNCMllYSWdiR1Z1SUQwZ2MzUnlhVzVuTG14bGJtZDBhRnh1SUNCMllYSWdiWFZ6ZEUxaGRHTm9JRDBnS0dGeVozVnRaVzUwY3k1c1pXNW5kR2dnUGlBeUlDWW1JR0Z5WjNWdFpXNTBjMXN5WFNBOVBUMGdkSEoxWlNsY2JpQWdhV1lnS0NGdGRYTjBUV0YwWTJnZ0ppWWdiR1Z1SUQwOVBTQXdLU0J5WlhSMWNtNGdNRnh1WEc0Z0lDOHZJRlZ6WlNCaElHWnZjaUJzYjI5d0lIUnZJR0YyYjJsa0lISmxZM1Z5YzJsdmJseHVJQ0IyWVhJZ2JHOTNaWEpsWkVOaGMyVWdQU0JtWVd4elpWeHVJQ0JtYjNJZ0tEczdLU0I3WEc0Z0lDQWdjM2RwZEdOb0lDaGxibU52WkdsdVp5a2dlMXh1SUNBZ0lDQWdZMkZ6WlNBbllYTmphV2tuT2x4dUlDQWdJQ0FnWTJGelpTQW5iR0YwYVc0eEp6cGNiaUFnSUNBZ0lHTmhjMlVnSjJKcGJtRnllU2M2WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJzWlc1Y2JpQWdJQ0FnSUdOaGMyVWdKM1YwWmpnbk9seHVJQ0FnSUNBZ1kyRnpaU0FuZFhSbUxUZ25PbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkWFJtT0ZSdlFubDBaWE1vYzNSeWFXNW5LUzVzWlc1bmRHaGNiaUFnSUNBZ0lHTmhjMlVnSjNWamN6SW5PbHh1SUNBZ0lDQWdZMkZ6WlNBbmRXTnpMVEluT2x4dUlDQWdJQ0FnWTJGelpTQW5kWFJtTVRac1pTYzZYRzRnSUNBZ0lDQmpZWE5sSUNkMWRHWXRNVFpzWlNjNlhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCc1pXNGdLaUF5WEc0Z0lDQWdJQ0JqWVhObElDZG9aWGduT2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYkdWdUlENCtQaUF4WEc0Z0lDQWdJQ0JqWVhObElDZGlZWE5sTmpRbk9seHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ltRnpaVFkwVkc5Q2VYUmxjeWh6ZEhKcGJtY3BMbXhsYm1kMGFGeHVJQ0FnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUNBZ2FXWWdLR3h2ZDJWeVpXUkRZWE5sS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHMTFjM1JOWVhSamFDQS9JQzB4SURvZ2RYUm1PRlJ2UW5sMFpYTW9jM1J5YVc1bktTNXNaVzVuZEdnZ0x5OGdZWE56ZFcxbElIVjBaamhjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCbGJtTnZaR2x1WnlBOUlDZ25KeUFySUdWdVkyOWthVzVuS1M1MGIweHZkMlZ5UTJGelpTZ3BYRzRnSUNBZ0lDQWdJR3h2ZDJWeVpXUkRZWE5sSUQwZ2RISjFaVnh1SUNBZ0lIMWNiaUFnZlZ4dWZWeHVRblZtWm1WeUxtSjVkR1ZNWlc1bmRHZ2dQU0JpZVhSbFRHVnVaM1JvWEc1Y2JtWjFibU4wYVc5dUlITnNiM2RVYjFOMGNtbHVaeUFvWlc1amIyUnBibWNzSUhOMFlYSjBMQ0JsYm1RcElIdGNiaUFnZG1GeUlHeHZkMlZ5WldSRFlYTmxJRDBnWm1Gc2MyVmNibHh1SUNBdkx5Qk9ieUJ1WldWa0lIUnZJSFpsY21sbWVTQjBhR0YwSUZ3aWRHaHBjeTVzWlc1bmRHZ2dQRDBnVFVGWVgxVkpUbFF6TWx3aUlITnBibU5sSUdsMEozTWdZU0J5WldGa0xXOXViSGxjYmlBZ0x5OGdjSEp2Y0dWeWRIa2diMllnWVNCMGVYQmxaQ0JoY25KaGVTNWNibHh1SUNBdkx5QlVhR2x6SUdKbGFHRjJaWE1nYm1WcGRHaGxjaUJzYVd0bElGTjBjbWx1WnlCdWIzSWdWV2x1ZERoQmNuSmhlU0JwYmlCMGFHRjBJSGRsSUhObGRDQnpkR0Z5ZEM5bGJtUmNiaUFnTHk4Z2RHOGdkR2hsYVhJZ2RYQndaWEl2Ykc5M1pYSWdZbTkxYm1SeklHbG1JSFJvWlNCMllXeDFaU0J3WVhOelpXUWdhWE1nYjNWMElHOW1JSEpoYm1kbExseHVJQ0F2THlCMWJtUmxabWx1WldRZ2FYTWdhR0Z1Wkd4bFpDQnpjR1ZqYVdGc2JIa2dZWE1nY0dWeUlFVkRUVUV0TWpZeUlEWjBhQ0JGWkdsMGFXOXVMRnh1SUNBdkx5QlRaV04wYVc5dUlERXpMak11TXk0M0lGSjFiblJwYldVZ1UyVnRZVzUwYVdOek9pQkxaWGxsWkVKcGJtUnBibWRKYm1sMGFXRnNhWHBoZEdsdmJpNWNiaUFnYVdZZ0tITjBZWEowSUQwOVBTQjFibVJsWm1sdVpXUWdmSHdnYzNSaGNuUWdQQ0F3S1NCN1hHNGdJQ0FnYzNSaGNuUWdQU0F3WEc0Z0lIMWNiaUFnTHk4Z1VtVjBkWEp1SUdWaGNteDVJR2xtSUhOMFlYSjBJRDRnZEdocGN5NXNaVzVuZEdndUlFUnZibVVnYUdWeVpTQjBieUJ3Y21WMlpXNTBJSEJ2ZEdWdWRHbGhiQ0IxYVc1ME16SmNiaUFnTHk4Z1kyOWxjbU5wYjI0Z1ptRnBiQ0JpWld4dmR5NWNiaUFnYVdZZ0tITjBZWEowSUQ0Z2RHaHBjeTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0p5ZGNiaUFnZlZ4dVhHNGdJR2xtSUNobGJtUWdQVDA5SUhWdVpHVm1hVzVsWkNCOGZDQmxibVFnUGlCMGFHbHpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lHVnVaQ0E5SUhSb2FYTXViR1Z1WjNSb1hHNGdJSDFjYmx4dUlDQnBaaUFvWlc1a0lEdzlJREFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdKeWRjYmlBZ2ZWeHVYRzRnSUM4dklFWnZjbU5sSUdOdlpYSnphVzl1SUhSdklIVnBiblF6TWk0Z1ZHaHBjeUIzYVd4c0lHRnNjMjhnWTI5bGNtTmxJR1poYkhObGVTOU9ZVTRnZG1Gc2RXVnpJSFJ2SURBdVhHNGdJR1Z1WkNBK1BqNDlJREJjYmlBZ2MzUmhjblFnUGo0K1BTQXdYRzVjYmlBZ2FXWWdLR1Z1WkNBOFBTQnpkR0Z5ZENrZ2UxeHVJQ0FnSUhKbGRIVnliaUFuSjF4dUlDQjlYRzVjYmlBZ2FXWWdLQ0ZsYm1OdlpHbHVaeWtnWlc1amIyUnBibWNnUFNBbmRYUm1PQ2RjYmx4dUlDQjNhR2xzWlNBb2RISjFaU2tnZTF4dUlDQWdJSE4zYVhSamFDQW9aVzVqYjJScGJtY3BJSHRjYmlBZ0lDQWdJR05oYzJVZ0oyaGxlQ2M2WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJvWlhoVGJHbGpaU2gwYUdsekxDQnpkR0Z5ZEN3Z1pXNWtLVnh1WEc0Z0lDQWdJQ0JqWVhObElDZDFkR1k0SnpwY2JpQWdJQ0FnSUdOaGMyVWdKM1YwWmkwNEp6cGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIVjBaamhUYkdsalpTaDBhR2x6TENCemRHRnlkQ3dnWlc1a0tWeHVYRzRnSUNBZ0lDQmpZWE5sSUNkaGMyTnBhU2M2WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJoYzJOcGFWTnNhV05sS0hSb2FYTXNJSE4wWVhKMExDQmxibVFwWEc1Y2JpQWdJQ0FnSUdOaGMyVWdKMnhoZEdsdU1TYzZYRzRnSUNBZ0lDQmpZWE5sSUNkaWFXNWhjbmtuT2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYkdGMGFXNHhVMnhwWTJVb2RHaHBjeXdnYzNSaGNuUXNJR1Z1WkNsY2JseHVJQ0FnSUNBZ1kyRnpaU0FuWW1GelpUWTBKenBjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR0poYzJVMk5GTnNhV05sS0hSb2FYTXNJSE4wWVhKMExDQmxibVFwWEc1Y2JpQWdJQ0FnSUdOaGMyVWdKM1ZqY3pJbk9seHVJQ0FnSUNBZ1kyRnpaU0FuZFdOekxUSW5PbHh1SUNBZ0lDQWdZMkZ6WlNBbmRYUm1NVFpzWlNjNlhHNGdJQ0FnSUNCallYTmxJQ2QxZEdZdE1UWnNaU2M2WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIxZEdZeE5teGxVMnhwWTJVb2RHaHBjeXdnYzNSaGNuUXNJR1Z1WkNsY2JseHVJQ0FnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUNBZ2FXWWdLR3h2ZDJWeVpXUkRZWE5sS1NCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtDZFZibXR1YjNkdUlHVnVZMjlrYVc1bk9pQW5JQ3NnWlc1amIyUnBibWNwWEc0Z0lDQWdJQ0FnSUdWdVkyOWthVzVuSUQwZ0tHVnVZMjlrYVc1bklDc2dKeWNwTG5SdlRHOTNaWEpEWVhObEtDbGNiaUFnSUNBZ0lDQWdiRzkzWlhKbFpFTmhjMlVnUFNCMGNuVmxYRzRnSUNBZ2ZWeHVJQ0I5WEc1OVhHNWNiaTh2SUZSb2FYTWdjSEp2Y0dWeWRIa2dhWE1nZFhObFpDQmllU0JnUW5WbVptVnlMbWx6UW5WbVptVnlZQ0FvWVc1a0lIUm9aU0JnYVhNdFluVm1abVZ5WUNCdWNHMGdjR0ZqYTJGblpTbGNiaTh2SUhSdklHUmxkR1ZqZENCaElFSjFabVpsY2lCcGJuTjBZVzVqWlM0Z1NYUW5jeUJ1YjNRZ2NHOXpjMmxpYkdVZ2RHOGdkWE5sSUdCcGJuTjBZVzVqWlc5bUlFSjFabVpsY21CY2JpOHZJSEpsYkdsaFlteDVJR2x1SUdFZ1luSnZkM05sY21sbWVTQmpiMjUwWlhoMElHSmxZMkYxYzJVZ2RHaGxjbVVnWTI5MWJHUWdZbVVnYlhWc2RHbHdiR1VnWkdsbVptVnlaVzUwWEc0dkx5QmpiM0JwWlhNZ2IyWWdkR2hsSUNkaWRXWm1aWEluSUhCaFkydGhaMlVnYVc0Z2RYTmxMaUJVYUdseklHMWxkR2h2WkNCM2IzSnJjeUJsZG1WdUlHWnZjaUJDZFdabVpYSmNiaTh2SUdsdWMzUmhibU5sY3lCMGFHRjBJSGRsY21VZ1kzSmxZWFJsWkNCbWNtOXRJR0Z1YjNSb1pYSWdZMjl3ZVNCdlppQjBhR1VnWUdKMVptWmxjbUFnY0dGamEyRm5aUzVjYmk4dklGTmxaVG9nYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDJabGNtOXpjeTlpZFdabVpYSXZhWE56ZFdWekx6RTFORnh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzVmYVhOQ2RXWm1aWElnUFNCMGNuVmxYRzVjYm1aMWJtTjBhVzl1SUhOM1lYQWdLR0lzSUc0c0lHMHBJSHRjYmlBZ2RtRnlJR2tnUFNCaVcyNWRYRzRnSUdKYmJsMGdQU0JpVzIxZFhHNGdJR0piYlYwZ1BTQnBYRzU5WEc1Y2JrSjFabVpsY2k1d2NtOTBiM1I1Y0dVdWMzZGhjREUySUQwZ1puVnVZM1JwYjI0Z2MzZGhjREUySUNncElIdGNiaUFnZG1GeUlHeGxiaUE5SUhSb2FYTXViR1Z1WjNSb1hHNGdJR2xtSUNoc1pXNGdKU0F5SUNFOVBTQXdLU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRkpoYm1kbFJYSnliM0lvSjBKMVptWmxjaUJ6YVhwbElHMTFjM1FnWW1VZ1lTQnRkV3gwYVhCc1pTQnZaaUF4TmkxaWFYUnpKeWxjYmlBZ2ZWeHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUd4bGJqc2dhU0FyUFNBeUtTQjdYRzRnSUNBZ2MzZGhjQ2gwYUdsekxDQnBMQ0JwSUNzZ01TbGNiaUFnZlZ4dUlDQnlaWFIxY200Z2RHaHBjMXh1ZlZ4dVhHNUNkV1ptWlhJdWNISnZkRzkwZVhCbExuTjNZWEF6TWlBOUlHWjFibU4wYVc5dUlITjNZWEF6TWlBb0tTQjdYRzRnSUhaaGNpQnNaVzRnUFNCMGFHbHpMbXhsYm1kMGFGeHVJQ0JwWmlBb2JHVnVJQ1VnTkNBaFBUMGdNQ2tnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJTWVc1blpVVnljbTl5S0NkQ2RXWm1aWElnYzJsNlpTQnRkWE4wSUdKbElHRWdiWFZzZEdsd2JHVWdiMllnTXpJdFltbDBjeWNwWEc0Z0lIMWNiaUFnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCc1pXNDdJR2tnS3owZ05Da2dlMXh1SUNBZ0lITjNZWEFvZEdocGN5d2dhU3dnYVNBcklETXBYRzRnSUNBZ2MzZGhjQ2gwYUdsekxDQnBJQ3NnTVN3Z2FTQXJJRElwWEc0Z0lIMWNiaUFnY21WMGRYSnVJSFJvYVhOY2JuMWNibHh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzV6ZDJGd05qUWdQU0JtZFc1amRHbHZiaUJ6ZDJGd05qUWdLQ2tnZTF4dUlDQjJZWElnYkdWdUlEMGdkR2hwY3k1c1pXNW5kR2hjYmlBZ2FXWWdLR3hsYmlBbElEZ2dJVDA5SURBcElIdGNiaUFnSUNCMGFISnZkeUJ1WlhjZ1VtRnVaMlZGY25KdmNpZ25RblZtWm1WeUlITnBlbVVnYlhWemRDQmlaU0JoSUcxMWJIUnBjR3hsSUc5bUlEWTBMV0pwZEhNbktWeHVJQ0I5WEc0Z0lHWnZjaUFvZG1GeUlHa2dQU0F3T3lCcElEd2diR1Z1T3lCcElDczlJRGdwSUh0Y2JpQWdJQ0J6ZDJGd0tIUm9hWE1zSUdrc0lHa2dLeUEzS1Z4dUlDQWdJSE4zWVhBb2RHaHBjeXdnYVNBcklERXNJR2tnS3lBMktWeHVJQ0FnSUhOM1lYQW9kR2hwY3l3Z2FTQXJJRElzSUdrZ0t5QTFLVnh1SUNBZ0lITjNZWEFvZEdocGN5d2dhU0FySURNc0lHa2dLeUEwS1Z4dUlDQjlYRzRnSUhKbGRIVnliaUIwYUdselhHNTlYRzVjYmtKMVptWmxjaTV3Y205MGIzUjVjR1V1ZEc5VGRISnBibWNnUFNCbWRXNWpkR2x2YmlCMGIxTjBjbWx1WnlBb0tTQjdYRzRnSUhaaGNpQnNaVzVuZEdnZ1BTQjBhR2x6TG14bGJtZDBhRnh1SUNCcFppQW9iR1Z1WjNSb0lEMDlQU0F3S1NCeVpYUjFjbTRnSnlkY2JpQWdhV1lnS0dGeVozVnRaVzUwY3k1c1pXNW5kR2dnUFQwOUlEQXBJSEpsZEhWeWJpQjFkR1k0VTJ4cFkyVW9kR2hwY3l3Z01Dd2diR1Z1WjNSb0tWeHVJQ0J5WlhSMWNtNGdjMnh2ZDFSdlUzUnlhVzVuTG1Gd2NHeDVLSFJvYVhNc0lHRnlaM1Z0Wlc1MGN5bGNibjFjYmx4dVFuVm1abVZ5TG5CeWIzUnZkSGx3WlM1MGIweHZZMkZzWlZOMGNtbHVaeUE5SUVKMVptWmxjaTV3Y205MGIzUjVjR1V1ZEc5VGRISnBibWRjYmx4dVFuVm1abVZ5TG5CeWIzUnZkSGx3WlM1bGNYVmhiSE1nUFNCbWRXNWpkR2x2YmlCbGNYVmhiSE1nS0dJcElIdGNiaUFnYVdZZ0tDRkNkV1ptWlhJdWFYTkNkV1ptWlhJb1lpa3BJSFJvY205M0lHNWxkeUJVZVhCbFJYSnliM0lvSjBGeVozVnRaVzUwSUcxMWMzUWdZbVVnWVNCQ2RXWm1aWEluS1Z4dUlDQnBaaUFvZEdocGN5QTlQVDBnWWlrZ2NtVjBkWEp1SUhSeWRXVmNiaUFnY21WMGRYSnVJRUoxWm1abGNpNWpiMjF3WVhKbEtIUm9hWE1zSUdJcElEMDlQU0F3WEc1OVhHNWNia0oxWm1abGNpNXdjbTkwYjNSNWNHVXVhVzV6Y0dWamRDQTlJR1oxYm1OMGFXOXVJR2x1YzNCbFkzUWdLQ2tnZTF4dUlDQjJZWElnYzNSeUlEMGdKeWRjYmlBZ2RtRnlJRzFoZUNBOUlHVjRjRzl5ZEhNdVNVNVRVRVZEVkY5TlFWaGZRbGxVUlZOY2JpQWdjM1J5SUQwZ2RHaHBjeTUwYjFOMGNtbHVaeWduYUdWNEp5d2dNQ3dnYldGNEtTNXlaWEJzWVdObEtDOG9MbnN5ZlNrdlp5d2dKeVF4SUNjcExuUnlhVzBvS1Z4dUlDQnBaaUFvZEdocGN5NXNaVzVuZEdnZ1BpQnRZWGdwSUhOMGNpQXJQU0FuSUM0dUxpQW5YRzRnSUhKbGRIVnliaUFuUEVKMVptWmxjaUFuSUNzZ2MzUnlJQ3NnSno0blhHNTlYRzVjYmtKMVptWmxjaTV3Y205MGIzUjVjR1V1WTI5dGNHRnlaU0E5SUdaMWJtTjBhVzl1SUdOdmJYQmhjbVVnS0hSaGNtZGxkQ3dnYzNSaGNuUXNJR1Z1WkN3Z2RHaHBjMU4wWVhKMExDQjBhR2x6Ulc1a0tTQjdYRzRnSUdsbUlDaHBjMGx1YzNSaGJtTmxLSFJoY21kbGRDd2dWV2x1ZERoQmNuSmhlU2twSUh0Y2JpQWdJQ0IwWVhKblpYUWdQU0JDZFdabVpYSXVabkp2YlNoMFlYSm5aWFFzSUhSaGNtZGxkQzV2Wm1aelpYUXNJSFJoY21kbGRDNWllWFJsVEdWdVozUm9LVnh1SUNCOVhHNGdJR2xtSUNnaFFuVm1abVZ5TG1selFuVm1abVZ5S0hSaGNtZGxkQ2twSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0Z4dUlDQWdJQ0FnSjFSb1pTQmNJblJoY21kbGRGd2lJR0Z5WjNWdFpXNTBJRzExYzNRZ1ltVWdiMjVsSUc5bUlIUjVjR1VnUW5WbVptVnlJRzl5SUZWcGJuUTRRWEp5WVhrdUlDY2dLMXh1SUNBZ0lDQWdKMUpsWTJWcGRtVmtJSFI1Y0dVZ0p5QXJJQ2gwZVhCbGIyWWdkR0Z5WjJWMEtWeHVJQ0FnSUNsY2JpQWdmVnh1WEc0Z0lHbG1JQ2h6ZEdGeWRDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnYzNSaGNuUWdQU0F3WEc0Z0lIMWNiaUFnYVdZZ0tHVnVaQ0E5UFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ1pXNWtJRDBnZEdGeVoyVjBJRDhnZEdGeVoyVjBMbXhsYm1kMGFDQTZJREJjYmlBZ2ZWeHVJQ0JwWmlBb2RHaHBjMU4wWVhKMElEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0IwYUdselUzUmhjblFnUFNBd1hHNGdJSDFjYmlBZ2FXWWdLSFJvYVhORmJtUWdQVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUhSb2FYTkZibVFnUFNCMGFHbHpMbXhsYm1kMGFGeHVJQ0I5WEc1Y2JpQWdhV1lnS0hOMFlYSjBJRHdnTUNCOGZDQmxibVFnUGlCMFlYSm5aWFF1YkdWdVozUm9JSHg4SUhSb2FYTlRkR0Z5ZENBOElEQWdmSHdnZEdocGMwVnVaQ0ErSUhSb2FYTXViR1Z1WjNSb0tTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lGSmhibWRsUlhKeWIzSW9KMjkxZENCdlppQnlZVzVuWlNCcGJtUmxlQ2NwWEc0Z0lIMWNibHh1SUNCcFppQW9kR2hwYzFOMFlYSjBJRDQ5SUhSb2FYTkZibVFnSmlZZ2MzUmhjblFnUGowZ1pXNWtLU0I3WEc0Z0lDQWdjbVYwZFhKdUlEQmNiaUFnZlZ4dUlDQnBaaUFvZEdocGMxTjBZWEowSUQ0OUlIUm9hWE5GYm1RcElIdGNiaUFnSUNCeVpYUjFjbTRnTFRGY2JpQWdmVnh1SUNCcFppQW9jM1JoY25RZ1BqMGdaVzVrS1NCN1hHNGdJQ0FnY21WMGRYSnVJREZjYmlBZ2ZWeHVYRzRnSUhOMFlYSjBJRDQrUGowZ01GeHVJQ0JsYm1RZ1BqNCtQU0F3WEc0Z0lIUm9hWE5UZEdGeWRDQStQajQ5SURCY2JpQWdkR2hwYzBWdVpDQStQajQ5SURCY2JseHVJQ0JwWmlBb2RHaHBjeUE5UFQwZ2RHRnlaMlYwS1NCeVpYUjFjbTRnTUZ4dVhHNGdJSFpoY2lCNElEMGdkR2hwYzBWdVpDQXRJSFJvYVhOVGRHRnlkRnh1SUNCMllYSWdlU0E5SUdWdVpDQXRJSE4wWVhKMFhHNGdJSFpoY2lCc1pXNGdQU0JOWVhSb0xtMXBiaWg0TENCNUtWeHVYRzRnSUhaaGNpQjBhR2x6UTI5d2VTQTlJSFJvYVhNdWMyeHBZMlVvZEdocGMxTjBZWEowTENCMGFHbHpSVzVrS1Z4dUlDQjJZWElnZEdGeVoyVjBRMjl3ZVNBOUlIUmhjbWRsZEM1emJHbGpaU2h6ZEdGeWRDd2daVzVrS1Z4dVhHNGdJR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnYkdWdU95QXJLMmtwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjME52Y0hsYmFWMGdJVDA5SUhSaGNtZGxkRU52Y0hsYmFWMHBJSHRjYmlBZ0lDQWdJSGdnUFNCMGFHbHpRMjl3ZVZ0cFhWeHVJQ0FnSUNBZ2VTQTlJSFJoY21kbGRFTnZjSGxiYVYxY2JpQWdJQ0FnSUdKeVpXRnJYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdhV1lnS0hnZ1BDQjVLU0J5WlhSMWNtNGdMVEZjYmlBZ2FXWWdLSGtnUENCNEtTQnlaWFIxY200Z01WeHVJQ0J5WlhSMWNtNGdNRnh1ZlZ4dVhHNHZMeUJHYVc1a2N5QmxhWFJvWlhJZ2RHaGxJR1pwY25OMElHbHVaR1Y0SUc5bUlHQjJZV3hnSUdsdUlHQmlkV1ptWlhKZ0lHRjBJRzltWm5ObGRDQStQU0JnWW5sMFpVOW1abk5sZEdBc1hHNHZMeUJQVWlCMGFHVWdiR0Z6ZENCcGJtUmxlQ0J2WmlCZ2RtRnNZQ0JwYmlCZ1luVm1abVZ5WUNCaGRDQnZabVp6WlhRZ1BEMGdZR0o1ZEdWUFptWnpaWFJnTGx4dUx5OWNiaTh2SUVGeVozVnRaVzUwY3pwY2JpOHZJQzBnWW5WbVptVnlJQzBnWVNCQ2RXWm1aWElnZEc4Z2MyVmhjbU5vWEc0dkx5QXRJSFpoYkNBdElHRWdjM1J5YVc1bkxDQkNkV1ptWlhJc0lHOXlJRzUxYldKbGNseHVMeThnTFNCaWVYUmxUMlptYzJWMElDMGdZVzRnYVc1a1pYZ2dhVzUwYnlCZ1luVm1abVZ5WURzZ2QybHNiQ0JpWlNCamJHRnRjR1ZrSUhSdklHRnVJR2x1ZERNeVhHNHZMeUF0SUdWdVkyOWthVzVuSUMwZ1lXNGdiM0IwYVc5dVlXd2daVzVqYjJScGJtY3NJSEpsYkdWMllXNTBJR2x6SUhaaGJDQnBjeUJoSUhOMGNtbHVaMXh1THk4Z0xTQmthWElnTFNCMGNuVmxJR1p2Y2lCcGJtUmxlRTltTENCbVlXeHpaU0JtYjNJZ2JHRnpkRWx1WkdWNFQyWmNibVoxYm1OMGFXOXVJR0pwWkdseVpXTjBhVzl1WVd4SmJtUmxlRTltSUNoaWRXWm1aWElzSUhaaGJDd2dZbmwwWlU5bVpuTmxkQ3dnWlc1amIyUnBibWNzSUdScGNpa2dlMXh1SUNBdkx5QkZiWEIwZVNCaWRXWm1aWElnYldWaGJuTWdibThnYldGMFkyaGNiaUFnYVdZZ0tHSjFabVpsY2k1c1pXNW5kR2dnUFQwOUlEQXBJSEpsZEhWeWJpQXRNVnh1WEc0Z0lDOHZJRTV2Y20xaGJHbDZaU0JpZVhSbFQyWm1jMlYwWEc0Z0lHbG1JQ2gwZVhCbGIyWWdZbmwwWlU5bVpuTmxkQ0E5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNCbGJtTnZaR2x1WnlBOUlHSjVkR1ZQWm1aelpYUmNiaUFnSUNCaWVYUmxUMlptYzJWMElEMGdNRnh1SUNCOUlHVnNjMlVnYVdZZ0tHSjVkR1ZQWm1aelpYUWdQaUF3ZURkbVptWm1abVptS1NCN1hHNGdJQ0FnWW5sMFpVOW1abk5sZENBOUlEQjROMlptWm1abVptWmNiaUFnZlNCbGJITmxJR2xtSUNoaWVYUmxUMlptYzJWMElEd2dMVEI0T0RBd01EQXdNREFwSUh0Y2JpQWdJQ0JpZVhSbFQyWm1jMlYwSUQwZ0xUQjRPREF3TURBd01EQmNiaUFnZlZ4dUlDQmllWFJsVDJabWMyVjBJRDBnSzJKNWRHVlBabVp6WlhRZ0x5OGdRMjlsY21ObElIUnZJRTUxYldKbGNpNWNiaUFnYVdZZ0tHNTFiV0psY2tselRtRk9LR0o1ZEdWUFptWnpaWFFwS1NCN1hHNGdJQ0FnTHk4Z1lubDBaVTltWm5ObGREb2dhWFFnYVhRbmN5QjFibVJsWm1sdVpXUXNJRzUxYkd3c0lFNWhUaXdnWENKbWIyOWNJaXdnWlhSakxDQnpaV0Z5WTJnZ2QyaHZiR1VnWW5WbVptVnlYRzRnSUNBZ1lubDBaVTltWm5ObGRDQTlJR1JwY2lBL0lEQWdPaUFvWW5WbVptVnlMbXhsYm1kMGFDQXRJREVwWEc0Z0lIMWNibHh1SUNBdkx5Qk9iM0p0WVd4cGVtVWdZbmwwWlU5bVpuTmxkRG9nYm1WbllYUnBkbVVnYjJabWMyVjBjeUJ6ZEdGeWRDQm1jbTl0SUhSb1pTQmxibVFnYjJZZ2RHaGxJR0oxWm1abGNseHVJQ0JwWmlBb1lubDBaVTltWm5ObGRDQThJREFwSUdKNWRHVlBabVp6WlhRZ1BTQmlkV1ptWlhJdWJHVnVaM1JvSUNzZ1lubDBaVTltWm5ObGRGeHVJQ0JwWmlBb1lubDBaVTltWm5ObGRDQStQU0JpZFdabVpYSXViR1Z1WjNSb0tTQjdYRzRnSUNBZ2FXWWdLR1JwY2lrZ2NtVjBkWEp1SUMweFhHNGdJQ0FnWld4elpTQmllWFJsVDJabWMyVjBJRDBnWW5WbVptVnlMbXhsYm1kMGFDQXRJREZjYmlBZ2ZTQmxiSE5sSUdsbUlDaGllWFJsVDJabWMyVjBJRHdnTUNrZ2UxeHVJQ0FnSUdsbUlDaGthWElwSUdKNWRHVlBabVp6WlhRZ1BTQXdYRzRnSUNBZ1pXeHpaU0J5WlhSMWNtNGdMVEZjYmlBZ2ZWeHVYRzRnSUM4dklFNXZjbTFoYkdsNlpTQjJZV3hjYmlBZ2FXWWdLSFI1Y0dWdlppQjJZV3dnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ2RtRnNJRDBnUW5WbVptVnlMbVp5YjIwb2RtRnNMQ0JsYm1OdlpHbHVaeWxjYmlBZ2ZWeHVYRzRnSUM4dklFWnBibUZzYkhrc0lITmxZWEpqYUNCbGFYUm9aWElnYVc1a1pYaFBaaUFvYVdZZ1pHbHlJR2x6SUhSeWRXVXBJRzl5SUd4aGMzUkpibVJsZUU5bVhHNGdJR2xtSUNoQ2RXWm1aWEl1YVhOQ2RXWm1aWElvZG1Gc0tTa2dlMXh1SUNBZ0lDOHZJRk53WldOcFlXd2dZMkZ6WlRvZ2JHOXZhMmx1WnlCbWIzSWdaVzF3ZEhrZ2MzUnlhVzVuTDJKMVptWmxjaUJoYkhkaGVYTWdabUZwYkhOY2JpQWdJQ0JwWmlBb2RtRnNMbXhsYm1kMGFDQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUMweFhHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQmhjbkpoZVVsdVpHVjRUMllvWW5WbVptVnlMQ0IyWVd3c0lHSjVkR1ZQWm1aelpYUXNJR1Z1WTI5a2FXNW5MQ0JrYVhJcFhHNGdJSDBnWld4elpTQnBaaUFvZEhsd1pXOW1JSFpoYkNBOVBUMGdKMjUxYldKbGNpY3BJSHRjYmlBZ0lDQjJZV3dnUFNCMllXd2dKaUF3ZUVaR0lDOHZJRk5sWVhKamFDQm1iM0lnWVNCaWVYUmxJSFpoYkhWbElGc3dMVEkxTlYxY2JpQWdJQ0JwWmlBb2RIbHdaVzltSUZWcGJuUTRRWEp5WVhrdWNISnZkRzkwZVhCbExtbHVaR1Y0VDJZZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUdsbUlDaGthWElwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUZWcGJuUTRRWEp5WVhrdWNISnZkRzkwZVhCbExtbHVaR1Y0VDJZdVkyRnNiQ2hpZFdabVpYSXNJSFpoYkN3Z1lubDBaVTltWm5ObGRDbGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCVmFXNTBPRUZ5Y21GNUxuQnliM1J2ZEhsd1pTNXNZWE4wU1c1a1pYaFBaaTVqWVd4c0tHSjFabVpsY2l3Z2RtRnNMQ0JpZVhSbFQyWm1jMlYwS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z1lYSnlZWGxKYm1SbGVFOW1LR0oxWm1abGNpd2dXeUIyWVd3Z1hTd2dZbmwwWlU5bVpuTmxkQ3dnWlc1amIyUnBibWNzSUdScGNpbGNiaUFnZlZ4dVhHNGdJSFJvY205M0lHNWxkeUJVZVhCbFJYSnliM0lvSjNaaGJDQnRkWE4wSUdKbElITjBjbWx1Wnl3Z2JuVnRZbVZ5SUc5eUlFSjFabVpsY2ljcFhHNTlYRzVjYm1aMWJtTjBhVzl1SUdGeWNtRjVTVzVrWlhoUFppQW9ZWEp5TENCMllXd3NJR0o1ZEdWUFptWnpaWFFzSUdWdVkyOWthVzVuTENCa2FYSXBJSHRjYmlBZ2RtRnlJR2x1WkdWNFUybDZaU0E5SURGY2JpQWdkbUZ5SUdGeWNreGxibWQwYUNBOUlHRnljaTVzWlc1bmRHaGNiaUFnZG1GeUlIWmhiRXhsYm1kMGFDQTlJSFpoYkM1c1pXNW5kR2hjYmx4dUlDQnBaaUFvWlc1amIyUnBibWNnSVQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lHVnVZMjlrYVc1bklEMGdVM1J5YVc1bktHVnVZMjlrYVc1bktTNTBiMHh2ZDJWeVEyRnpaU2dwWEc0Z0lDQWdhV1lnS0dWdVkyOWthVzVuSUQwOVBTQW5kV056TWljZ2ZId2daVzVqYjJScGJtY2dQVDA5SUNkMVkzTXRNaWNnZkh4Y2JpQWdJQ0FnSUNBZ1pXNWpiMlJwYm1jZ1BUMDlJQ2QxZEdZeE5teGxKeUI4ZkNCbGJtTnZaR2x1WnlBOVBUMGdKM1YwWmkweE5teGxKeWtnZTF4dUlDQWdJQ0FnYVdZZ0tHRnljaTVzWlc1bmRHZ2dQQ0F5SUh4OElIWmhiQzVzWlc1bmRHZ2dQQ0F5S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlBdE1WeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2FXNWtaWGhUYVhwbElEMGdNbHh1SUNBZ0lDQWdZWEp5VEdWdVozUm9JQzg5SURKY2JpQWdJQ0FnSUhaaGJFeGxibWQwYUNBdlBTQXlYRzRnSUNBZ0lDQmllWFJsVDJabWMyVjBJQzg5SURKY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCbWRXNWpkR2x2YmlCeVpXRmtJQ2hpZFdZc0lHa3BJSHRjYmlBZ0lDQnBaaUFvYVc1a1pYaFRhWHBsSUQwOVBTQXhLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZblZtVzJsZFhHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmlkV1l1Y21WaFpGVkpiblF4TmtKRktHa2dLaUJwYm1SbGVGTnBlbVVwWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnZG1GeUlHbGNiaUFnYVdZZ0tHUnBjaWtnZTF4dUlDQWdJSFpoY2lCbWIzVnVaRWx1WkdWNElEMGdMVEZjYmlBZ0lDQm1iM0lnS0drZ1BTQmllWFJsVDJabWMyVjBPeUJwSUR3Z1lYSnlUR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUdsbUlDaHlaV0ZrS0dGeWNpd2dhU2tnUFQwOUlISmxZV1FvZG1Gc0xDQm1iM1Z1WkVsdVpHVjRJRDA5UFNBdE1TQS9JREFnT2lCcElDMGdabTkxYm1SSmJtUmxlQ2twSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR1p2ZFc1a1NXNWtaWGdnUFQwOUlDMHhLU0JtYjNWdVpFbHVaR1Y0SUQwZ2FWeHVJQ0FnSUNBZ0lDQnBaaUFvYVNBdElHWnZkVzVrU1c1a1pYZ2dLeUF4SUQwOVBTQjJZV3hNWlc1bmRHZ3BJSEpsZEhWeWJpQm1iM1Z1WkVsdVpHVjRJQ29nYVc1a1pYaFRhWHBsWEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0JwWmlBb1ptOTFibVJKYm1SbGVDQWhQVDBnTFRFcElHa2dMVDBnYVNBdElHWnZkVzVrU1c1a1pYaGNiaUFnSUNBZ0lDQWdabTkxYm1SSmJtUmxlQ0E5SUMweFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUdsbUlDaGllWFJsVDJabWMyVjBJQ3NnZG1Gc1RHVnVaM1JvSUQ0Z1lYSnlUR1Z1WjNSb0tTQmllWFJsVDJabWMyVjBJRDBnWVhKeVRHVnVaM1JvSUMwZ2RtRnNUR1Z1WjNSb1hHNGdJQ0FnWm05eUlDaHBJRDBnWW5sMFpVOW1abk5sZERzZ2FTQStQU0F3T3lCcExTMHBJSHRjYmlBZ0lDQWdJSFpoY2lCbWIzVnVaQ0E5SUhSeWRXVmNiaUFnSUNBZ0lHWnZjaUFvZG1GeUlHb2dQU0F3T3lCcUlEd2dkbUZzVEdWdVozUm9PeUJxS3lzcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0hKbFlXUW9ZWEp5TENCcElDc2dhaWtnSVQwOUlISmxZV1FvZG1Gc0xDQnFLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHWnZkVzVrSUQwZ1ptRnNjMlZjYmlBZ0lDQWdJQ0FnSUNCaWNtVmhhMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JwWmlBb1ptOTFibVFwSUhKbGRIVnliaUJwWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJQzB4WEc1OVhHNWNia0oxWm1abGNpNXdjbTkwYjNSNWNHVXVhVzVqYkhWa1pYTWdQU0JtZFc1amRHbHZiaUJwYm1Oc2RXUmxjeUFvZG1Gc0xDQmllWFJsVDJabWMyVjBMQ0JsYm1OdlpHbHVaeWtnZTF4dUlDQnlaWFIxY200Z2RHaHBjeTVwYm1SbGVFOW1LSFpoYkN3Z1lubDBaVTltWm5ObGRDd2daVzVqYjJScGJtY3BJQ0U5UFNBdE1WeHVmVnh1WEc1Q2RXWm1aWEl1Y0hKdmRHOTBlWEJsTG1sdVpHVjRUMllnUFNCbWRXNWpkR2x2YmlCcGJtUmxlRTltSUNoMllXd3NJR0o1ZEdWUFptWnpaWFFzSUdWdVkyOWthVzVuS1NCN1hHNGdJSEpsZEhWeWJpQmlhV1JwY21WamRHbHZibUZzU1c1a1pYaFBaaWgwYUdsekxDQjJZV3dzSUdKNWRHVlBabVp6WlhRc0lHVnVZMjlrYVc1bkxDQjBjblZsS1Z4dWZWeHVYRzVDZFdabVpYSXVjSEp2ZEc5MGVYQmxMbXhoYzNSSmJtUmxlRTltSUQwZ1puVnVZM1JwYjI0Z2JHRnpkRWx1WkdWNFQyWWdLSFpoYkN3Z1lubDBaVTltWm5ObGRDd2daVzVqYjJScGJtY3BJSHRjYmlBZ2NtVjBkWEp1SUdKcFpHbHlaV04wYVc5dVlXeEpibVJsZUU5bUtIUm9hWE1zSUhaaGJDd2dZbmwwWlU5bVpuTmxkQ3dnWlc1amIyUnBibWNzSUdaaGJITmxLVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm9aWGhYY21sMFpTQW9ZblZtTENCemRISnBibWNzSUc5bVpuTmxkQ3dnYkdWdVozUm9LU0I3WEc0Z0lHOW1abk5sZENBOUlFNTFiV0psY2lodlptWnpaWFFwSUh4OElEQmNiaUFnZG1GeUlISmxiV0ZwYm1sdVp5QTlJR0oxWmk1c1pXNW5kR2dnTFNCdlptWnpaWFJjYmlBZ2FXWWdLQ0ZzWlc1bmRHZ3BJSHRjYmlBZ0lDQnNaVzVuZEdnZ1BTQnlaVzFoYVc1cGJtZGNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQnNaVzVuZEdnZ1BTQk9kVzFpWlhJb2JHVnVaM1JvS1Z4dUlDQWdJR2xtSUNoc1pXNW5kR2dnUGlCeVpXMWhhVzVwYm1jcElIdGNiaUFnSUNBZ0lHeGxibWQwYUNBOUlISmxiV0ZwYm1sdVoxeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIWmhjaUJ6ZEhKTVpXNGdQU0J6ZEhKcGJtY3ViR1Z1WjNSb1hHNWNiaUFnYVdZZ0tHeGxibWQwYUNBK0lITjBja3hsYmlBdklESXBJSHRjYmlBZ0lDQnNaVzVuZEdnZ1BTQnpkSEpNWlc0Z0x5QXlYRzRnSUgxY2JpQWdabTl5SUNoMllYSWdhU0E5SURBN0lHa2dQQ0JzWlc1bmRHZzdJQ3NyYVNrZ2UxeHVJQ0FnSUhaaGNpQndZWEp6WldRZ1BTQndZWEp6WlVsdWRDaHpkSEpwYm1jdWMzVmljM1J5S0drZ0tpQXlMQ0F5S1N3Z01UWXBYRzRnSUNBZ2FXWWdLRzUxYldKbGNrbHpUbUZPS0hCaGNuTmxaQ2twSUhKbGRIVnliaUJwWEc0Z0lDQWdZblZtVzI5bVpuTmxkQ0FySUdsZElEMGdjR0Z5YzJWa1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUdsY2JuMWNibHh1Wm5WdVkzUnBiMjRnZFhSbU9GZHlhWFJsSUNoaWRXWXNJSE4wY21sdVp5d2diMlptYzJWMExDQnNaVzVuZEdncElIdGNiaUFnY21WMGRYSnVJR0pzYVhSQ2RXWm1aWElvZFhSbU9GUnZRbmwwWlhNb2MzUnlhVzVuTENCaWRXWXViR1Z1WjNSb0lDMGdiMlptYzJWMEtTd2dZblZtTENCdlptWnpaWFFzSUd4bGJtZDBhQ2xjYm4xY2JseHVablZ1WTNScGIyNGdZWE5qYVdsWGNtbDBaU0FvWW5WbUxDQnpkSEpwYm1jc0lHOW1abk5sZEN3Z2JHVnVaM1JvS1NCN1hHNGdJSEpsZEhWeWJpQmliR2wwUW5WbVptVnlLR0Z6WTJscFZHOUNlWFJsY3loemRISnBibWNwTENCaWRXWXNJRzltWm5ObGRDd2diR1Z1WjNSb0tWeHVmVnh1WEc1bWRXNWpkR2x2YmlCc1lYUnBiakZYY21sMFpTQW9ZblZtTENCemRISnBibWNzSUc5bVpuTmxkQ3dnYkdWdVozUm9LU0I3WEc0Z0lISmxkSFZ5YmlCaGMyTnBhVmR5YVhSbEtHSjFaaXdnYzNSeWFXNW5MQ0J2Wm1aelpYUXNJR3hsYm1kMGFDbGNibjFjYmx4dVpuVnVZM1JwYjI0Z1ltRnpaVFkwVjNKcGRHVWdLR0oxWml3Z2MzUnlhVzVuTENCdlptWnpaWFFzSUd4bGJtZDBhQ2tnZTF4dUlDQnlaWFIxY200Z1lteHBkRUoxWm1abGNpaGlZWE5sTmpSVWIwSjVkR1Z6S0hOMGNtbHVaeWtzSUdKMVppd2diMlptYzJWMExDQnNaVzVuZEdncFhHNTlYRzVjYm1aMWJtTjBhVzl1SUhWamN6SlhjbWwwWlNBb1luVm1MQ0J6ZEhKcGJtY3NJRzltWm5ObGRDd2diR1Z1WjNSb0tTQjdYRzRnSUhKbGRIVnliaUJpYkdsMFFuVm1abVZ5S0hWMFpqRTJiR1ZVYjBKNWRHVnpLSE4wY21sdVp5d2dZblZtTG14bGJtZDBhQ0F0SUc5bVpuTmxkQ2tzSUdKMVppd2diMlptYzJWMExDQnNaVzVuZEdncFhHNTlYRzVjYmtKMVptWmxjaTV3Y205MGIzUjVjR1V1ZDNKcGRHVWdQU0JtZFc1amRHbHZiaUIzY21sMFpTQW9jM1J5YVc1bkxDQnZabVp6WlhRc0lHeGxibWQwYUN3Z1pXNWpiMlJwYm1jcElIdGNiaUFnTHk4Z1FuVm1abVZ5STNkeWFYUmxLSE4wY21sdVp5bGNiaUFnYVdZZ0tHOW1abk5sZENBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdaVzVqYjJScGJtY2dQU0FuZFhSbU9DZGNiaUFnSUNCc1pXNW5kR2dnUFNCMGFHbHpMbXhsYm1kMGFGeHVJQ0FnSUc5bVpuTmxkQ0E5SURCY2JpQWdMeThnUW5WbVptVnlJM2R5YVhSbEtITjBjbWx1Wnl3Z1pXNWpiMlJwYm1jcFhHNGdJSDBnWld4elpTQnBaaUFvYkdWdVozUm9JRDA5UFNCMWJtUmxabWx1WldRZ0ppWWdkSGx3Wlc5bUlHOW1abk5sZENBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQmxibU52WkdsdVp5QTlJRzltWm5ObGRGeHVJQ0FnSUd4bGJtZDBhQ0E5SUhSb2FYTXViR1Z1WjNSb1hHNGdJQ0FnYjJabWMyVjBJRDBnTUZ4dUlDQXZMeUJDZFdabVpYSWpkM0pwZEdVb2MzUnlhVzVuTENCdlptWnpaWFJiTENCc1pXNW5kR2hkV3l3Z1pXNWpiMlJwYm1kZEtWeHVJQ0I5SUdWc2MyVWdhV1lnS0dselJtbHVhWFJsS0c5bVpuTmxkQ2twSUh0Y2JpQWdJQ0J2Wm1aelpYUWdQU0J2Wm1aelpYUWdQajQrSURCY2JpQWdJQ0JwWmlBb2FYTkdhVzVwZEdVb2JHVnVaM1JvS1NrZ2UxeHVJQ0FnSUNBZ2JHVnVaM1JvSUQwZ2JHVnVaM1JvSUQ0K1BpQXdYRzRnSUNBZ0lDQnBaaUFvWlc1amIyUnBibWNnUFQwOUlIVnVaR1ZtYVc1bFpDa2daVzVqYjJScGJtY2dQU0FuZFhSbU9DZGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnWlc1amIyUnBibWNnUFNCc1pXNW5kR2hjYmlBZ0lDQWdJR3hsYm1kMGFDQTlJSFZ1WkdWbWFXNWxaRnh1SUNBZ0lIMWNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hHNGdJQ0FnSUNBblFuVm1abVZ5TG5keWFYUmxLSE4wY21sdVp5d2daVzVqYjJScGJtY3NJRzltWm5ObGRGc3NJR3hsYm1kMGFGMHBJR2x6SUc1dklHeHZibWRsY2lCemRYQndiM0owWldRblhHNGdJQ0FnS1Z4dUlDQjlYRzVjYmlBZ2RtRnlJSEpsYldGcGJtbHVaeUE5SUhSb2FYTXViR1Z1WjNSb0lDMGdiMlptYzJWMFhHNGdJR2xtSUNoc1pXNW5kR2dnUFQwOUlIVnVaR1ZtYVc1bFpDQjhmQ0JzWlc1bmRHZ2dQaUJ5WlcxaGFXNXBibWNwSUd4bGJtZDBhQ0E5SUhKbGJXRnBibWx1WjF4dVhHNGdJR2xtSUNnb2MzUnlhVzVuTG14bGJtZDBhQ0ErSURBZ0ppWWdLR3hsYm1kMGFDQThJREFnZkh3Z2IyWm1jMlYwSUR3Z01Da3BJSHg4SUc5bVpuTmxkQ0ErSUhSb2FYTXViR1Z1WjNSb0tTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lGSmhibWRsUlhKeWIzSW9KMEYwZEdWdGNIUWdkRzhnZDNKcGRHVWdiM1YwYzJsa1pTQmlkV1ptWlhJZ1ltOTFibVJ6SnlsY2JpQWdmVnh1WEc0Z0lHbG1JQ2doWlc1amIyUnBibWNwSUdWdVkyOWthVzVuSUQwZ0ozVjBaamduWEc1Y2JpQWdkbUZ5SUd4dmQyVnlaV1JEWVhObElEMGdabUZzYzJWY2JpQWdabTl5SUNnN095a2dlMXh1SUNBZ0lITjNhWFJqYUNBb1pXNWpiMlJwYm1jcElIdGNiaUFnSUNBZ0lHTmhjMlVnSjJobGVDYzZYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm9aWGhYY21sMFpTaDBhR2x6TENCemRISnBibWNzSUc5bVpuTmxkQ3dnYkdWdVozUm9LVnh1WEc0Z0lDQWdJQ0JqWVhObElDZDFkR1k0SnpwY2JpQWdJQ0FnSUdOaGMyVWdKM1YwWmkwNEp6cGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIVjBaamhYY21sMFpTaDBhR2x6TENCemRISnBibWNzSUc5bVpuTmxkQ3dnYkdWdVozUm9LVnh1WEc0Z0lDQWdJQ0JqWVhObElDZGhjMk5wYVNjNlhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCaGMyTnBhVmR5YVhSbEtIUm9hWE1zSUhOMGNtbHVaeXdnYjJabWMyVjBMQ0JzWlc1bmRHZ3BYRzVjYmlBZ0lDQWdJR05oYzJVZ0oyeGhkR2x1TVNjNlhHNGdJQ0FnSUNCallYTmxJQ2RpYVc1aGNua25PbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdiR0YwYVc0eFYzSnBkR1VvZEdocGN5d2djM1J5YVc1bkxDQnZabVp6WlhRc0lHeGxibWQwYUNsY2JseHVJQ0FnSUNBZ1kyRnpaU0FuWW1GelpUWTBKenBjYmlBZ0lDQWdJQ0FnTHk4Z1YyRnlibWx1WnpvZ2JXRjRUR1Z1WjNSb0lHNXZkQ0IwWVd0bGJpQnBiblJ2SUdGalkyOTFiblFnYVc0Z1ltRnpaVFkwVjNKcGRHVmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHSmhjMlUyTkZkeWFYUmxLSFJvYVhNc0lITjBjbWx1Wnl3Z2IyWm1jMlYwTENCc1pXNW5kR2dwWEc1Y2JpQWdJQ0FnSUdOaGMyVWdKM1ZqY3pJbk9seHVJQ0FnSUNBZ1kyRnpaU0FuZFdOekxUSW5PbHh1SUNBZ0lDQWdZMkZ6WlNBbmRYUm1NVFpzWlNjNlhHNGdJQ0FnSUNCallYTmxJQ2QxZEdZdE1UWnNaU2M2WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIxWTNNeVYzSnBkR1VvZEdocGN5d2djM1J5YVc1bkxDQnZabVp6WlhRc0lHeGxibWQwYUNsY2JseHVJQ0FnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUNBZ2FXWWdLR3h2ZDJWeVpXUkRZWE5sS1NCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtDZFZibXR1YjNkdUlHVnVZMjlrYVc1bk9pQW5JQ3NnWlc1amIyUnBibWNwWEc0Z0lDQWdJQ0FnSUdWdVkyOWthVzVuSUQwZ0tDY25JQ3NnWlc1amIyUnBibWNwTG5SdlRHOTNaWEpEWVhObEtDbGNiaUFnSUNBZ0lDQWdiRzkzWlhKbFpFTmhjMlVnUFNCMGNuVmxYRzRnSUNBZ2ZWeHVJQ0I5WEc1OVhHNWNia0oxWm1abGNpNXdjbTkwYjNSNWNHVXVkRzlLVTA5T0lEMGdablZ1WTNScGIyNGdkRzlLVTA5T0lDZ3BJSHRjYmlBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0IwZVhCbE9pQW5RblZtWm1WeUp5eGNiaUFnSUNCa1lYUmhPaUJCY25KaGVTNXdjbTkwYjNSNWNHVXVjMnhwWTJVdVkyRnNiQ2gwYUdsekxsOWhjbklnZkh3Z2RHaHBjeXdnTUNsY2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmlZWE5sTmpSVGJHbGpaU0FvWW5WbUxDQnpkR0Z5ZEN3Z1pXNWtLU0I3WEc0Z0lHbG1JQ2h6ZEdGeWRDQTlQVDBnTUNBbUppQmxibVFnUFQwOUlHSjFaaTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1ltRnpaVFkwTG1aeWIyMUNlWFJsUVhKeVlYa29ZblZtS1Z4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhKbGRIVnliaUJpWVhObE5qUXVabkp2YlVKNWRHVkJjbkpoZVNoaWRXWXVjMnhwWTJVb2MzUmhjblFzSUdWdVpDa3BYRzRnSUgxY2JuMWNibHh1Wm5WdVkzUnBiMjRnZFhSbU9GTnNhV05sSUNoaWRXWXNJSE4wWVhKMExDQmxibVFwSUh0Y2JpQWdaVzVrSUQwZ1RXRjBhQzV0YVc0b1luVm1MbXhsYm1kMGFDd2daVzVrS1Z4dUlDQjJZWElnY21WeklEMGdXMTFjYmx4dUlDQjJZWElnYVNBOUlITjBZWEowWEc0Z0lIZG9hV3hsSUNocElEd2daVzVrS1NCN1hHNGdJQ0FnZG1GeUlHWnBjbk4wUW5sMFpTQTlJR0oxWmx0cFhWeHVJQ0FnSUhaaGNpQmpiMlJsVUc5cGJuUWdQU0J1ZFd4c1hHNGdJQ0FnZG1GeUlHSjVkR1Z6VUdWeVUyVnhkV1Z1WTJVZ1BTQW9abWx5YzNSQ2VYUmxJRDRnTUhoRlJpa2dQeUEwWEc0Z0lDQWdJQ0E2SUNobWFYSnpkRUo1ZEdVZ1BpQXdlRVJHS1NBL0lETmNiaUFnSUNBZ0lDQWdPaUFvWm1seWMzUkNlWFJsSUQ0Z01IaENSaWtnUHlBeVhHNGdJQ0FnSUNBZ0lDQWdPaUF4WEc1Y2JpQWdJQ0JwWmlBb2FTQXJJR0o1ZEdWelVHVnlVMlZ4ZFdWdVkyVWdQRDBnWlc1a0tTQjdYRzRnSUNBZ0lDQjJZWElnYzJWamIyNWtRbmwwWlN3Z2RHaHBjbVJDZVhSbExDQm1iM1Z5ZEdoQ2VYUmxMQ0IwWlcxd1EyOWtaVkJ2YVc1MFhHNWNiaUFnSUNBZ0lITjNhWFJqYUNBb1lubDBaWE5RWlhKVFpYRjFaVzVqWlNrZ2UxeHVJQ0FnSUNBZ0lDQmpZWE5sSURFNlhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0dacGNuTjBRbmwwWlNBOElEQjRPREFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR052WkdWUWIybHVkQ0E5SUdacGNuTjBRbmwwWlZ4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0JpY21WaGExeHVJQ0FnSUNBZ0lDQmpZWE5sSURJNlhHNGdJQ0FnSUNBZ0lDQWdjMlZqYjI1a1FubDBaU0E5SUdKMVpsdHBJQ3NnTVYxY2JpQWdJQ0FnSUNBZ0lDQnBaaUFvS0hObFkyOXVaRUo1ZEdVZ0ppQXdlRU13S1NBOVBUMGdNSGc0TUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdWdGNFTnZaR1ZRYjJsdWRDQTlJQ2htYVhKemRFSjVkR1VnSmlBd2VERkdLU0E4UENBd2VEWWdmQ0FvYzJWamIyNWtRbmwwWlNBbUlEQjRNMFlwWEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdWdGNFTnZaR1ZRYjJsdWRDQStJREI0TjBZcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kyOWtaVkJ2YVc1MElEMGdkR1Z0Y0VOdlpHVlFiMmx1ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQmljbVZoYTF4dUlDQWdJQ0FnSUNCallYTmxJRE02WEc0Z0lDQWdJQ0FnSUNBZ2MyVmpiMjVrUW5sMFpTQTlJR0oxWmx0cElDc2dNVjFjYmlBZ0lDQWdJQ0FnSUNCMGFHbHlaRUo1ZEdVZ1BTQmlkV1piYVNBcklESmRYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tDaHpaV052Ym1SQ2VYUmxJQ1lnTUhoRE1Da2dQVDA5SURCNE9EQWdKaVlnS0hSb2FYSmtRbmwwWlNBbUlEQjRRekFwSUQwOVBTQXdlRGd3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwWlcxd1EyOWtaVkJ2YVc1MElEMGdLR1pwY25OMFFubDBaU0FtSURCNFJpa2dQRHdnTUhoRElId2dLSE5sWTI5dVpFSjVkR1VnSmlBd2VETkdLU0E4UENBd2VEWWdmQ0FvZEdocGNtUkNlWFJsSUNZZ01IZ3pSaWxjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gwWlcxd1EyOWtaVkJ2YVc1MElENGdNSGczUmtZZ0ppWWdLSFJsYlhCRGIyUmxVRzlwYm5RZ1BDQXdlRVE0TURBZ2ZId2dkR1Z0Y0VOdlpHVlFiMmx1ZENBK0lEQjRSRVpHUmlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kyOWtaVkJ2YVc1MElEMGdkR1Z0Y0VOdlpHVlFiMmx1ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQmljbVZoYTF4dUlDQWdJQ0FnSUNCallYTmxJRFE2WEc0Z0lDQWdJQ0FnSUNBZ2MyVmpiMjVrUW5sMFpTQTlJR0oxWmx0cElDc2dNVjFjYmlBZ0lDQWdJQ0FnSUNCMGFHbHlaRUo1ZEdVZ1BTQmlkV1piYVNBcklESmRYRzRnSUNBZ0lDQWdJQ0FnWm05MWNuUm9RbmwwWlNBOUlHSjFabHRwSUNzZ00xMWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb0tITmxZMjl1WkVKNWRHVWdKaUF3ZUVNd0tTQTlQVDBnTUhnNE1DQW1KaUFvZEdocGNtUkNlWFJsSUNZZ01IaERNQ2tnUFQwOUlEQjRPREFnSmlZZ0tHWnZkWEowYUVKNWRHVWdKaUF3ZUVNd0tTQTlQVDBnTUhnNE1Da2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHVnRjRU52WkdWUWIybHVkQ0E5SUNobWFYSnpkRUo1ZEdVZ0ppQXdlRVlwSUR3OElEQjRNVElnZkNBb2MyVmpiMjVrUW5sMFpTQW1JREI0TTBZcElEdzhJREI0UXlCOElDaDBhR2x5WkVKNWRHVWdKaUF3ZUROR0tTQThQQ0F3ZURZZ2ZDQW9abTkxY25Sb1FubDBaU0FtSURCNE0wWXBYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9kR1Z0Y0VOdlpHVlFiMmx1ZENBK0lEQjRSa1pHUmlBbUppQjBaVzF3UTI5a1pWQnZhVzUwSUR3Z01IZ3hNVEF3TURBcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kyOWtaVkJ2YVc1MElEMGdkR1Z0Y0VOdlpHVlFiMmx1ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb1kyOWtaVkJ2YVc1MElEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQXZMeUIzWlNCa2FXUWdibTkwSUdkbGJtVnlZWFJsSUdFZ2RtRnNhV1FnWTI5a1pWQnZhVzUwSUhOdklHbHVjMlZ5ZENCaFhHNGdJQ0FnSUNBdkx5QnlaWEJzWVdObGJXVnVkQ0JqYUdGeUlDaFZLMFpHUmtRcElHRnVaQ0JoWkhaaGJtTmxJRzl1YkhrZ01TQmllWFJsWEc0Z0lDQWdJQ0JqYjJSbFVHOXBiblFnUFNBd2VFWkdSa1JjYmlBZ0lDQWdJR0o1ZEdWelVHVnlVMlZ4ZFdWdVkyVWdQU0F4WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2hqYjJSbFVHOXBiblFnUGlBd2VFWkdSa1lwSUh0Y2JpQWdJQ0FnSUM4dklHVnVZMjlrWlNCMGJ5QjFkR1l4TmlBb2MzVnljbTluWVhSbElIQmhhWElnWkdGdVkyVXBYRzRnSUNBZ0lDQmpiMlJsVUc5cGJuUWdMVDBnTUhneE1EQXdNRnh1SUNBZ0lDQWdjbVZ6TG5CMWMyZ29ZMjlrWlZCdmFXNTBJRDQrUGlBeE1DQW1JREI0TTBaR0lId2dNSGhFT0RBd0tWeHVJQ0FnSUNBZ1kyOWtaVkJ2YVc1MElEMGdNSGhFUXpBd0lId2dZMjlrWlZCdmFXNTBJQ1lnTUhnelJrWmNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYTXVjSFZ6YUNoamIyUmxVRzlwYm5RcFhHNGdJQ0FnYVNBclBTQmllWFJsYzFCbGNsTmxjWFZsYm1ObFhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1pHVmpiMlJsUTI5a1pWQnZhVzUwYzBGeWNtRjVLSEpsY3lsY2JuMWNibHh1THk4Z1FtRnpaV1FnYjI0Z2FIUjBjRG92TDNOMFlXTnJiM1psY21ac2IzY3VZMjl0TDJFdk1qSTNORGN5TnpJdk5qZ3dOelF5TENCMGFHVWdZbkp2ZDNObGNpQjNhWFJvWEc0dkx5QjBhR1VnYkc5M1pYTjBJR3hwYldsMElHbHpJRU5vY205dFpTd2dkMmwwYUNBd2VERXdNREF3SUdGeVozTXVYRzR2THlCWFpTQm5ieUF4SUcxaFoyNXBkSFZrWlNCc1pYTnpMQ0JtYjNJZ2MyRm1aWFI1WEc1MllYSWdUVUZZWDBGU1IxVk5SVTVVVTE5TVJVNUhWRWdnUFNBd2VERXdNREJjYmx4dVpuVnVZM1JwYjI0Z1pHVmpiMlJsUTI5a1pWQnZhVzUwYzBGeWNtRjVJQ2hqYjJSbFVHOXBiblJ6S1NCN1hHNGdJSFpoY2lCc1pXNGdQU0JqYjJSbFVHOXBiblJ6TG14bGJtZDBhRnh1SUNCcFppQW9iR1Z1SUR3OUlFMUJXRjlCVWtkVlRVVk9WRk5mVEVWT1IxUklLU0I3WEc0Z0lDQWdjbVYwZFhKdUlGTjBjbWx1Wnk1bWNtOXRRMmhoY2tOdlpHVXVZWEJ3Ykhrb1UzUnlhVzVuTENCamIyUmxVRzlwYm5SektTQXZMeUJoZG05cFpDQmxlSFJ5WVNCemJHbGpaU2dwWEc0Z0lIMWNibHh1SUNBdkx5QkVaV052WkdVZ2FXNGdZMmgxYm10eklIUnZJR0YyYjJsa0lGd2lZMkZzYkNCemRHRmpheUJ6YVhwbElHVjRZMlZsWkdWa1hDSXVYRzRnSUhaaGNpQnlaWE1nUFNBbkoxeHVJQ0IyWVhJZ2FTQTlJREJjYmlBZ2QyaHBiR1VnS0drZ1BDQnNaVzRwSUh0Y2JpQWdJQ0J5WlhNZ0t6MGdVM1J5YVc1bkxtWnliMjFEYUdGeVEyOWtaUzVoY0hCc2VTaGNiaUFnSUNBZ0lGTjBjbWx1Wnl4Y2JpQWdJQ0FnSUdOdlpHVlFiMmx1ZEhNdWMyeHBZMlVvYVN3Z2FTQXJQU0JOUVZoZlFWSkhWVTFGVGxSVFgweEZUa2RVU0NsY2JpQWdJQ0FwWEc0Z0lIMWNiaUFnY21WMGRYSnVJSEpsYzF4dWZWeHVYRzVtZFc1amRHbHZiaUJoYzJOcGFWTnNhV05sSUNoaWRXWXNJSE4wWVhKMExDQmxibVFwSUh0Y2JpQWdkbUZ5SUhKbGRDQTlJQ2NuWEc0Z0lHVnVaQ0E5SUUxaGRHZ3ViV2x1S0dKMVppNXNaVzVuZEdnc0lHVnVaQ2xjYmx4dUlDQm1iM0lnS0haaGNpQnBJRDBnYzNSaGNuUTdJR2tnUENCbGJtUTdJQ3NyYVNrZ2UxeHVJQ0FnSUhKbGRDQXJQU0JUZEhKcGJtY3Vabkp2YlVOb1lYSkRiMlJsS0dKMVpsdHBYU0FtSURCNE4wWXBYRzRnSUgxY2JpQWdjbVYwZFhKdUlISmxkRnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnNZWFJwYmpGVGJHbGpaU0FvWW5WbUxDQnpkR0Z5ZEN3Z1pXNWtLU0I3WEc0Z0lIWmhjaUJ5WlhRZ1BTQW5KMXh1SUNCbGJtUWdQU0JOWVhSb0xtMXBiaWhpZFdZdWJHVnVaM1JvTENCbGJtUXBYRzVjYmlBZ1ptOXlJQ2gyWVhJZ2FTQTlJSE4wWVhKME95QnBJRHdnWlc1a095QXJLMmtwSUh0Y2JpQWdJQ0J5WlhRZ0t6MGdVM1J5YVc1bkxtWnliMjFEYUdGeVEyOWtaU2hpZFdaYmFWMHBYRzRnSUgxY2JpQWdjbVYwZFhKdUlISmxkRnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm9aWGhUYkdsalpTQW9ZblZtTENCemRHRnlkQ3dnWlc1a0tTQjdYRzRnSUhaaGNpQnNaVzRnUFNCaWRXWXViR1Z1WjNSb1hHNWNiaUFnYVdZZ0tDRnpkR0Z5ZENCOGZDQnpkR0Z5ZENBOElEQXBJSE4wWVhKMElEMGdNRnh1SUNCcFppQW9JV1Z1WkNCOGZDQmxibVFnUENBd0lIeDhJR1Z1WkNBK0lHeGxiaWtnWlc1a0lEMGdiR1Z1WEc1Y2JpQWdkbUZ5SUc5MWRDQTlJQ2NuWEc0Z0lHWnZjaUFvZG1GeUlHa2dQU0J6ZEdGeWREc2dhU0E4SUdWdVpEc2dLeXRwS1NCN1hHNGdJQ0FnYjNWMElDczlJSFJ2U0dWNEtHSjFabHRwWFNsY2JpQWdmVnh1SUNCeVpYUjFjbTRnYjNWMFhHNTlYRzVjYm1aMWJtTjBhVzl1SUhWMFpqRTJiR1ZUYkdsalpTQW9ZblZtTENCemRHRnlkQ3dnWlc1a0tTQjdYRzRnSUhaaGNpQmllWFJsY3lBOUlHSjFaaTV6YkdsalpTaHpkR0Z5ZEN3Z1pXNWtLVnh1SUNCMllYSWdjbVZ6SUQwZ0p5ZGNiaUFnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCaWVYUmxjeTVzWlc1bmRHZzdJR2tnS3owZ01pa2dlMXh1SUNBZ0lISmxjeUFyUFNCVGRISnBibWN1Wm5KdmJVTm9ZWEpEYjJSbEtHSjVkR1Z6VzJsZElDc2dLR0o1ZEdWelcya2dLeUF4WFNBcUlESTFOaWtwWEc0Z0lIMWNiaUFnY21WMGRYSnVJSEpsYzF4dWZWeHVYRzVDZFdabVpYSXVjSEp2ZEc5MGVYQmxMbk5zYVdObElEMGdablZ1WTNScGIyNGdjMnhwWTJVZ0tITjBZWEowTENCbGJtUXBJSHRjYmlBZ2RtRnlJR3hsYmlBOUlIUm9hWE11YkdWdVozUm9YRzRnSUhOMFlYSjBJRDBnZm41emRHRnlkRnh1SUNCbGJtUWdQU0JsYm1RZ1BUMDlJSFZ1WkdWbWFXNWxaQ0EvSUd4bGJpQTZJSDUrWlc1a1hHNWNiaUFnYVdZZ0tITjBZWEowSUR3Z01Da2dlMXh1SUNBZ0lITjBZWEowSUNzOUlHeGxibHh1SUNBZ0lHbG1JQ2h6ZEdGeWRDQThJREFwSUhOMFlYSjBJRDBnTUZ4dUlDQjlJR1ZzYzJVZ2FXWWdLSE4wWVhKMElENGdiR1Z1S1NCN1hHNGdJQ0FnYzNSaGNuUWdQU0JzWlc1Y2JpQWdmVnh1WEc0Z0lHbG1JQ2hsYm1RZ1BDQXdLU0I3WEc0Z0lDQWdaVzVrSUNzOUlHeGxibHh1SUNBZ0lHbG1JQ2hsYm1RZ1BDQXdLU0JsYm1RZ1BTQXdYRzRnSUgwZ1pXeHpaU0JwWmlBb1pXNWtJRDRnYkdWdUtTQjdYRzRnSUNBZ1pXNWtJRDBnYkdWdVhHNGdJSDFjYmx4dUlDQnBaaUFvWlc1a0lEd2djM1JoY25RcElHVnVaQ0E5SUhOMFlYSjBYRzVjYmlBZ2RtRnlJRzVsZDBKMVppQTlJSFJvYVhNdWMzVmlZWEp5WVhrb2MzUmhjblFzSUdWdVpDbGNiaUFnTHk4Z1VtVjBkWEp1SUdGdUlHRjFaMjFsYm5SbFpDQmdWV2x1ZERoQmNuSmhlV0FnYVc1emRHRnVZMlZjYmlBZ2JtVjNRblZtTGw5ZmNISnZkRzlmWHlBOUlFSjFabVpsY2k1d2NtOTBiM1I1Y0dWY2JpQWdjbVYwZFhKdUlHNWxkMEoxWmx4dWZWeHVYRzR2S2x4dUlDb2dUbVZsWkNCMGJ5QnRZV3RsSUhOMWNtVWdkR2hoZENCaWRXWm1aWElnYVhOdUozUWdkSEo1YVc1bklIUnZJSGR5YVhSbElHOTFkQ0J2WmlCaWIzVnVaSE11WEc0Z0tpOWNibVoxYm1OMGFXOXVJR05vWldOclQyWm1jMlYwSUNodlptWnpaWFFzSUdWNGRDd2diR1Z1WjNSb0tTQjdYRzRnSUdsbUlDZ29iMlptYzJWMElDVWdNU2tnSVQwOUlEQWdmSHdnYjJabWMyVjBJRHdnTUNrZ2RHaHliM2NnYm1WM0lGSmhibWRsUlhKeWIzSW9KMjltWm5ObGRDQnBjeUJ1YjNRZ2RXbHVkQ2NwWEc0Z0lHbG1JQ2h2Wm1aelpYUWdLeUJsZUhRZ1BpQnNaVzVuZEdncElIUm9jbTkzSUc1bGR5QlNZVzVuWlVWeWNtOXlLQ2RVY25scGJtY2dkRzhnWVdOalpYTnpJR0psZVc5dVpDQmlkV1ptWlhJZ2JHVnVaM1JvSnlsY2JuMWNibHh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzV5WldGa1ZVbHVkRXhGSUQwZ1puVnVZM1JwYjI0Z2NtVmhaRlZKYm5STVJTQW9iMlptYzJWMExDQmllWFJsVEdWdVozUm9MQ0J1YjBGemMyVnlkQ2tnZTF4dUlDQnZabVp6WlhRZ1BTQnZabVp6WlhRZ1BqNCtJREJjYmlBZ1lubDBaVXhsYm1kMGFDQTlJR0o1ZEdWTVpXNW5kR2dnUGo0K0lEQmNiaUFnYVdZZ0tDRnViMEZ6YzJWeWRDa2dZMmhsWTJ0UFptWnpaWFFvYjJabWMyVjBMQ0JpZVhSbFRHVnVaM1JvTENCMGFHbHpMbXhsYm1kMGFDbGNibHh1SUNCMllYSWdkbUZzSUQwZ2RHaHBjMXR2Wm1aelpYUmRYRzRnSUhaaGNpQnRkV3dnUFNBeFhHNGdJSFpoY2lCcElEMGdNRnh1SUNCM2FHbHNaU0FvS3l0cElEd2dZbmwwWlV4bGJtZDBhQ0FtSmlBb2JYVnNJQ285SURCNE1UQXdLU2tnZTF4dUlDQWdJSFpoYkNBclBTQjBhR2x6VzI5bVpuTmxkQ0FySUdsZElDb2diWFZzWEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnZG1Gc1hHNTlYRzVjYmtKMVptWmxjaTV3Y205MGIzUjVjR1V1Y21WaFpGVkpiblJDUlNBOUlHWjFibU4wYVc5dUlISmxZV1JWU1c1MFFrVWdLRzltWm5ObGRDd2dZbmwwWlV4bGJtZDBhQ3dnYm05QmMzTmxjblFwSUh0Y2JpQWdiMlptYzJWMElEMGdiMlptYzJWMElENCtQaUF3WEc0Z0lHSjVkR1ZNWlc1bmRHZ2dQU0JpZVhSbFRHVnVaM1JvSUQ0K1BpQXdYRzRnSUdsbUlDZ2hibTlCYzNObGNuUXBJSHRjYmlBZ0lDQmphR1ZqYTA5bVpuTmxkQ2h2Wm1aelpYUXNJR0o1ZEdWTVpXNW5kR2dzSUhSb2FYTXViR1Z1WjNSb0tWeHVJQ0I5WEc1Y2JpQWdkbUZ5SUhaaGJDQTlJSFJvYVhOYmIyWm1jMlYwSUNzZ0xTMWllWFJsVEdWdVozUm9YVnh1SUNCMllYSWdiWFZzSUQwZ01WeHVJQ0IzYUdsc1pTQW9ZbmwwWlV4bGJtZDBhQ0ErSURBZ0ppWWdLRzExYkNBcVBTQXdlREV3TUNrcElIdGNiaUFnSUNCMllXd2dLejBnZEdocGMxdHZabVp6WlhRZ0t5QXRMV0o1ZEdWTVpXNW5kR2hkSUNvZ2JYVnNYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdkbUZzWEc1OVhHNWNia0oxWm1abGNpNXdjbTkwYjNSNWNHVXVjbVZoWkZWSmJuUTRJRDBnWm5WdVkzUnBiMjRnY21WaFpGVkpiblE0SUNodlptWnpaWFFzSUc1dlFYTnpaWEowS1NCN1hHNGdJRzltWm5ObGRDQTlJRzltWm5ObGRDQStQajRnTUZ4dUlDQnBaaUFvSVc1dlFYTnpaWEowS1NCamFHVmphMDltWm5ObGRDaHZabVp6WlhRc0lERXNJSFJvYVhNdWJHVnVaM1JvS1Z4dUlDQnlaWFIxY200Z2RHaHBjMXR2Wm1aelpYUmRYRzU5WEc1Y2JrSjFabVpsY2k1d2NtOTBiM1I1Y0dVdWNtVmhaRlZKYm5ReE5reEZJRDBnWm5WdVkzUnBiMjRnY21WaFpGVkpiblF4Tmt4RklDaHZabVp6WlhRc0lHNXZRWE56WlhKMEtTQjdYRzRnSUc5bVpuTmxkQ0E5SUc5bVpuTmxkQ0ErUGo0Z01GeHVJQ0JwWmlBb0lXNXZRWE56WlhKMEtTQmphR1ZqYTA5bVpuTmxkQ2h2Wm1aelpYUXNJRElzSUhSb2FYTXViR1Z1WjNSb0tWeHVJQ0J5WlhSMWNtNGdkR2hwYzF0dlptWnpaWFJkSUh3Z0tIUm9hWE5iYjJabWMyVjBJQ3NnTVYwZ1BEd2dPQ2xjYm4xY2JseHVRblZtWm1WeUxuQnliM1J2ZEhsd1pTNXlaV0ZrVlVsdWRERTJRa1VnUFNCbWRXNWpkR2x2YmlCeVpXRmtWVWx1ZERFMlFrVWdLRzltWm5ObGRDd2dibTlCYzNObGNuUXBJSHRjYmlBZ2IyWm1jMlYwSUQwZ2IyWm1jMlYwSUQ0K1BpQXdYRzRnSUdsbUlDZ2hibTlCYzNObGNuUXBJR05vWldOclQyWm1jMlYwS0c5bVpuTmxkQ3dnTWl3Z2RHaHBjeTVzWlc1bmRHZ3BYRzRnSUhKbGRIVnliaUFvZEdocGMxdHZabVp6WlhSZElEdzhJRGdwSUh3Z2RHaHBjMXR2Wm1aelpYUWdLeUF4WFZ4dWZWeHVYRzVDZFdabVpYSXVjSEp2ZEc5MGVYQmxMbkpsWVdSVlNXNTBNekpNUlNBOUlHWjFibU4wYVc5dUlISmxZV1JWU1c1ME16Sk1SU0FvYjJabWMyVjBMQ0J1YjBGemMyVnlkQ2tnZTF4dUlDQnZabVp6WlhRZ1BTQnZabVp6WlhRZ1BqNCtJREJjYmlBZ2FXWWdLQ0Z1YjBGemMyVnlkQ2tnWTJobFkydFBabVp6WlhRb2IyWm1jMlYwTENBMExDQjBhR2x6TG14bGJtZDBhQ2xjYmx4dUlDQnlaWFIxY200Z0tDaDBhR2x6VzI5bVpuTmxkRjBwSUh4Y2JpQWdJQ0FnSUNoMGFHbHpXMjltWm5ObGRDQXJJREZkSUR3OElEZ3BJSHhjYmlBZ0lDQWdJQ2gwYUdselcyOW1abk5sZENBcklESmRJRHc4SURFMktTa2dLMXh1SUNBZ0lDQWdLSFJvYVhOYmIyWm1jMlYwSUNzZ00xMGdLaUF3ZURFd01EQXdNREFwWEc1OVhHNWNia0oxWm1abGNpNXdjbTkwYjNSNWNHVXVjbVZoWkZWSmJuUXpNa0pGSUQwZ1puVnVZM1JwYjI0Z2NtVmhaRlZKYm5Rek1rSkZJQ2h2Wm1aelpYUXNJRzV2UVhOelpYSjBLU0I3WEc0Z0lHOW1abk5sZENBOUlHOW1abk5sZENBK1BqNGdNRnh1SUNCcFppQW9JVzV2UVhOelpYSjBLU0JqYUdWamEwOW1abk5sZENodlptWnpaWFFzSURRc0lIUm9hWE11YkdWdVozUm9LVnh1WEc0Z0lISmxkSFZ5YmlBb2RHaHBjMXR2Wm1aelpYUmRJQ29nTUhneE1EQXdNREF3S1NBclhHNGdJQ0FnS0NoMGFHbHpXMjltWm5ObGRDQXJJREZkSUR3OElERTJLU0I4WEc0Z0lDQWdLSFJvYVhOYmIyWm1jMlYwSUNzZ01sMGdQRHdnT0NrZ2ZGeHVJQ0FnSUhSb2FYTmJiMlptYzJWMElDc2dNMTBwWEc1OVhHNWNia0oxWm1abGNpNXdjbTkwYjNSNWNHVXVjbVZoWkVsdWRFeEZJRDBnWm5WdVkzUnBiMjRnY21WaFpFbHVkRXhGSUNodlptWnpaWFFzSUdKNWRHVk1aVzVuZEdnc0lHNXZRWE56WlhKMEtTQjdYRzRnSUc5bVpuTmxkQ0E5SUc5bVpuTmxkQ0ErUGo0Z01GeHVJQ0JpZVhSbFRHVnVaM1JvSUQwZ1lubDBaVXhsYm1kMGFDQStQajRnTUZ4dUlDQnBaaUFvSVc1dlFYTnpaWEowS1NCamFHVmphMDltWm5ObGRDaHZabVp6WlhRc0lHSjVkR1ZNWlc1bmRHZ3NJSFJvYVhNdWJHVnVaM1JvS1Z4dVhHNGdJSFpoY2lCMllXd2dQU0IwYUdselcyOW1abk5sZEYxY2JpQWdkbUZ5SUcxMWJDQTlJREZjYmlBZ2RtRnlJR2tnUFNBd1hHNGdJSGRvYVd4bElDZ3JLMmtnUENCaWVYUmxUR1Z1WjNSb0lDWW1JQ2h0ZFd3Z0tqMGdNSGd4TURBcEtTQjdYRzRnSUNBZ2RtRnNJQ3M5SUhSb2FYTmJiMlptYzJWMElDc2dhVjBnS2lCdGRXeGNiaUFnZlZ4dUlDQnRkV3dnS2owZ01IZzRNRnh1WEc0Z0lHbG1JQ2gyWVd3Z1BqMGdiWFZzS1NCMllXd2dMVDBnVFdGMGFDNXdiM2NvTWl3Z09DQXFJR0o1ZEdWTVpXNW5kR2dwWEc1Y2JpQWdjbVYwZFhKdUlIWmhiRnh1ZlZ4dVhHNUNkV1ptWlhJdWNISnZkRzkwZVhCbExuSmxZV1JKYm5SQ1JTQTlJR1oxYm1OMGFXOXVJSEpsWVdSSmJuUkNSU0FvYjJabWMyVjBMQ0JpZVhSbFRHVnVaM1JvTENCdWIwRnpjMlZ5ZENrZ2UxeHVJQ0J2Wm1aelpYUWdQU0J2Wm1aelpYUWdQajQrSURCY2JpQWdZbmwwWlV4bGJtZDBhQ0E5SUdKNWRHVk1aVzVuZEdnZ1BqNCtJREJjYmlBZ2FXWWdLQ0Z1YjBGemMyVnlkQ2tnWTJobFkydFBabVp6WlhRb2IyWm1jMlYwTENCaWVYUmxUR1Z1WjNSb0xDQjBhR2x6TG14bGJtZDBhQ2xjYmx4dUlDQjJZWElnYVNBOUlHSjVkR1ZNWlc1bmRHaGNiaUFnZG1GeUlHMTFiQ0E5SURGY2JpQWdkbUZ5SUhaaGJDQTlJSFJvYVhOYmIyWm1jMlYwSUNzZ0xTMXBYVnh1SUNCM2FHbHNaU0FvYVNBK0lEQWdKaVlnS0cxMWJDQXFQU0F3ZURFd01Da3BJSHRjYmlBZ0lDQjJZV3dnS3owZ2RHaHBjMXR2Wm1aelpYUWdLeUF0TFdsZElDb2diWFZzWEc0Z0lIMWNiaUFnYlhWc0lDbzlJREI0T0RCY2JseHVJQ0JwWmlBb2RtRnNJRDQ5SUcxMWJDa2dkbUZzSUMwOUlFMWhkR2d1Y0c5M0tESXNJRGdnS2lCaWVYUmxUR1Z1WjNSb0tWeHVYRzRnSUhKbGRIVnliaUIyWVd4Y2JuMWNibHh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzV5WldGa1NXNTBPQ0E5SUdaMWJtTjBhVzl1SUhKbFlXUkpiblE0SUNodlptWnpaWFFzSUc1dlFYTnpaWEowS1NCN1hHNGdJRzltWm5ObGRDQTlJRzltWm5ObGRDQStQajRnTUZ4dUlDQnBaaUFvSVc1dlFYTnpaWEowS1NCamFHVmphMDltWm5ObGRDaHZabVp6WlhRc0lERXNJSFJvYVhNdWJHVnVaM1JvS1Z4dUlDQnBaaUFvSVNoMGFHbHpXMjltWm5ObGRGMGdKaUF3ZURnd0tTa2djbVYwZFhKdUlDaDBhR2x6VzI5bVpuTmxkRjBwWEc0Z0lISmxkSFZ5YmlBb0tEQjRabVlnTFNCMGFHbHpXMjltWm5ObGRGMGdLeUF4S1NBcUlDMHhLVnh1ZlZ4dVhHNUNkV1ptWlhJdWNISnZkRzkwZVhCbExuSmxZV1JKYm5ReE5reEZJRDBnWm5WdVkzUnBiMjRnY21WaFpFbHVkREUyVEVVZ0tHOW1abk5sZEN3Z2JtOUJjM05sY25RcElIdGNiaUFnYjJabWMyVjBJRDBnYjJabWMyVjBJRDQrUGlBd1hHNGdJR2xtSUNnaGJtOUJjM05sY25RcElHTm9aV05yVDJabWMyVjBLRzltWm5ObGRDd2dNaXdnZEdocGN5NXNaVzVuZEdncFhHNGdJSFpoY2lCMllXd2dQU0IwYUdselcyOW1abk5sZEYwZ2ZDQW9kR2hwYzF0dlptWnpaWFFnS3lBeFhTQThQQ0E0S1Z4dUlDQnlaWFIxY200Z0tIWmhiQ0FtSURCNE9EQXdNQ2tnUHlCMllXd2dmQ0F3ZUVaR1JrWXdNREF3SURvZ2RtRnNYRzU5WEc1Y2JrSjFabVpsY2k1d2NtOTBiM1I1Y0dVdWNtVmhaRWx1ZERFMlFrVWdQU0JtZFc1amRHbHZiaUJ5WldGa1NXNTBNVFpDUlNBb2IyWm1jMlYwTENCdWIwRnpjMlZ5ZENrZ2UxeHVJQ0J2Wm1aelpYUWdQU0J2Wm1aelpYUWdQajQrSURCY2JpQWdhV1lnS0NGdWIwRnpjMlZ5ZENrZ1kyaGxZMnRQWm1aelpYUW9iMlptYzJWMExDQXlMQ0IwYUdsekxteGxibWQwYUNsY2JpQWdkbUZ5SUhaaGJDQTlJSFJvYVhOYmIyWm1jMlYwSUNzZ01WMGdmQ0FvZEdocGMxdHZabVp6WlhSZElEdzhJRGdwWEc0Z0lISmxkSFZ5YmlBb2RtRnNJQ1lnTUhnNE1EQXdLU0EvSUhaaGJDQjhJREI0UmtaR1JqQXdNREFnT2lCMllXeGNibjFjYmx4dVFuVm1abVZ5TG5CeWIzUnZkSGx3WlM1eVpXRmtTVzUwTXpKTVJTQTlJR1oxYm1OMGFXOXVJSEpsWVdSSmJuUXpNa3hGSUNodlptWnpaWFFzSUc1dlFYTnpaWEowS1NCN1hHNGdJRzltWm5ObGRDQTlJRzltWm5ObGRDQStQajRnTUZ4dUlDQnBaaUFvSVc1dlFYTnpaWEowS1NCamFHVmphMDltWm5ObGRDaHZabVp6WlhRc0lEUXNJSFJvYVhNdWJHVnVaM1JvS1Z4dVhHNGdJSEpsZEhWeWJpQW9kR2hwYzF0dlptWnpaWFJkS1NCOFhHNGdJQ0FnS0hSb2FYTmJiMlptYzJWMElDc2dNVjBnUER3Z09Da2dmRnh1SUNBZ0lDaDBhR2x6VzI5bVpuTmxkQ0FySURKZElEdzhJREUyS1NCOFhHNGdJQ0FnS0hSb2FYTmJiMlptYzJWMElDc2dNMTBnUER3Z01qUXBYRzU5WEc1Y2JrSjFabVpsY2k1d2NtOTBiM1I1Y0dVdWNtVmhaRWx1ZERNeVFrVWdQU0JtZFc1amRHbHZiaUJ5WldGa1NXNTBNekpDUlNBb2IyWm1jMlYwTENCdWIwRnpjMlZ5ZENrZ2UxeHVJQ0J2Wm1aelpYUWdQU0J2Wm1aelpYUWdQajQrSURCY2JpQWdhV1lnS0NGdWIwRnpjMlZ5ZENrZ1kyaGxZMnRQWm1aelpYUW9iMlptYzJWMExDQTBMQ0IwYUdsekxteGxibWQwYUNsY2JseHVJQ0J5WlhSMWNtNGdLSFJvYVhOYmIyWm1jMlYwWFNBOFBDQXlOQ2tnZkZ4dUlDQWdJQ2gwYUdselcyOW1abk5sZENBcklERmRJRHc4SURFMktTQjhYRzRnSUNBZ0tIUm9hWE5iYjJabWMyVjBJQ3NnTWwwZ1BEd2dPQ2tnZkZ4dUlDQWdJQ2gwYUdselcyOW1abk5sZENBcklETmRLVnh1ZlZ4dVhHNUNkV1ptWlhJdWNISnZkRzkwZVhCbExuSmxZV1JHYkc5aGRFeEZJRDBnWm5WdVkzUnBiMjRnY21WaFpFWnNiMkYwVEVVZ0tHOW1abk5sZEN3Z2JtOUJjM05sY25RcElIdGNiaUFnYjJabWMyVjBJRDBnYjJabWMyVjBJRDQrUGlBd1hHNGdJR2xtSUNnaGJtOUJjM05sY25RcElHTm9aV05yVDJabWMyVjBLRzltWm5ObGRDd2dOQ3dnZEdocGN5NXNaVzVuZEdncFhHNGdJSEpsZEhWeWJpQnBaV1ZsTnpVMExuSmxZV1FvZEdocGN5d2diMlptYzJWMExDQjBjblZsTENBeU15d2dOQ2xjYm4xY2JseHVRblZtWm1WeUxuQnliM1J2ZEhsd1pTNXlaV0ZrUm14dllYUkNSU0E5SUdaMWJtTjBhVzl1SUhKbFlXUkdiRzloZEVKRklDaHZabVp6WlhRc0lHNXZRWE56WlhKMEtTQjdYRzRnSUc5bVpuTmxkQ0E5SUc5bVpuTmxkQ0ErUGo0Z01GeHVJQ0JwWmlBb0lXNXZRWE56WlhKMEtTQmphR1ZqYTA5bVpuTmxkQ2h2Wm1aelpYUXNJRFFzSUhSb2FYTXViR1Z1WjNSb0tWeHVJQ0J5WlhSMWNtNGdhV1ZsWlRjMU5DNXlaV0ZrS0hSb2FYTXNJRzltWm5ObGRDd2dabUZzYzJVc0lESXpMQ0EwS1Z4dWZWeHVYRzVDZFdabVpYSXVjSEp2ZEc5MGVYQmxMbkpsWVdSRWIzVmliR1ZNUlNBOUlHWjFibU4wYVc5dUlISmxZV1JFYjNWaWJHVk1SU0FvYjJabWMyVjBMQ0J1YjBGemMyVnlkQ2tnZTF4dUlDQnZabVp6WlhRZ1BTQnZabVp6WlhRZ1BqNCtJREJjYmlBZ2FXWWdLQ0Z1YjBGemMyVnlkQ2tnWTJobFkydFBabVp6WlhRb2IyWm1jMlYwTENBNExDQjBhR2x6TG14bGJtZDBhQ2xjYmlBZ2NtVjBkWEp1SUdsbFpXVTNOVFF1Y21WaFpDaDBhR2x6TENCdlptWnpaWFFzSUhSeWRXVXNJRFV5TENBNEtWeHVmVnh1WEc1Q2RXWm1aWEl1Y0hKdmRHOTBlWEJsTG5KbFlXUkViM1ZpYkdWQ1JTQTlJR1oxYm1OMGFXOXVJSEpsWVdSRWIzVmliR1ZDUlNBb2IyWm1jMlYwTENCdWIwRnpjMlZ5ZENrZ2UxeHVJQ0J2Wm1aelpYUWdQU0J2Wm1aelpYUWdQajQrSURCY2JpQWdhV1lnS0NGdWIwRnpjMlZ5ZENrZ1kyaGxZMnRQWm1aelpYUW9iMlptYzJWMExDQTRMQ0IwYUdsekxteGxibWQwYUNsY2JpQWdjbVYwZFhKdUlHbGxaV1UzTlRRdWNtVmhaQ2gwYUdsekxDQnZabVp6WlhRc0lHWmhiSE5sTENBMU1pd2dPQ2xjYm4xY2JseHVablZ1WTNScGIyNGdZMmhsWTJ0SmJuUWdLR0oxWml3Z2RtRnNkV1VzSUc5bVpuTmxkQ3dnWlhoMExDQnRZWGdzSUcxcGJpa2dlMXh1SUNCcFppQW9JVUoxWm1abGNpNXBjMEoxWm1abGNpaGlkV1lwS1NCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtDZGNJbUoxWm1abGNsd2lJR0Z5WjNWdFpXNTBJRzExYzNRZ1ltVWdZU0JDZFdabVpYSWdhVzV6ZEdGdVkyVW5LVnh1SUNCcFppQW9kbUZzZFdVZ1BpQnRZWGdnZkh3Z2RtRnNkV1VnUENCdGFXNHBJSFJvY205M0lHNWxkeUJTWVc1blpVVnljbTl5S0NkY0luWmhiSFZsWENJZ1lYSm5kVzFsYm5RZ2FYTWdiM1YwSUc5bUlHSnZkVzVrY3ljcFhHNGdJR2xtSUNodlptWnpaWFFnS3lCbGVIUWdQaUJpZFdZdWJHVnVaM1JvS1NCMGFISnZkeUJ1WlhjZ1VtRnVaMlZGY25KdmNpZ25TVzVrWlhnZ2IzVjBJRzltSUhKaGJtZGxKeWxjYm4xY2JseHVRblZtWm1WeUxuQnliM1J2ZEhsd1pTNTNjbWwwWlZWSmJuUk1SU0E5SUdaMWJtTjBhVzl1SUhkeWFYUmxWVWx1ZEV4RklDaDJZV3gxWlN3Z2IyWm1jMlYwTENCaWVYUmxUR1Z1WjNSb0xDQnViMEZ6YzJWeWRDa2dlMXh1SUNCMllXeDFaU0E5SUN0MllXeDFaVnh1SUNCdlptWnpaWFFnUFNCdlptWnpaWFFnUGo0K0lEQmNiaUFnWW5sMFpVeGxibWQwYUNBOUlHSjVkR1ZNWlc1bmRHZ2dQajQrSURCY2JpQWdhV1lnS0NGdWIwRnpjMlZ5ZENrZ2UxeHVJQ0FnSUhaaGNpQnRZWGhDZVhSbGN5QTlJRTFoZEdndWNHOTNLRElzSURnZ0tpQmllWFJsVEdWdVozUm9LU0F0SURGY2JpQWdJQ0JqYUdWamEwbHVkQ2gwYUdsekxDQjJZV3gxWlN3Z2IyWm1jMlYwTENCaWVYUmxUR1Z1WjNSb0xDQnRZWGhDZVhSbGN5d2dNQ2xjYmlBZ2ZWeHVYRzRnSUhaaGNpQnRkV3dnUFNBeFhHNGdJSFpoY2lCcElEMGdNRnh1SUNCMGFHbHpXMjltWm5ObGRGMGdQU0IyWVd4MVpTQW1JREI0UmtaY2JpQWdkMmhwYkdVZ0tDc3JhU0E4SUdKNWRHVk1aVzVuZEdnZ0ppWWdLRzExYkNBcVBTQXdlREV3TUNrcElIdGNiaUFnSUNCMGFHbHpXMjltWm5ObGRDQXJJR2xkSUQwZ0tIWmhiSFZsSUM4Z2JYVnNLU0FtSURCNFJrWmNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnZabVp6WlhRZ0t5QmllWFJsVEdWdVozUm9YRzU5WEc1Y2JrSjFabVpsY2k1d2NtOTBiM1I1Y0dVdWQzSnBkR1ZWU1c1MFFrVWdQU0JtZFc1amRHbHZiaUIzY21sMFpWVkpiblJDUlNBb2RtRnNkV1VzSUc5bVpuTmxkQ3dnWW5sMFpVeGxibWQwYUN3Z2JtOUJjM05sY25RcElIdGNiaUFnZG1Gc2RXVWdQU0FyZG1Gc2RXVmNiaUFnYjJabWMyVjBJRDBnYjJabWMyVjBJRDQrUGlBd1hHNGdJR0o1ZEdWTVpXNW5kR2dnUFNCaWVYUmxUR1Z1WjNSb0lENCtQaUF3WEc0Z0lHbG1JQ2doYm05QmMzTmxjblFwSUh0Y2JpQWdJQ0IyWVhJZ2JXRjRRbmwwWlhNZ1BTQk5ZWFJvTG5CdmR5Z3lMQ0E0SUNvZ1lubDBaVXhsYm1kMGFDa2dMU0F4WEc0Z0lDQWdZMmhsWTJ0SmJuUW9kR2hwY3l3Z2RtRnNkV1VzSUc5bVpuTmxkQ3dnWW5sMFpVeGxibWQwYUN3Z2JXRjRRbmwwWlhNc0lEQXBYRzRnSUgxY2JseHVJQ0IyWVhJZ2FTQTlJR0o1ZEdWTVpXNW5kR2dnTFNBeFhHNGdJSFpoY2lCdGRXd2dQU0F4WEc0Z0lIUm9hWE5iYjJabWMyVjBJQ3NnYVYwZ1BTQjJZV3gxWlNBbUlEQjRSa1pjYmlBZ2QyaHBiR1VnS0MwdGFTQStQU0F3SUNZbUlDaHRkV3dnS2owZ01IZ3hNREFwS1NCN1hHNGdJQ0FnZEdocGMxdHZabVp6WlhRZ0t5QnBYU0E5SUNoMllXeDFaU0F2SUcxMWJDa2dKaUF3ZUVaR1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2IyWm1jMlYwSUNzZ1lubDBaVXhsYm1kMGFGeHVmVnh1WEc1Q2RXWm1aWEl1Y0hKdmRHOTBlWEJsTG5keWFYUmxWVWx1ZERnZ1BTQm1kVzVqZEdsdmJpQjNjbWwwWlZWSmJuUTRJQ2gyWVd4MVpTd2diMlptYzJWMExDQnViMEZ6YzJWeWRDa2dlMXh1SUNCMllXeDFaU0E5SUN0MllXeDFaVnh1SUNCdlptWnpaWFFnUFNCdlptWnpaWFFnUGo0K0lEQmNiaUFnYVdZZ0tDRnViMEZ6YzJWeWRDa2dZMmhsWTJ0SmJuUW9kR2hwY3l3Z2RtRnNkV1VzSUc5bVpuTmxkQ3dnTVN3Z01IaG1aaXdnTUNsY2JpQWdkR2hwYzF0dlptWnpaWFJkSUQwZ0tIWmhiSFZsSUNZZ01IaG1aaWxjYmlBZ2NtVjBkWEp1SUc5bVpuTmxkQ0FySURGY2JuMWNibHh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzUzY21sMFpWVkpiblF4Tmt4RklEMGdablZ1WTNScGIyNGdkM0pwZEdWVlNXNTBNVFpNUlNBb2RtRnNkV1VzSUc5bVpuTmxkQ3dnYm05QmMzTmxjblFwSUh0Y2JpQWdkbUZzZFdVZ1BTQXJkbUZzZFdWY2JpQWdiMlptYzJWMElEMGdiMlptYzJWMElENCtQaUF3WEc0Z0lHbG1JQ2doYm05QmMzTmxjblFwSUdOb1pXTnJTVzUwS0hSb2FYTXNJSFpoYkhWbExDQnZabVp6WlhRc0lESXNJREI0Wm1abVppd2dNQ2xjYmlBZ2RHaHBjMXR2Wm1aelpYUmRJRDBnS0haaGJIVmxJQ1lnTUhobVppbGNiaUFnZEdocGMxdHZabVp6WlhRZ0t5QXhYU0E5SUNoMllXeDFaU0ErUGo0Z09DbGNiaUFnY21WMGRYSnVJRzltWm5ObGRDQXJJREpjYm4xY2JseHVRblZtWm1WeUxuQnliM1J2ZEhsd1pTNTNjbWwwWlZWSmJuUXhOa0pGSUQwZ1puVnVZM1JwYjI0Z2QzSnBkR1ZWU1c1ME1UWkNSU0FvZG1Gc2RXVXNJRzltWm5ObGRDd2dibTlCYzNObGNuUXBJSHRjYmlBZ2RtRnNkV1VnUFNBcmRtRnNkV1ZjYmlBZ2IyWm1jMlYwSUQwZ2IyWm1jMlYwSUQ0K1BpQXdYRzRnSUdsbUlDZ2hibTlCYzNObGNuUXBJR05vWldOclNXNTBLSFJvYVhNc0lIWmhiSFZsTENCdlptWnpaWFFzSURJc0lEQjRabVptWml3Z01DbGNiaUFnZEdocGMxdHZabVp6WlhSZElEMGdLSFpoYkhWbElENCtQaUE0S1Z4dUlDQjBhR2x6VzI5bVpuTmxkQ0FySURGZElEMGdLSFpoYkhWbElDWWdNSGhtWmlsY2JpQWdjbVYwZFhKdUlHOW1abk5sZENBcklESmNibjFjYmx4dVFuVm1abVZ5TG5CeWIzUnZkSGx3WlM1M2NtbDBaVlZKYm5Rek1reEZJRDBnWm5WdVkzUnBiMjRnZDNKcGRHVlZTVzUwTXpKTVJTQW9kbUZzZFdVc0lHOW1abk5sZEN3Z2JtOUJjM05sY25RcElIdGNiaUFnZG1Gc2RXVWdQU0FyZG1Gc2RXVmNiaUFnYjJabWMyVjBJRDBnYjJabWMyVjBJRDQrUGlBd1hHNGdJR2xtSUNnaGJtOUJjM05sY25RcElHTm9aV05yU1c1MEtIUm9hWE1zSUhaaGJIVmxMQ0J2Wm1aelpYUXNJRFFzSURCNFptWm1abVptWm1Zc0lEQXBYRzRnSUhSb2FYTmJiMlptYzJWMElDc2dNMTBnUFNBb2RtRnNkV1VnUGo0K0lESTBLVnh1SUNCMGFHbHpXMjltWm5ObGRDQXJJREpkSUQwZ0tIWmhiSFZsSUQ0K1BpQXhOaWxjYmlBZ2RHaHBjMXR2Wm1aelpYUWdLeUF4WFNBOUlDaDJZV3gxWlNBK1BqNGdPQ2xjYmlBZ2RHaHBjMXR2Wm1aelpYUmRJRDBnS0haaGJIVmxJQ1lnTUhobVppbGNiaUFnY21WMGRYSnVJRzltWm5ObGRDQXJJRFJjYm4xY2JseHVRblZtWm1WeUxuQnliM1J2ZEhsd1pTNTNjbWwwWlZWSmJuUXpNa0pGSUQwZ1puVnVZM1JwYjI0Z2QzSnBkR1ZWU1c1ME16SkNSU0FvZG1Gc2RXVXNJRzltWm5ObGRDd2dibTlCYzNObGNuUXBJSHRjYmlBZ2RtRnNkV1VnUFNBcmRtRnNkV1ZjYmlBZ2IyWm1jMlYwSUQwZ2IyWm1jMlYwSUQ0K1BpQXdYRzRnSUdsbUlDZ2hibTlCYzNObGNuUXBJR05vWldOclNXNTBLSFJvYVhNc0lIWmhiSFZsTENCdlptWnpaWFFzSURRc0lEQjRabVptWm1abVptWXNJREFwWEc0Z0lIUm9hWE5iYjJabWMyVjBYU0E5SUNoMllXeDFaU0ErUGo0Z01qUXBYRzRnSUhSb2FYTmJiMlptYzJWMElDc2dNVjBnUFNBb2RtRnNkV1VnUGo0K0lERTJLVnh1SUNCMGFHbHpXMjltWm5ObGRDQXJJREpkSUQwZ0tIWmhiSFZsSUQ0K1BpQTRLVnh1SUNCMGFHbHpXMjltWm5ObGRDQXJJRE5kSUQwZ0tIWmhiSFZsSUNZZ01IaG1aaWxjYmlBZ2NtVjBkWEp1SUc5bVpuTmxkQ0FySURSY2JuMWNibHh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzUzY21sMFpVbHVkRXhGSUQwZ1puVnVZM1JwYjI0Z2QzSnBkR1ZKYm5STVJTQW9kbUZzZFdVc0lHOW1abk5sZEN3Z1lubDBaVXhsYm1kMGFDd2dibTlCYzNObGNuUXBJSHRjYmlBZ2RtRnNkV1VnUFNBcmRtRnNkV1ZjYmlBZ2IyWm1jMlYwSUQwZ2IyWm1jMlYwSUQ0K1BpQXdYRzRnSUdsbUlDZ2hibTlCYzNObGNuUXBJSHRjYmlBZ0lDQjJZWElnYkdsdGFYUWdQU0JOWVhSb0xuQnZkeWd5TENBb09DQXFJR0o1ZEdWTVpXNW5kR2dwSUMwZ01TbGNibHh1SUNBZ0lHTm9aV05yU1c1MEtIUm9hWE1zSUhaaGJIVmxMQ0J2Wm1aelpYUXNJR0o1ZEdWTVpXNW5kR2dzSUd4cGJXbDBJQzBnTVN3Z0xXeHBiV2wwS1Z4dUlDQjlYRzVjYmlBZ2RtRnlJR2tnUFNBd1hHNGdJSFpoY2lCdGRXd2dQU0F4WEc0Z0lIWmhjaUJ6ZFdJZ1BTQXdYRzRnSUhSb2FYTmJiMlptYzJWMFhTQTlJSFpoYkhWbElDWWdNSGhHUmx4dUlDQjNhR2xzWlNBb0t5dHBJRHdnWW5sMFpVeGxibWQwYUNBbUppQW9iWFZzSUNvOUlEQjRNVEF3S1NrZ2UxeHVJQ0FnSUdsbUlDaDJZV3gxWlNBOElEQWdKaVlnYzNWaUlEMDlQU0F3SUNZbUlIUm9hWE5iYjJabWMyVjBJQ3NnYVNBdElERmRJQ0U5UFNBd0tTQjdYRzRnSUNBZ0lDQnpkV0lnUFNBeFhHNGdJQ0FnZlZ4dUlDQWdJSFJvYVhOYmIyWm1jMlYwSUNzZ2FWMGdQU0FvS0haaGJIVmxJQzhnYlhWc0tTQStQaUF3S1NBdElITjFZaUFtSURCNFJrWmNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnZabVp6WlhRZ0t5QmllWFJsVEdWdVozUm9YRzU5WEc1Y2JrSjFabVpsY2k1d2NtOTBiM1I1Y0dVdWQzSnBkR1ZKYm5SQ1JTQTlJR1oxYm1OMGFXOXVJSGR5YVhSbFNXNTBRa1VnS0haaGJIVmxMQ0J2Wm1aelpYUXNJR0o1ZEdWTVpXNW5kR2dzSUc1dlFYTnpaWEowS1NCN1hHNGdJSFpoYkhWbElEMGdLM1poYkhWbFhHNGdJRzltWm5ObGRDQTlJRzltWm5ObGRDQStQajRnTUZ4dUlDQnBaaUFvSVc1dlFYTnpaWEowS1NCN1hHNGdJQ0FnZG1GeUlHeHBiV2wwSUQwZ1RXRjBhQzV3YjNjb01pd2dLRGdnS2lCaWVYUmxUR1Z1WjNSb0tTQXRJREVwWEc1Y2JpQWdJQ0JqYUdWamEwbHVkQ2gwYUdsekxDQjJZV3gxWlN3Z2IyWm1jMlYwTENCaWVYUmxUR1Z1WjNSb0xDQnNhVzFwZENBdElERXNJQzFzYVcxcGRDbGNiaUFnZlZ4dVhHNGdJSFpoY2lCcElEMGdZbmwwWlV4bGJtZDBhQ0F0SURGY2JpQWdkbUZ5SUcxMWJDQTlJREZjYmlBZ2RtRnlJSE4xWWlBOUlEQmNiaUFnZEdocGMxdHZabVp6WlhRZ0t5QnBYU0E5SUhaaGJIVmxJQ1lnTUhoR1JseHVJQ0IzYUdsc1pTQW9MUzFwSUQ0OUlEQWdKaVlnS0cxMWJDQXFQU0F3ZURFd01Da3BJSHRjYmlBZ0lDQnBaaUFvZG1Gc2RXVWdQQ0F3SUNZbUlITjFZaUE5UFQwZ01DQW1KaUIwYUdselcyOW1abk5sZENBcklHa2dLeUF4WFNBaFBUMGdNQ2tnZTF4dUlDQWdJQ0FnYzNWaUlEMGdNVnh1SUNBZ0lIMWNiaUFnSUNCMGFHbHpXMjltWm5ObGRDQXJJR2xkSUQwZ0tDaDJZV3gxWlNBdklHMTFiQ2tnUGo0Z01Da2dMU0J6ZFdJZ0ppQXdlRVpHWEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYjJabWMyVjBJQ3NnWW5sMFpVeGxibWQwYUZ4dWZWeHVYRzVDZFdabVpYSXVjSEp2ZEc5MGVYQmxMbmR5YVhSbFNXNTBPQ0E5SUdaMWJtTjBhVzl1SUhkeWFYUmxTVzUwT0NBb2RtRnNkV1VzSUc5bVpuTmxkQ3dnYm05QmMzTmxjblFwSUh0Y2JpQWdkbUZzZFdVZ1BTQXJkbUZzZFdWY2JpQWdiMlptYzJWMElEMGdiMlptYzJWMElENCtQaUF3WEc0Z0lHbG1JQ2doYm05QmMzTmxjblFwSUdOb1pXTnJTVzUwS0hSb2FYTXNJSFpoYkhWbExDQnZabVp6WlhRc0lERXNJREI0TjJZc0lDMHdlRGd3S1Z4dUlDQnBaaUFvZG1Gc2RXVWdQQ0F3S1NCMllXeDFaU0E5SURCNFptWWdLeUIyWVd4MVpTQXJJREZjYmlBZ2RHaHBjMXR2Wm1aelpYUmRJRDBnS0haaGJIVmxJQ1lnTUhobVppbGNiaUFnY21WMGRYSnVJRzltWm5ObGRDQXJJREZjYm4xY2JseHVRblZtWm1WeUxuQnliM1J2ZEhsd1pTNTNjbWwwWlVsdWRERTJURVVnUFNCbWRXNWpkR2x2YmlCM2NtbDBaVWx1ZERFMlRFVWdLSFpoYkhWbExDQnZabVp6WlhRc0lHNXZRWE56WlhKMEtTQjdYRzRnSUhaaGJIVmxJRDBnSzNaaGJIVmxYRzRnSUc5bVpuTmxkQ0E5SUc5bVpuTmxkQ0ErUGo0Z01GeHVJQ0JwWmlBb0lXNXZRWE56WlhKMEtTQmphR1ZqYTBsdWRDaDBhR2x6TENCMllXeDFaU3dnYjJabWMyVjBMQ0F5TENBd2VEZG1abVlzSUMwd2VEZ3dNREFwWEc0Z0lIUm9hWE5iYjJabWMyVjBYU0E5SUNoMllXeDFaU0FtSURCNFptWXBYRzRnSUhSb2FYTmJiMlptYzJWMElDc2dNVjBnUFNBb2RtRnNkV1VnUGo0K0lEZ3BYRzRnSUhKbGRIVnliaUJ2Wm1aelpYUWdLeUF5WEc1OVhHNWNia0oxWm1abGNpNXdjbTkwYjNSNWNHVXVkM0pwZEdWSmJuUXhOa0pGSUQwZ1puVnVZM1JwYjI0Z2QzSnBkR1ZKYm5ReE5rSkZJQ2gyWVd4MVpTd2diMlptYzJWMExDQnViMEZ6YzJWeWRDa2dlMXh1SUNCMllXeDFaU0E5SUN0MllXeDFaVnh1SUNCdlptWnpaWFFnUFNCdlptWnpaWFFnUGo0K0lEQmNiaUFnYVdZZ0tDRnViMEZ6YzJWeWRDa2dZMmhsWTJ0SmJuUW9kR2hwY3l3Z2RtRnNkV1VzSUc5bVpuTmxkQ3dnTWl3Z01IZzNabVptTENBdE1IZzRNREF3S1Z4dUlDQjBhR2x6VzI5bVpuTmxkRjBnUFNBb2RtRnNkV1VnUGo0K0lEZ3BYRzRnSUhSb2FYTmJiMlptYzJWMElDc2dNVjBnUFNBb2RtRnNkV1VnSmlBd2VHWm1LVnh1SUNCeVpYUjFjbTRnYjJabWMyVjBJQ3NnTWx4dWZWeHVYRzVDZFdabVpYSXVjSEp2ZEc5MGVYQmxMbmR5YVhSbFNXNTBNekpNUlNBOUlHWjFibU4wYVc5dUlIZHlhWFJsU1c1ME16Sk1SU0FvZG1Gc2RXVXNJRzltWm5ObGRDd2dibTlCYzNObGNuUXBJSHRjYmlBZ2RtRnNkV1VnUFNBcmRtRnNkV1ZjYmlBZ2IyWm1jMlYwSUQwZ2IyWm1jMlYwSUQ0K1BpQXdYRzRnSUdsbUlDZ2hibTlCYzNObGNuUXBJR05vWldOclNXNTBLSFJvYVhNc0lIWmhiSFZsTENCdlptWnpaWFFzSURRc0lEQjROMlptWm1abVptWXNJQzB3ZURnd01EQXdNREF3S1Z4dUlDQjBhR2x6VzI5bVpuTmxkRjBnUFNBb2RtRnNkV1VnSmlBd2VHWm1LVnh1SUNCMGFHbHpXMjltWm5ObGRDQXJJREZkSUQwZ0tIWmhiSFZsSUQ0K1BpQTRLVnh1SUNCMGFHbHpXMjltWm5ObGRDQXJJREpkSUQwZ0tIWmhiSFZsSUQ0K1BpQXhOaWxjYmlBZ2RHaHBjMXR2Wm1aelpYUWdLeUF6WFNBOUlDaDJZV3gxWlNBK1BqNGdNalFwWEc0Z0lISmxkSFZ5YmlCdlptWnpaWFFnS3lBMFhHNTlYRzVjYmtKMVptWmxjaTV3Y205MGIzUjVjR1V1ZDNKcGRHVkpiblF6TWtKRklEMGdablZ1WTNScGIyNGdkM0pwZEdWSmJuUXpNa0pGSUNoMllXeDFaU3dnYjJabWMyVjBMQ0J1YjBGemMyVnlkQ2tnZTF4dUlDQjJZV3gxWlNBOUlDdDJZV3gxWlZ4dUlDQnZabVp6WlhRZ1BTQnZabVp6WlhRZ1BqNCtJREJjYmlBZ2FXWWdLQ0Z1YjBGemMyVnlkQ2tnWTJobFkydEpiblFvZEdocGN5d2dkbUZzZFdVc0lHOW1abk5sZEN3Z05Dd2dNSGczWm1abVptWm1aaXdnTFRCNE9EQXdNREF3TURBcFhHNGdJR2xtSUNoMllXeDFaU0E4SURBcElIWmhiSFZsSUQwZ01IaG1abVptWm1abVppQXJJSFpoYkhWbElDc2dNVnh1SUNCMGFHbHpXMjltWm5ObGRGMGdQU0FvZG1Gc2RXVWdQajQrSURJMEtWeHVJQ0IwYUdselcyOW1abk5sZENBcklERmRJRDBnS0haaGJIVmxJRDQrUGlBeE5pbGNiaUFnZEdocGMxdHZabVp6WlhRZ0t5QXlYU0E5SUNoMllXeDFaU0ErUGo0Z09DbGNiaUFnZEdocGMxdHZabVp6WlhRZ0t5QXpYU0E5SUNoMllXeDFaU0FtSURCNFptWXBYRzRnSUhKbGRIVnliaUJ2Wm1aelpYUWdLeUEwWEc1OVhHNWNibVoxYm1OMGFXOXVJR05vWldOclNVVkZSVGMxTkNBb1luVm1MQ0IyWVd4MVpTd2diMlptYzJWMExDQmxlSFFzSUcxaGVDd2diV2x1S1NCN1hHNGdJR2xtSUNodlptWnpaWFFnS3lCbGVIUWdQaUJpZFdZdWJHVnVaM1JvS1NCMGFISnZkeUJ1WlhjZ1VtRnVaMlZGY25KdmNpZ25TVzVrWlhnZ2IzVjBJRzltSUhKaGJtZGxKeWxjYmlBZ2FXWWdLRzltWm5ObGRDQThJREFwSUhSb2NtOTNJRzVsZHlCU1lXNW5aVVZ5Y205eUtDZEpibVJsZUNCdmRYUWdiMllnY21GdVoyVW5LVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQjNjbWwwWlVac2IyRjBJQ2hpZFdZc0lIWmhiSFZsTENCdlptWnpaWFFzSUd4cGRIUnNaVVZ1WkdsaGJpd2dibTlCYzNObGNuUXBJSHRjYmlBZ2RtRnNkV1VnUFNBcmRtRnNkV1ZjYmlBZ2IyWm1jMlYwSUQwZ2IyWm1jMlYwSUQ0K1BpQXdYRzRnSUdsbUlDZ2hibTlCYzNObGNuUXBJSHRjYmlBZ0lDQmphR1ZqYTBsRlJVVTNOVFFvWW5WbUxDQjJZV3gxWlN3Z2IyWm1jMlYwTENBMExDQXpMalF3TWpneU16UTJOak00TlRJNE9EWmxLek00TENBdE15NDBNREk0TWpNME5qWXpPRFV5T0RnMlpTc3pPQ2xjYmlBZ2ZWeHVJQ0JwWldWbE56VTBMbmR5YVhSbEtHSjFaaXdnZG1Gc2RXVXNJRzltWm5ObGRDd2diR2wwZEd4bFJXNWthV0Z1TENBeU15d2dOQ2xjYmlBZ2NtVjBkWEp1SUc5bVpuTmxkQ0FySURSY2JuMWNibHh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzUzY21sMFpVWnNiMkYwVEVVZ1BTQm1kVzVqZEdsdmJpQjNjbWwwWlVac2IyRjBURVVnS0haaGJIVmxMQ0J2Wm1aelpYUXNJRzV2UVhOelpYSjBLU0I3WEc0Z0lISmxkSFZ5YmlCM2NtbDBaVVpzYjJGMEtIUm9hWE1zSUhaaGJIVmxMQ0J2Wm1aelpYUXNJSFJ5ZFdVc0lHNXZRWE56WlhKMEtWeHVmVnh1WEc1Q2RXWm1aWEl1Y0hKdmRHOTBlWEJsTG5keWFYUmxSbXh2WVhSQ1JTQTlJR1oxYm1OMGFXOXVJSGR5YVhSbFJteHZZWFJDUlNBb2RtRnNkV1VzSUc5bVpuTmxkQ3dnYm05QmMzTmxjblFwSUh0Y2JpQWdjbVYwZFhKdUlIZHlhWFJsUm14dllYUW9kR2hwY3l3Z2RtRnNkV1VzSUc5bVpuTmxkQ3dnWm1Gc2MyVXNJRzV2UVhOelpYSjBLVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQjNjbWwwWlVSdmRXSnNaU0FvWW5WbUxDQjJZV3gxWlN3Z2IyWm1jMlYwTENCc2FYUjBiR1ZGYm1ScFlXNHNJRzV2UVhOelpYSjBLU0I3WEc0Z0lIWmhiSFZsSUQwZ0szWmhiSFZsWEc0Z0lHOW1abk5sZENBOUlHOW1abk5sZENBK1BqNGdNRnh1SUNCcFppQW9JVzV2UVhOelpYSjBLU0I3WEc0Z0lDQWdZMmhsWTJ0SlJVVkZOelUwS0dKMVppd2dkbUZzZFdVc0lHOW1abk5sZEN3Z09Dd2dNUzQzT1RjMk9UTXhNelE0TmpJek1UVTNSU3N6TURnc0lDMHhMamM1TnpZNU16RXpORGcyTWpNeE5UZEZLek13T0NsY2JpQWdmVnh1SUNCcFpXVmxOelUwTG5keWFYUmxLR0oxWml3Z2RtRnNkV1VzSUc5bVpuTmxkQ3dnYkdsMGRHeGxSVzVrYVdGdUxDQTFNaXdnT0NsY2JpQWdjbVYwZFhKdUlHOW1abk5sZENBcklEaGNibjFjYmx4dVFuVm1abVZ5TG5CeWIzUnZkSGx3WlM1M2NtbDBaVVJ2ZFdKc1pVeEZJRDBnWm5WdVkzUnBiMjRnZDNKcGRHVkViM1ZpYkdWTVJTQW9kbUZzZFdVc0lHOW1abk5sZEN3Z2JtOUJjM05sY25RcElIdGNiaUFnY21WMGRYSnVJSGR5YVhSbFJHOTFZbXhsS0hSb2FYTXNJSFpoYkhWbExDQnZabVp6WlhRc0lIUnlkV1VzSUc1dlFYTnpaWEowS1Z4dWZWeHVYRzVDZFdabVpYSXVjSEp2ZEc5MGVYQmxMbmR5YVhSbFJHOTFZbXhsUWtVZ1BTQm1kVzVqZEdsdmJpQjNjbWwwWlVSdmRXSnNaVUpGSUNoMllXeDFaU3dnYjJabWMyVjBMQ0J1YjBGemMyVnlkQ2tnZTF4dUlDQnlaWFIxY200Z2QzSnBkR1ZFYjNWaWJHVW9kR2hwY3l3Z2RtRnNkV1VzSUc5bVpuTmxkQ3dnWm1Gc2MyVXNJRzV2UVhOelpYSjBLVnh1ZlZ4dVhHNHZMeUJqYjNCNUtIUmhjbWRsZEVKMVptWmxjaXdnZEdGeVoyVjBVM1JoY25ROU1Dd2djMjkxY21ObFUzUmhjblE5TUN3Z2MyOTFjbU5sUlc1a1BXSjFabVpsY2k1c1pXNW5kR2dwWEc1Q2RXWm1aWEl1Y0hKdmRHOTBlWEJsTG1OdmNIa2dQU0JtZFc1amRHbHZiaUJqYjNCNUlDaDBZWEpuWlhRc0lIUmhjbWRsZEZOMFlYSjBMQ0J6ZEdGeWRDd2daVzVrS1NCN1hHNGdJR2xtSUNnaFFuVm1abVZ5TG1selFuVm1abVZ5S0hSaGNtZGxkQ2twSUhSb2NtOTNJRzVsZHlCVWVYQmxSWEp5YjNJb0oyRnlaM1Z0Wlc1MElITm9iM1ZzWkNCaVpTQmhJRUoxWm1abGNpY3BYRzRnSUdsbUlDZ2hjM1JoY25RcElITjBZWEowSUQwZ01GeHVJQ0JwWmlBb0lXVnVaQ0FtSmlCbGJtUWdJVDA5SURBcElHVnVaQ0E5SUhSb2FYTXViR1Z1WjNSb1hHNGdJR2xtSUNoMFlYSm5aWFJUZEdGeWRDQStQU0IwWVhKblpYUXViR1Z1WjNSb0tTQjBZWEpuWlhSVGRHRnlkQ0E5SUhSaGNtZGxkQzVzWlc1bmRHaGNiaUFnYVdZZ0tDRjBZWEpuWlhSVGRHRnlkQ2tnZEdGeVoyVjBVM1JoY25RZ1BTQXdYRzRnSUdsbUlDaGxibVFnUGlBd0lDWW1JR1Z1WkNBOElITjBZWEowS1NCbGJtUWdQU0J6ZEdGeWRGeHVYRzRnSUM4dklFTnZjSGtnTUNCaWVYUmxjenNnZDJVbmNtVWdaRzl1WlZ4dUlDQnBaaUFvWlc1a0lEMDlQU0J6ZEdGeWRDa2djbVYwZFhKdUlEQmNiaUFnYVdZZ0tIUmhjbWRsZEM1c1pXNW5kR2dnUFQwOUlEQWdmSHdnZEdocGN5NXNaVzVuZEdnZ1BUMDlJREFwSUhKbGRIVnliaUF3WEc1Y2JpQWdMeThnUm1GMFlXd2daWEp5YjNJZ1kyOXVaR2wwYVc5dWMxeHVJQ0JwWmlBb2RHRnlaMlYwVTNSaGNuUWdQQ0F3S1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUZKaGJtZGxSWEp5YjNJb0ozUmhjbWRsZEZOMFlYSjBJRzkxZENCdlppQmliM1Z1WkhNbktWeHVJQ0I5WEc0Z0lHbG1JQ2h6ZEdGeWRDQThJREFnZkh3Z2MzUmhjblFnUGowZ2RHaHBjeTVzWlc1bmRHZ3BJSFJvY205M0lHNWxkeUJTWVc1blpVVnljbTl5S0NkSmJtUmxlQ0J2ZFhRZ2IyWWdjbUZ1WjJVbktWeHVJQ0JwWmlBb1pXNWtJRHdnTUNrZ2RHaHliM2NnYm1WM0lGSmhibWRsUlhKeWIzSW9KM052ZFhKalpVVnVaQ0J2ZFhRZ2IyWWdZbTkxYm1Sekp5bGNibHh1SUNBdkx5QkJjbVVnZDJVZ2IyOWlQMXh1SUNCcFppQW9aVzVrSUQ0Z2RHaHBjeTVzWlc1bmRHZ3BJR1Z1WkNBOUlIUm9hWE11YkdWdVozUm9YRzRnSUdsbUlDaDBZWEpuWlhRdWJHVnVaM1JvSUMwZ2RHRnlaMlYwVTNSaGNuUWdQQ0JsYm1RZ0xTQnpkR0Z5ZENrZ2UxeHVJQ0FnSUdWdVpDQTlJSFJoY21kbGRDNXNaVzVuZEdnZ0xTQjBZWEpuWlhSVGRHRnlkQ0FySUhOMFlYSjBYRzRnSUgxY2JseHVJQ0IyWVhJZ2JHVnVJRDBnWlc1a0lDMGdjM1JoY25SY2JseHVJQ0JwWmlBb2RHaHBjeUE5UFQwZ2RHRnlaMlYwSUNZbUlIUjVjR1Z2WmlCVmFXNTBPRUZ5Y21GNUxuQnliM1J2ZEhsd1pTNWpiM0I1VjJsMGFHbHVJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0x5OGdWWE5sSUdKMWFXeDBMV2x1SUhkb1pXNGdZWFpoYVd4aFlteGxMQ0J0YVhOemFXNW5JR1p5YjIwZ1NVVXhNVnh1SUNBZ0lIUm9hWE11WTI5d2VWZHBkR2hwYmloMFlYSm5aWFJUZEdGeWRDd2djM1JoY25Rc0lHVnVaQ2xjYmlBZ2ZTQmxiSE5sSUdsbUlDaDBhR2x6SUQwOVBTQjBZWEpuWlhRZ0ppWWdjM1JoY25RZ1BDQjBZWEpuWlhSVGRHRnlkQ0FtSmlCMFlYSm5aWFJUZEdGeWRDQThJR1Z1WkNrZ2UxeHVJQ0FnSUM4dklHUmxjMk5sYm1ScGJtY2dZMjl3ZVNCbWNtOXRJR1Z1WkZ4dUlDQWdJR1p2Y2lBb2RtRnlJR2tnUFNCc1pXNGdMU0F4T3lCcElENDlJREE3SUMwdGFTa2dlMXh1SUNBZ0lDQWdkR0Z5WjJWMFcya2dLeUIwWVhKblpYUlRkR0Z5ZEYwZ1BTQjBhR2x6VzJrZ0t5QnpkR0Z5ZEYxY2JpQWdJQ0I5WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnVldsdWREaEJjbkpoZVM1d2NtOTBiM1I1Y0dVdWMyVjBMbU5oYkd3b1hHNGdJQ0FnSUNCMFlYSm5aWFFzWEc0Z0lDQWdJQ0IwYUdsekxuTjFZbUZ5Y21GNUtITjBZWEowTENCbGJtUXBMRnh1SUNBZ0lDQWdkR0Z5WjJWMFUzUmhjblJjYmlBZ0lDQXBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdiR1Z1WEc1OVhHNWNiaTh2SUZWellXZGxPbHh1THk4Z0lDQWdZblZtWm1WeUxtWnBiR3dvYm5WdFltVnlXeXdnYjJabWMyVjBXeXdnWlc1a1hWMHBYRzR2THlBZ0lDQmlkV1ptWlhJdVptbHNiQ2hpZFdabVpYSmJMQ0J2Wm1aelpYUmJMQ0JsYm1SZFhTbGNiaTh2SUNBZ0lHSjFabVpsY2k1bWFXeHNLSE4wY21sdVoxc3NJRzltWm5ObGRGc3NJR1Z1WkYxZFd5d2daVzVqYjJScGJtZGRLVnh1UW5WbVptVnlMbkJ5YjNSdmRIbHdaUzVtYVd4c0lEMGdablZ1WTNScGIyNGdabWxzYkNBb2RtRnNMQ0J6ZEdGeWRDd2daVzVrTENCbGJtTnZaR2x1WnlrZ2UxeHVJQ0F2THlCSVlXNWtiR1VnYzNSeWFXNW5JR05oYzJWek9seHVJQ0JwWmlBb2RIbHdaVzltSUhaaGJDQTlQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhOMFlYSjBJRDA5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ1pXNWpiMlJwYm1jZ1BTQnpkR0Z5ZEZ4dUlDQWdJQ0FnYzNSaGNuUWdQU0F3WEc0Z0lDQWdJQ0JsYm1RZ1BTQjBhR2x6TG14bGJtZDBhRnh1SUNBZ0lIMGdaV3h6WlNCcFppQW9kSGx3Wlc5bUlHVnVaQ0E5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lHVnVZMjlrYVc1bklEMGdaVzVrWEc0Z0lDQWdJQ0JsYm1RZ1BTQjBhR2x6TG14bGJtZDBhRnh1SUNBZ0lIMWNiaUFnSUNCcFppQW9aVzVqYjJScGJtY2dJVDA5SUhWdVpHVm1hVzVsWkNBbUppQjBlWEJsYjJZZ1pXNWpiMlJwYm1jZ0lUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0NkbGJtTnZaR2x1WnlCdGRYTjBJR0psSUdFZ2MzUnlhVzVuSnlsY2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUJsYm1OdlpHbHVaeUE5UFQwZ0ozTjBjbWx1WnljZ0ppWWdJVUoxWm1abGNpNXBjMFZ1WTI5a2FXNW5LR1Z1WTI5a2FXNW5LU2tnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUZSNWNHVkZjbkp2Y2lnblZXNXJibTkzYmlCbGJtTnZaR2x1WnpvZ0p5QXJJR1Z1WTI5a2FXNW5LVnh1SUNBZ0lIMWNiaUFnSUNCcFppQW9kbUZzTG14bGJtZDBhQ0E5UFQwZ01Ta2dlMXh1SUNBZ0lDQWdkbUZ5SUdOdlpHVWdQU0IyWVd3dVkyaGhja052WkdWQmRDZ3dLVnh1SUNBZ0lDQWdhV1lnS0NobGJtTnZaR2x1WnlBOVBUMGdKM1YwWmpnbklDWW1JR052WkdVZ1BDQXhNamdwSUh4OFhHNGdJQ0FnSUNBZ0lDQWdaVzVqYjJScGJtY2dQVDA5SUNkc1lYUnBiakVuS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJRVpoYzNRZ2NHRjBhRG9nU1dZZ1lIWmhiR0FnWm1sMGN5QnBiblJ2SUdFZ2MybHVaMnhsSUdKNWRHVXNJSFZ6WlNCMGFHRjBJRzUxYldWeWFXTWdkbUZzZFdVdVhHNGdJQ0FnSUNBZ0lIWmhiQ0E5SUdOdlpHVmNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDBnWld4elpTQnBaaUFvZEhsd1pXOW1JSFpoYkNBOVBUMGdKMjUxYldKbGNpY3BJSHRjYmlBZ0lDQjJZV3dnUFNCMllXd2dKaUF5TlRWY2JpQWdmVnh1WEc0Z0lDOHZJRWx1ZG1Gc2FXUWdjbUZ1WjJWeklHRnlaU0J1YjNRZ2MyVjBJSFJ2SUdFZ1pHVm1ZWFZzZEN3Z2MyOGdZMkZ1SUhKaGJtZGxJR05vWldOcklHVmhjbXg1TGx4dUlDQnBaaUFvYzNSaGNuUWdQQ0F3SUh4OElIUm9hWE11YkdWdVozUm9JRHdnYzNSaGNuUWdmSHdnZEdocGN5NXNaVzVuZEdnZ1BDQmxibVFwSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnVW1GdVoyVkZjbkp2Y2lnblQzVjBJRzltSUhKaGJtZGxJR2x1WkdWNEp5bGNiaUFnZlZ4dVhHNGdJR2xtSUNobGJtUWdQRDBnYzNSaGNuUXBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjMXh1SUNCOVhHNWNiaUFnYzNSaGNuUWdQU0J6ZEdGeWRDQStQajRnTUZ4dUlDQmxibVFnUFNCbGJtUWdQVDA5SUhWdVpHVm1hVzVsWkNBL0lIUm9hWE11YkdWdVozUm9JRG9nWlc1a0lENCtQaUF3WEc1Y2JpQWdhV1lnS0NGMllXd3BJSFpoYkNBOUlEQmNibHh1SUNCMllYSWdhVnh1SUNCcFppQW9kSGx3Wlc5bUlIWmhiQ0E5UFQwZ0oyNTFiV0psY2ljcElIdGNiaUFnSUNCbWIzSWdLR2tnUFNCemRHRnlkRHNnYVNBOElHVnVaRHNnS3l0cEtTQjdYRzRnSUNBZ0lDQjBhR2x6VzJsZElEMGdkbUZzWEc0Z0lDQWdmVnh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSFpoY2lCaWVYUmxjeUE5SUVKMVptWmxjaTVwYzBKMVptWmxjaWgyWVd3cFhHNGdJQ0FnSUNBL0lIWmhiRnh1SUNBZ0lDQWdPaUJDZFdabVpYSXVabkp2YlNoMllXd3NJR1Z1WTI5a2FXNW5LVnh1SUNBZ0lIWmhjaUJzWlc0Z1BTQmllWFJsY3k1c1pXNW5kR2hjYmlBZ0lDQnBaaUFvYkdWdUlEMDlQU0F3S1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1ZIbHdaVVZ5Y205eUtDZFVhR1VnZG1Gc2RXVWdYQ0luSUNzZ2RtRnNJQ3RjYmlBZ0lDQWdJQ0FnSjF3aUlHbHpJR2x1ZG1Gc2FXUWdabTl5SUdGeVozVnRaVzUwSUZ3aWRtRnNkV1ZjSWljcFhHNGdJQ0FnZlZ4dUlDQWdJR1p2Y2lBb2FTQTlJREE3SUdrZ1BDQmxibVFnTFNCemRHRnlkRHNnS3l0cEtTQjdYRzRnSUNBZ0lDQjBhR2x6VzJrZ0t5QnpkR0Z5ZEYwZ1BTQmllWFJsYzF0cElDVWdiR1Z1WFZ4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUIwYUdselhHNTlYRzVjYmk4dklFaEZURkJGVWlCR1ZVNURWRWxQVGxOY2JpOHZJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMWNibHh1ZG1GeUlFbE9Wa0ZNU1VSZlFrRlRSVFkwWDFKRklEMGdMMXRlS3k4d0xUbEJMVnBoTFhvdFgxMHZaMXh1WEc1bWRXNWpkR2x2YmlCaVlYTmxOalJqYkdWaGJpQW9jM1J5S1NCN1hHNGdJQzh2SUU1dlpHVWdkR0ZyWlhNZ1pYRjFZV3dnYzJsbmJuTWdZWE1nWlc1a0lHOW1JSFJvWlNCQ1lYTmxOalFnWlc1amIyUnBibWRjYmlBZ2MzUnlJRDBnYzNSeUxuTndiR2wwS0NjOUp5bGJNRjFjYmlBZ0x5OGdUbTlrWlNCemRISnBjSE1nYjNWMElHbHVkbUZzYVdRZ1kyaGhjbUZqZEdWeWN5QnNhV3RsSUZ4Y2JpQmhibVFnWEZ4MElHWnliMjBnZEdobElITjBjbWx1Wnl3Z1ltRnpaVFkwTFdweklHUnZaWE1nYm05MFhHNGdJSE4wY2lBOUlITjBjaTUwY21sdEtDa3VjbVZ3YkdGalpTaEpUbFpCVEVsRVgwSkJVMFUyTkY5U1JTd2dKeWNwWEc0Z0lDOHZJRTV2WkdVZ1kyOXVkbVZ5ZEhNZ2MzUnlhVzVuY3lCM2FYUm9JR3hsYm1kMGFDQThJRElnZEc4Z0p5ZGNiaUFnYVdZZ0tITjBjaTVzWlc1bmRHZ2dQQ0F5S1NCeVpYUjFjbTRnSnlkY2JpQWdMeThnVG05a1pTQmhiR3h2ZDNNZ1ptOXlJRzV2Ymkxd1lXUmtaV1FnWW1GelpUWTBJSE4wY21sdVozTWdLRzFwYzNOcGJtY2dkSEpoYVd4cGJtY2dQVDA5S1N3Z1ltRnpaVFkwTFdweklHUnZaWE1nYm05MFhHNGdJSGRvYVd4bElDaHpkSEl1YkdWdVozUm9JQ1VnTkNBaFBUMGdNQ2tnZTF4dUlDQWdJSE4wY2lBOUlITjBjaUFySUNjOUoxeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCemRISmNibjFjYmx4dVpuVnVZM1JwYjI0Z2RHOUlaWGdnS0c0cElIdGNiaUFnYVdZZ0tHNGdQQ0F4TmlrZ2NtVjBkWEp1SUNjd0p5QXJJRzR1ZEc5VGRISnBibWNvTVRZcFhHNGdJSEpsZEhWeWJpQnVMblJ2VTNSeWFXNW5LREUyS1Z4dWZWeHVYRzVtZFc1amRHbHZiaUIxZEdZNFZHOUNlWFJsY3lBb2MzUnlhVzVuTENCMWJtbDBjeWtnZTF4dUlDQjFibWwwY3lBOUlIVnVhWFJ6SUh4OElFbHVabWx1YVhSNVhHNGdJSFpoY2lCamIyUmxVRzlwYm5SY2JpQWdkbUZ5SUd4bGJtZDBhQ0E5SUhOMGNtbHVaeTVzWlc1bmRHaGNiaUFnZG1GeUlHeGxZV1JUZFhKeWIyZGhkR1VnUFNCdWRXeHNYRzRnSUhaaGNpQmllWFJsY3lBOUlGdGRYRzVjYmlBZ1ptOXlJQ2gyWVhJZ2FTQTlJREE3SUdrZ1BDQnNaVzVuZEdnN0lDc3JhU2tnZTF4dUlDQWdJR052WkdWUWIybHVkQ0E5SUhOMGNtbHVaeTVqYUdGeVEyOWtaVUYwS0drcFhHNWNiaUFnSUNBdkx5QnBjeUJ6ZFhKeWIyZGhkR1VnWTI5dGNHOXVaVzUwWEc0Z0lDQWdhV1lnS0dOdlpHVlFiMmx1ZENBK0lEQjRSRGRHUmlBbUppQmpiMlJsVUc5cGJuUWdQQ0F3ZUVVd01EQXBJSHRjYmlBZ0lDQWdJQzh2SUd4aGMzUWdZMmhoY2lCM1lYTWdZU0JzWldGa1hHNGdJQ0FnSUNCcFppQW9JV3hsWVdSVGRYSnliMmRoZEdVcElIdGNiaUFnSUNBZ0lDQWdMeThnYm04Z2JHVmhaQ0I1WlhSY2JpQWdJQ0FnSUNBZ2FXWWdLR052WkdWUWIybHVkQ0ErSURCNFJFSkdSaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJSFZ1Wlhod1pXTjBaV1FnZEhKaGFXeGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb0tIVnVhWFJ6SUMwOUlETXBJRDRnTFRFcElHSjVkR1Z6TG5CMWMyZ29NSGhGUml3Z01IaENSaXdnTUhoQ1JDbGNiaUFnSUNBZ0lDQWdJQ0JqYjI1MGFXNTFaVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0drZ0t5QXhJRDA5UFNCc1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQXZMeUIxYm5CaGFYSmxaQ0JzWldGa1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0NoMWJtbDBjeUF0UFNBektTQStJQzB4S1NCaWVYUmxjeTV3ZFhOb0tEQjRSVVlzSURCNFFrWXNJREI0UWtRcFhHNGdJQ0FnSUNBZ0lDQWdZMjl1ZEdsdWRXVmNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklIWmhiR2xrSUd4bFlXUmNiaUFnSUNBZ0lDQWdiR1ZoWkZOMWNuSnZaMkYwWlNBOUlHTnZaR1ZRYjJsdWRGeHVYRzRnSUNBZ0lDQWdJR052Ym5ScGJuVmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SURJZ2JHVmhaSE1nYVc0Z1lTQnliM2RjYmlBZ0lDQWdJR2xtSUNoamIyUmxVRzlwYm5RZ1BDQXdlRVJETURBcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0NoMWJtbDBjeUF0UFNBektTQStJQzB4S1NCaWVYUmxjeTV3ZFhOb0tEQjRSVVlzSURCNFFrWXNJREI0UWtRcFhHNGdJQ0FnSUNBZ0lHeGxZV1JUZFhKeWIyZGhkR1VnUFNCamIyUmxVRzlwYm5SY2JpQWdJQ0FnSUNBZ1kyOXVkR2x1ZFdWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdkbUZzYVdRZ2MzVnljbTluWVhSbElIQmhhWEpjYmlBZ0lDQWdJR052WkdWUWIybHVkQ0E5SUNoc1pXRmtVM1Z5Y205bllYUmxJQzBnTUhoRU9EQXdJRHc4SURFd0lId2dZMjlrWlZCdmFXNTBJQzBnTUhoRVF6QXdLU0FySURCNE1UQXdNREJjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLR3hsWVdSVGRYSnliMmRoZEdVcElIdGNiaUFnSUNBZ0lDOHZJSFpoYkdsa0lHSnRjQ0JqYUdGeUxDQmlkWFFnYkdGemRDQmphR0Z5SUhkaGN5QmhJR3hsWVdSY2JpQWdJQ0FnSUdsbUlDZ29kVzVwZEhNZ0xUMGdNeWtnUGlBdE1Ta2dZbmwwWlhNdWNIVnphQ2d3ZUVWR0xDQXdlRUpHTENBd2VFSkVLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHeGxZV1JUZFhKeWIyZGhkR1VnUFNCdWRXeHNYRzVjYmlBZ0lDQXZMeUJsYm1OdlpHVWdkWFJtT0Z4dUlDQWdJR2xtSUNoamIyUmxVRzlwYm5RZ1BDQXdlRGd3S1NCN1hHNGdJQ0FnSUNCcFppQW9LSFZ1YVhSeklDMDlJREVwSUR3Z01Da2dZbkpsWVd0Y2JpQWdJQ0FnSUdKNWRHVnpMbkIxYzJnb1kyOWtaVkJ2YVc1MEtWeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb1kyOWtaVkJ2YVc1MElEd2dNSGc0TURBcElIdGNiaUFnSUNBZ0lHbG1JQ2dvZFc1cGRITWdMVDBnTWlrZ1BDQXdLU0JpY21WaGExeHVJQ0FnSUNBZ1lubDBaWE11Y0hWemFDaGNiaUFnSUNBZ0lDQWdZMjlrWlZCdmFXNTBJRDQrSURCNE5pQjhJREI0UXpBc1hHNGdJQ0FnSUNBZ0lHTnZaR1ZRYjJsdWRDQW1JREI0TTBZZ2ZDQXdlRGd3WEc0Z0lDQWdJQ0FwWEc0Z0lDQWdmU0JsYkhObElHbG1JQ2hqYjJSbFVHOXBiblFnUENBd2VERXdNREF3S1NCN1hHNGdJQ0FnSUNCcFppQW9LSFZ1YVhSeklDMDlJRE1wSUR3Z01Da2dZbkpsWVd0Y2JpQWdJQ0FnSUdKNWRHVnpMbkIxYzJnb1hHNGdJQ0FnSUNBZ0lHTnZaR1ZRYjJsdWRDQStQaUF3ZUVNZ2ZDQXdlRVV3TEZ4dUlDQWdJQ0FnSUNCamIyUmxVRzlwYm5RZ1BqNGdNSGcySUNZZ01IZ3pSaUI4SURCNE9EQXNYRzRnSUNBZ0lDQWdJR052WkdWUWIybHVkQ0FtSURCNE0wWWdmQ0F3ZURnd1hHNGdJQ0FnSUNBcFhHNGdJQ0FnZlNCbGJITmxJR2xtSUNoamIyUmxVRzlwYm5RZ1BDQXdlREV4TURBd01Da2dlMXh1SUNBZ0lDQWdhV1lnS0NoMWJtbDBjeUF0UFNBMEtTQThJREFwSUdKeVpXRnJYRzRnSUNBZ0lDQmllWFJsY3k1d2RYTm9LRnh1SUNBZ0lDQWdJQ0JqYjJSbFVHOXBiblFnUGo0Z01IZ3hNaUI4SURCNFJqQXNYRzRnSUNBZ0lDQWdJR052WkdWUWIybHVkQ0ErUGlBd2VFTWdKaUF3ZUROR0lId2dNSGc0TUN4Y2JpQWdJQ0FnSUNBZ1kyOWtaVkJ2YVc1MElENCtJREI0TmlBbUlEQjRNMFlnZkNBd2VEZ3dMRnh1SUNBZ0lDQWdJQ0JqYjJSbFVHOXBiblFnSmlBd2VETkdJSHdnTUhnNE1GeHVJQ0FnSUNBZ0tWeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMGx1ZG1Gc2FXUWdZMjlrWlNCd2IybHVkQ2NwWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJR0o1ZEdWelhHNTlYRzVjYm1aMWJtTjBhVzl1SUdGelkybHBWRzlDZVhSbGN5QW9jM1J5S1NCN1hHNGdJSFpoY2lCaWVYUmxRWEp5WVhrZ1BTQmJYVnh1SUNCbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOElITjBjaTVzWlc1bmRHZzdJQ3NyYVNrZ2UxeHVJQ0FnSUM4dklFNXZaR1VuY3lCamIyUmxJSE5sWlcxeklIUnZJR0psSUdSdmFXNW5JSFJvYVhNZ1lXNWtJRzV2ZENBbUlEQjROMFl1TGx4dUlDQWdJR0o1ZEdWQmNuSmhlUzV3ZFhOb0tITjBjaTVqYUdGeVEyOWtaVUYwS0drcElDWWdNSGhHUmlsY2JpQWdmVnh1SUNCeVpYUjFjbTRnWW5sMFpVRnljbUY1WEc1OVhHNWNibVoxYm1OMGFXOXVJSFYwWmpFMmJHVlViMEo1ZEdWeklDaHpkSElzSUhWdWFYUnpLU0I3WEc0Z0lIWmhjaUJqTENCb2FTd2diRzljYmlBZ2RtRnlJR0o1ZEdWQmNuSmhlU0E5SUZ0ZFhHNGdJR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnYzNSeUxteGxibWQwYURzZ0t5dHBLU0I3WEc0Z0lDQWdhV1lnS0NoMWJtbDBjeUF0UFNBeUtTQThJREFwSUdKeVpXRnJYRzVjYmlBZ0lDQmpJRDBnYzNSeUxtTm9ZWEpEYjJSbFFYUW9hU2xjYmlBZ0lDQm9hU0E5SUdNZ1BqNGdPRnh1SUNBZ0lHeHZJRDBnWXlBbElESTFObHh1SUNBZ0lHSjVkR1ZCY25KaGVTNXdkWE5vS0d4dktWeHVJQ0FnSUdKNWRHVkJjbkpoZVM1d2RYTm9LR2hwS1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUdKNWRHVkJjbkpoZVZ4dWZWeHVYRzVtZFc1amRHbHZiaUJpWVhObE5qUlViMEo1ZEdWeklDaHpkSElwSUh0Y2JpQWdjbVYwZFhKdUlHSmhjMlUyTkM1MGIwSjVkR1ZCY25KaGVTaGlZWE5sTmpSamJHVmhiaWh6ZEhJcEtWeHVmVnh1WEc1bWRXNWpkR2x2YmlCaWJHbDBRblZtWm1WeUlDaHpjbU1zSUdSemRDd2diMlptYzJWMExDQnNaVzVuZEdncElIdGNiaUFnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCc1pXNW5kR2c3SUNzcmFTa2dlMXh1SUNBZ0lHbG1JQ2dvYVNBcklHOW1abk5sZENBK1BTQmtjM1F1YkdWdVozUm9LU0I4ZkNBb2FTQStQU0J6Y21NdWJHVnVaM1JvS1NrZ1luSmxZV3RjYmlBZ0lDQmtjM1JiYVNBcklHOW1abk5sZEYwZ1BTQnpjbU5iYVYxY2JpQWdmVnh1SUNCeVpYUjFjbTRnYVZ4dWZWeHVYRzR2THlCQmNuSmhlVUoxWm1abGNpQnZjaUJWYVc1ME9FRnljbUY1SUc5aWFtVmpkSE1nWm5KdmJTQnZkR2hsY2lCamIyNTBaWGgwY3lBb2FTNWxMaUJwWm5KaGJXVnpLU0JrYnlCdWIzUWdjR0Z6YzF4dUx5OGdkR2hsSUdCcGJuTjBZVzVqWlc5bVlDQmphR1ZqYXlCaWRYUWdkR2hsZVNCemFHOTFiR1FnWW1VZ2RISmxZWFJsWkNCaGN5QnZaaUIwYUdGMElIUjVjR1V1WEc0dkx5QlRaV1U2SUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5bVpYSnZjM012WW5WbVptVnlMMmx6YzNWbGN5OHhOalpjYm1aMWJtTjBhVzl1SUdselNXNXpkR0Z1WTJVZ0tHOWlhaXdnZEhsd1pTa2dlMXh1SUNCeVpYUjFjbTRnYjJKcUlHbHVjM1JoYm1ObGIyWWdkSGx3WlNCOGZGeHVJQ0FnSUNodlltb2dJVDBnYm5Wc2JDQW1KaUJ2WW1vdVkyOXVjM1J5ZFdOMGIzSWdJVDBnYm5Wc2JDQW1KaUJ2WW1vdVkyOXVjM1J5ZFdOMGIzSXVibUZ0WlNBaFBTQnVkV3hzSUNZbVhHNGdJQ0FnSUNCdlltb3VZMjl1YzNSeWRXTjBiM0l1Ym1GdFpTQTlQVDBnZEhsd1pTNXVZVzFsS1Z4dWZWeHVablZ1WTNScGIyNGdiblZ0WW1WeVNYTk9ZVTRnS0c5aWFpa2dlMXh1SUNBdkx5QkdiM0lnU1VVeE1TQnpkWEJ3YjNKMFhHNGdJSEpsZEhWeWJpQnZZbW9nSVQwOUlHOWlhaUF2THlCbGMyeHBiblF0WkdsellXSnNaUzFzYVc1bElHNXZMWE5sYkdZdFkyOXRjR0Z5WlZ4dWZWeHVJaXdpTHlvaElHbGxaV1UzTlRRdUlFSlRSQzB6TFVOc1lYVnpaU0JNYVdObGJuTmxMaUJHWlhKdmMzTWdRV0p2ZFd0b1lXUnBhbVZvSUR4b2RIUndjem92TDJabGNtOXpjeTV2Y21jdmIzQmxibk52ZFhKalpUNGdLaTljYm1WNGNHOXlkSE11Y21WaFpDQTlJR1oxYm1OMGFXOXVJQ2hpZFdabVpYSXNJRzltWm5ObGRDd2dhWE5NUlN3Z2JVeGxiaXdnYmtKNWRHVnpLU0I3WEc0Z0lIWmhjaUJsTENCdFhHNGdJSFpoY2lCbFRHVnVJRDBnS0c1Q2VYUmxjeUFxSURncElDMGdiVXhsYmlBdElERmNiaUFnZG1GeUlHVk5ZWGdnUFNBb01TQThQQ0JsVEdWdUtTQXRJREZjYmlBZ2RtRnlJR1ZDYVdGeklEMGdaVTFoZUNBK1BpQXhYRzRnSUhaaGNpQnVRbWwwY3lBOUlDMDNYRzRnSUhaaGNpQnBJRDBnYVhOTVJTQS9JQ2h1UW5sMFpYTWdMU0F4S1NBNklEQmNiaUFnZG1GeUlHUWdQU0JwYzB4RklEOGdMVEVnT2lBeFhHNGdJSFpoY2lCeklEMGdZblZtWm1WeVcyOW1abk5sZENBcklHbGRYRzVjYmlBZ2FTQXJQU0JrWEc1Y2JpQWdaU0E5SUhNZ0ppQW9LREVnUER3Z0tDMXVRbWwwY3lrcElDMGdNU2xjYmlBZ2N5QStQajBnS0MxdVFtbDBjeWxjYmlBZ2JrSnBkSE1nS3owZ1pVeGxibHh1SUNCbWIzSWdLRHNnYmtKcGRITWdQaUF3T3lCbElEMGdLR1VnS2lBeU5UWXBJQ3NnWW5WbVptVnlXMjltWm5ObGRDQXJJR2xkTENCcElDczlJR1FzSUc1Q2FYUnpJQzA5SURncElIdDlYRzVjYmlBZ2JTQTlJR1VnSmlBb0tERWdQRHdnS0MxdVFtbDBjeWtwSUMwZ01TbGNiaUFnWlNBK1BqMGdLQzF1UW1sMGN5bGNiaUFnYmtKcGRITWdLejBnYlV4bGJseHVJQ0JtYjNJZ0tEc2dia0pwZEhNZ1BpQXdPeUJ0SUQwZ0tHMGdLaUF5TlRZcElDc2dZblZtWm1WeVcyOW1abk5sZENBcklHbGRMQ0JwSUNzOUlHUXNJRzVDYVhSeklDMDlJRGdwSUh0OVhHNWNiaUFnYVdZZ0tHVWdQVDA5SURBcElIdGNiaUFnSUNCbElEMGdNU0F0SUdWQ2FXRnpYRzRnSUgwZ1pXeHpaU0JwWmlBb1pTQTlQVDBnWlUxaGVDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCdElEOGdUbUZPSURvZ0tDaHpJRDhnTFRFZ09pQXhLU0FxSUVsdVptbHVhWFI1S1Z4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUcwZ1BTQnRJQ3NnVFdGMGFDNXdiM2NvTWl3Z2JVeGxiaWxjYmlBZ0lDQmxJRDBnWlNBdElHVkNhV0Z6WEc0Z0lIMWNiaUFnY21WMGRYSnVJQ2h6SUQ4Z0xURWdPaUF4S1NBcUlHMGdLaUJOWVhSb0xuQnZkeWd5TENCbElDMGdiVXhsYmlsY2JuMWNibHh1Wlhod2IzSjBjeTUzY21sMFpTQTlJR1oxYm1OMGFXOXVJQ2hpZFdabVpYSXNJSFpoYkhWbExDQnZabVp6WlhRc0lHbHpURVVzSUcxTVpXNHNJRzVDZVhSbGN5a2dlMXh1SUNCMllYSWdaU3dnYlN3Z1kxeHVJQ0IyWVhJZ1pVeGxiaUE5SUNodVFubDBaWE1nS2lBNEtTQXRJRzFNWlc0Z0xTQXhYRzRnSUhaaGNpQmxUV0Y0SUQwZ0tERWdQRHdnWlV4bGJpa2dMU0F4WEc0Z0lIWmhjaUJsUW1saGN5QTlJR1ZOWVhnZ1BqNGdNVnh1SUNCMllYSWdjblFnUFNBb2JVeGxiaUE5UFQwZ01qTWdQeUJOWVhSb0xuQnZkeWd5TENBdE1qUXBJQzBnVFdGMGFDNXdiM2NvTWl3Z0xUYzNLU0E2SURBcFhHNGdJSFpoY2lCcElEMGdhWE5NUlNBL0lEQWdPaUFvYmtKNWRHVnpJQzBnTVNsY2JpQWdkbUZ5SUdRZ1BTQnBjMHhGSUQ4Z01TQTZJQzB4WEc0Z0lIWmhjaUJ6SUQwZ2RtRnNkV1VnUENBd0lIeDhJQ2gyWVd4MVpTQTlQVDBnTUNBbUppQXhJQzhnZG1Gc2RXVWdQQ0F3S1NBL0lERWdPaUF3WEc1Y2JpQWdkbUZzZFdVZ1BTQk5ZWFJvTG1GaWN5aDJZV3gxWlNsY2JseHVJQ0JwWmlBb2FYTk9ZVTRvZG1Gc2RXVXBJSHg4SUhaaGJIVmxJRDA5UFNCSmJtWnBibWwwZVNrZ2UxeHVJQ0FnSUcwZ1BTQnBjMDVoVGloMllXeDFaU2tnUHlBeElEb2dNRnh1SUNBZ0lHVWdQU0JsVFdGNFhHNGdJSDBnWld4elpTQjdYRzRnSUNBZ1pTQTlJRTFoZEdndVpteHZiM0lvVFdGMGFDNXNiMmNvZG1Gc2RXVXBJQzhnVFdGMGFDNU1UaklwWEc0Z0lDQWdhV1lnS0haaGJIVmxJQ29nS0dNZ1BTQk5ZWFJvTG5CdmR5Z3lMQ0F0WlNrcElEd2dNU2tnZTF4dUlDQWdJQ0FnWlMwdFhHNGdJQ0FnSUNCaklDbzlJREpjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR1VnS3lCbFFtbGhjeUErUFNBeEtTQjdYRzRnSUNBZ0lDQjJZV3gxWlNBclBTQnlkQ0F2SUdOY2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdkbUZzZFdVZ0t6MGdjblFnS2lCTllYUm9MbkJ2ZHlneUxDQXhJQzBnWlVKcFlYTXBYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaDJZV3gxWlNBcUlHTWdQajBnTWlrZ2UxeHVJQ0FnSUNBZ1pTc3JYRzRnSUNBZ0lDQmpJQzg5SURKY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb1pTQXJJR1ZDYVdGeklENDlJR1ZOWVhncElIdGNiaUFnSUNBZ0lHMGdQU0F3WEc0Z0lDQWdJQ0JsSUQwZ1pVMWhlRnh1SUNBZ0lIMGdaV3h6WlNCcFppQW9aU0FySUdWQ2FXRnpJRDQ5SURFcElIdGNiaUFnSUNBZ0lHMGdQU0FvS0haaGJIVmxJQ29nWXlrZ0xTQXhLU0FxSUUxaGRHZ3VjRzkzS0RJc0lHMU1aVzRwWEc0Z0lDQWdJQ0JsSUQwZ1pTQXJJR1ZDYVdGelhHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJRzBnUFNCMllXeDFaU0FxSUUxaGRHZ3VjRzkzS0RJc0lHVkNhV0Z6SUMwZ01Ta2dLaUJOWVhSb0xuQnZkeWd5TENCdFRHVnVLVnh1SUNBZ0lDQWdaU0E5SURCY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCbWIzSWdLRHNnYlV4bGJpQStQU0E0T3lCaWRXWm1aWEpiYjJabWMyVjBJQ3NnYVYwZ1BTQnRJQ1lnTUhobVppd2dhU0FyUFNCa0xDQnRJQzg5SURJMU5pd2diVXhsYmlBdFBTQTRLU0I3ZlZ4dVhHNGdJR1VnUFNBb1pTQThQQ0J0VEdWdUtTQjhJRzFjYmlBZ1pVeGxiaUFyUFNCdFRHVnVYRzRnSUdadmNpQW9PeUJsVEdWdUlENGdNRHNnWW5WbVptVnlXMjltWm5ObGRDQXJJR2xkSUQwZ1pTQW1JREI0Wm1Zc0lHa2dLejBnWkN3Z1pTQXZQU0F5TlRZc0lHVk1aVzRnTFQwZ09Da2dlMzFjYmx4dUlDQmlkV1ptWlhKYmIyWm1jMlYwSUNzZ2FTQXRJR1JkSUh3OUlITWdLaUF4TWpoY2JuMWNiaUlzSWk4dklITm9hVzBnWm05eUlIVnphVzVuSUhCeWIyTmxjM01nYVc0Z1luSnZkM05sY2x4dWRtRnlJSEJ5YjJObGMzTWdQU0J0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHQ5TzF4dVhHNHZMeUJqWVdOb1pXUWdabkp2YlNCM2FHRjBaWFpsY2lCbmJHOWlZV3dnYVhNZ2NISmxjMlZ1ZENCemJ5QjBhR0YwSUhSbGMzUWdjblZ1Ym1WeWN5QjBhR0YwSUhOMGRXSWdhWFJjYmk4dklHUnZiaWQwSUdKeVpXRnJJSFJvYVc1bmN5NGdJRUoxZENCM1pTQnVaV1ZrSUhSdklIZHlZWEFnYVhRZ2FXNGdZU0IwY25rZ1kyRjBZMmdnYVc0Z1kyRnpaU0JwZENCcGMxeHVMeThnZDNKaGNIQmxaQ0JwYmlCemRISnBZM1FnYlc5a1pTQmpiMlJsSUhkb2FXTm9JR1J2WlhOdUozUWdaR1ZtYVc1bElHRnVlU0JuYkc5aVlXeHpMaUFnU1hRbmN5QnBibk5wWkdVZ1lWeHVMeThnWm5WdVkzUnBiMjRnWW1WallYVnpaU0IwY25rdlkyRjBZMmhsY3lCa1pXOXdkR2x0YVhwbElHbHVJR05sY25SaGFXNGdaVzVuYVc1bGN5NWNibHh1ZG1GeUlHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRN1hHNTJZWElnWTJGamFHVmtRMnhsWVhKVWFXMWxiM1YwTzF4dVhHNW1kVzVqZEdsdmJpQmtaV1poZFd4MFUyVjBWR2x0YjNWMEtDa2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnbmMyVjBWR2x0Wlc5MWRDQm9ZWE1nYm05MElHSmxaVzRnWkdWbWFXNWxaQ2NwTzF4dWZWeHVablZ1WTNScGIyNGdaR1ZtWVhWc2RFTnNaV0Z5VkdsdFpXOTFkQ0FvS1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RqYkdWaGNsUnBiV1Z2ZFhRZ2FHRnpJRzV2ZENCaVpXVnVJR1JsWm1sdVpXUW5LVHRjYm4xY2JpaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQnpaWFJVYVcxbGIzVjBJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCallXTm9aV1JUWlhSVWFXMWxiM1YwSUQwZ2MyVjBWR2x0Wlc5MWREdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaFkyaGxaRk5sZEZScGJXVnZkWFFnUFNCa1pXWmhkV3gwVTJWMFZHbHRiM1YwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUNBZ0lDQmpZV05vWldSVFpYUlVhVzFsYjNWMElEMGdaR1ZtWVhWc2RGTmxkRlJwYlc5MWREdGNiaUFnSUNCOVhHNGdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJqYkdWaGNsUnBiV1Z2ZFhRZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oWTJobFpFTnNaV0Z5VkdsdFpXOTFkQ0E5SUdOc1pXRnlWR2x0Wlc5MWREdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOUlHUmxabUYxYkhSRGJHVmhjbFJwYldWdmRYUTdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQjlJR05oZEdOb0lDaGxLU0I3WEc0Z0lDQWdJQ0FnSUdOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOUlHUmxabUYxYkhSRGJHVmhjbFJwYldWdmRYUTdYRzRnSUNBZ2ZWeHVmU0FvS1NsY2JtWjFibU4wYVc5dUlISjFibFJwYldWdmRYUW9ablZ1S1NCN1hHNGdJQ0FnYVdZZ0tHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRZ1BUMDlJSE5sZEZScGJXVnZkWFFwSUh0Y2JpQWdJQ0FnSUNBZ0x5OXViM0p0WVd3Z1pXNTJhWEp2YldWdWRITWdhVzRnYzJGdVpTQnphWFIxWVhScGIyNXpYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnpaWFJVYVcxbGIzVjBLR1oxYml3Z01DazdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklHbG1JSE5sZEZScGJXVnZkWFFnZDJGemJpZDBJR0YyWVdsc1lXSnNaU0JpZFhRZ2QyRnpJR3hoZEhSbGNpQmtaV1pwYm1Wa1hHNGdJQ0FnYVdZZ0tDaGpZV05vWldSVFpYUlVhVzFsYjNWMElEMDlQU0JrWldaaGRXeDBVMlYwVkdsdGIzVjBJSHg4SUNGallXTm9aV1JUWlhSVWFXMWxiM1YwS1NBbUppQnpaWFJVYVcxbGIzVjBLU0I3WEc0Z0lDQWdJQ0FnSUdOaFkyaGxaRk5sZEZScGJXVnZkWFFnUFNCelpYUlVhVzFsYjNWME8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2MyVjBWR2x0Wlc5MWRDaG1kVzRzSURBcE8xeHVJQ0FnSUgxY2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQXZMeUIzYUdWdUlIZG9aVzRnYzI5dFpXSnZaSGtnYUdGeklITmpjbVYzWldRZ2QybDBhQ0J6WlhSVWFXMWxiM1YwSUdKMWRDQnVieUJKTGtVdUlHMWhaR1J1WlhOelhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCallXTm9aV1JUWlhSVWFXMWxiM1YwS0daMWJpd2dNQ2s3WEc0Z0lDQWdmU0JqWVhSamFDaGxLWHRjYmlBZ0lDQWdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklGZG9aVzRnZDJVZ1lYSmxJR2x1SUVrdVJTNGdZblYwSUhSb1pTQnpZM0pwY0hRZ2FHRnpJR0psWlc0Z1pYWmhiR1ZrSUhOdklFa3VSUzRnWkc5bGMyNG5kQ0IwY25WemRDQjBhR1VnWjJ4dlltRnNJRzlpYW1WamRDQjNhR1Z1SUdOaGJHeGxaQ0J1YjNKdFlXeHNlVnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdOaFkyaGxaRk5sZEZScGJXVnZkWFF1WTJGc2JDaHVkV3hzTENCbWRXNHNJREFwTzF4dUlDQWdJQ0FnSUNCOUlHTmhkR05vS0dVcGUxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2MyRnRaU0JoY3lCaFltOTJaU0JpZFhRZ2QyaGxiaUJwZENkeklHRWdkbVZ5YzJsdmJpQnZaaUJKTGtVdUlIUm9ZWFFnYlhWemRDQm9ZWFpsSUhSb1pTQm5iRzlpWVd3Z2IySnFaV04wSUdadmNpQW5kR2hwY3ljc0lHaHZjR1oxYkd4NUlHOTFjaUJqYjI1MFpYaDBJR052Y25KbFkzUWdiM1JvWlhKM2FYTmxJR2wwSUhkcGJHd2dkR2h5YjNjZ1lTQm5iRzlpWVd3Z1pYSnliM0pjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCallXTm9aV1JUWlhSVWFXMWxiM1YwTG1OaGJHd29kR2hwY3l3Z1puVnVMQ0F3S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVYRzU5WEc1bWRXNWpkR2x2YmlCeWRXNURiR1ZoY2xScGJXVnZkWFFvYldGeWEyVnlLU0I3WEc0Z0lDQWdhV1lnS0dOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOVBUMGdZMnhsWVhKVWFXMWxiM1YwS1NCN1hHNGdJQ0FnSUNBZ0lDOHZibTl5YldGc0lHVnVkbWx5YjIxbGJuUnpJR2x1SUhOaGJtVWdjMmwwZFdGMGFXOXVjMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdZMnhsWVhKVWFXMWxiM1YwS0cxaGNtdGxjaWs3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJR2xtSUdOc1pXRnlWR2x0Wlc5MWRDQjNZWE51SjNRZ1lYWmhhV3hoWW14bElHSjFkQ0IzWVhNZ2JHRjBkR1Z5SUdSbFptbHVaV1JjYmlBZ0lDQnBaaUFvS0dOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOVBUMGdaR1ZtWVhWc2RFTnNaV0Z5VkdsdFpXOTFkQ0I4ZkNBaFkyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMEtTQW1KaUJqYkdWaGNsUnBiV1Z2ZFhRcElIdGNiaUFnSUNBZ0lDQWdZMkZqYUdWa1EyeGxZWEpVYVcxbGIzVjBJRDBnWTJ4bFlYSlVhVzFsYjNWME8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1kyeGxZWEpVYVcxbGIzVjBLRzFoY210bGNpazdYRzRnSUNBZ2ZWeHVJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJQzh2SUhkb1pXNGdkMmhsYmlCemIyMWxZbTlrZVNCb1lYTWdjMk55WlhkbFpDQjNhWFJvSUhObGRGUnBiV1Z2ZFhRZ1luVjBJRzV2SUVrdVJTNGdiV0ZrWkc1bGMzTmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHTmhZMmhsWkVOc1pXRnlWR2x0Wlc5MWRDaHRZWEpyWlhJcE8xeHVJQ0FnSUgwZ1kyRjBZMmdnS0dVcGUxeHVJQ0FnSUNBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVjJobGJpQjNaU0JoY21VZ2FXNGdTUzVGTGlCaWRYUWdkR2hsSUhOamNtbHdkQ0JvWVhNZ1ltVmxiaUJsZG1Gc1pXUWdjMjhnU1M1RkxpQmtiMlZ6YmlkMElDQjBjblZ6ZENCMGFHVWdaMnh2WW1Gc0lHOWlhbVZqZENCM2FHVnVJR05oYkd4bFpDQnViM0p0WVd4c2VWeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR05oWTJobFpFTnNaV0Z5VkdsdFpXOTFkQzVqWVd4c0tHNTFiR3dzSUcxaGNtdGxjaWs3WEc0Z0lDQWdJQ0FnSUgwZ1kyRjBZMmdnS0dVcGUxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2MyRnRaU0JoY3lCaFltOTJaU0JpZFhRZ2QyaGxiaUJwZENkeklHRWdkbVZ5YzJsdmJpQnZaaUJKTGtVdUlIUm9ZWFFnYlhWemRDQm9ZWFpsSUhSb1pTQm5iRzlpWVd3Z2IySnFaV04wSUdadmNpQW5kR2hwY3ljc0lHaHZjR1oxYkd4NUlHOTFjaUJqYjI1MFpYaDBJR052Y25KbFkzUWdiM1JvWlhKM2FYTmxJR2wwSUhkcGJHd2dkR2h5YjNjZ1lTQm5iRzlpWVd3Z1pYSnliM0l1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJUYjIxbElIWmxjbk5wYjI1eklHOW1JRWt1UlM0Z2FHRjJaU0JrYVdabVpYSmxiblFnY25Wc1pYTWdabTl5SUdOc1pXRnlWR2x0Wlc5MWRDQjJjeUJ6WlhSVWFXMWxiM1YwWEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1kyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMExtTmhiR3dvZEdocGN5d2diV0Z5YTJWeUtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1WEc1Y2JuMWNiblpoY2lCeGRXVjFaU0E5SUZ0ZE8xeHVkbUZ5SUdSeVlXbHVhVzVuSUQwZ1ptRnNjMlU3WEc1MllYSWdZM1Z5Y21WdWRGRjFaWFZsTzF4dWRtRnlJSEYxWlhWbFNXNWtaWGdnUFNBdE1UdGNibHh1Wm5WdVkzUnBiMjRnWTJ4bFlXNVZjRTVsZUhSVWFXTnJLQ2tnZTF4dUlDQWdJR2xtSUNnaFpISmhhVzVwYm1jZ2ZId2dJV04xY25KbGJuUlJkV1YxWlNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnZlZ4dUlDQWdJR1J5WVdsdWFXNW5JRDBnWm1Gc2MyVTdYRzRnSUNBZ2FXWWdLR04xY25KbGJuUlJkV1YxWlM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ2NYVmxkV1VnUFNCamRYSnlaVzUwVVhWbGRXVXVZMjl1WTJGMEtIRjFaWFZsS1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0J4ZFdWMVpVbHVaR1Y0SUQwZ0xURTdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaHhkV1YxWlM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ1pISmhhVzVSZFdWMVpTZ3BPMXh1SUNBZ0lIMWNibjFjYmx4dVpuVnVZM1JwYjI0Z1pISmhhVzVSZFdWMVpTZ3BJSHRjYmlBZ0lDQnBaaUFvWkhKaGFXNXBibWNwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmlBZ0lDQjJZWElnZEdsdFpXOTFkQ0E5SUhKMWJsUnBiV1Z2ZFhRb1kyeGxZVzVWY0U1bGVIUlVhV05yS1R0Y2JpQWdJQ0JrY21GcGJtbHVaeUE5SUhSeWRXVTdYRzVjYmlBZ0lDQjJZWElnYkdWdUlEMGdjWFZsZFdVdWJHVnVaM1JvTzF4dUlDQWdJSGRvYVd4bEtHeGxiaWtnZTF4dUlDQWdJQ0FnSUNCamRYSnlaVzUwVVhWbGRXVWdQU0J4ZFdWMVpUdGNiaUFnSUNBZ0lDQWdjWFZsZFdVZ1BTQmJYVHRjYmlBZ0lDQWdJQ0FnZDJocGJHVWdLQ3NyY1hWbGRXVkpibVJsZUNBOElHeGxiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dOMWNuSmxiblJSZFdWMVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR04xY25KbGJuUlJkV1YxWlZ0eGRXVjFaVWx1WkdWNFhTNXlkVzRvS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCeGRXVjFaVWx1WkdWNElEMGdMVEU3WEc0Z0lDQWdJQ0FnSUd4bGJpQTlJSEYxWlhWbExteGxibWQwYUR0Y2JpQWdJQ0I5WEc0Z0lDQWdZM1Z5Y21WdWRGRjFaWFZsSUQwZ2JuVnNiRHRjYmlBZ0lDQmtjbUZwYm1sdVp5QTlJR1poYkhObE8xeHVJQ0FnSUhKMWJrTnNaV0Z5VkdsdFpXOTFkQ2gwYVcxbGIzVjBLVHRjYm4xY2JseHVjSEp2WTJWemN5NXVaWGgwVkdsamF5QTlJR1oxYm1OMGFXOXVJQ2htZFc0cElIdGNiaUFnSUNCMllYSWdZWEpuY3lBOUlHNWxkeUJCY25KaGVTaGhjbWQxYldWdWRITXViR1Z1WjNSb0lDMGdNU2s3WEc0Z0lDQWdhV1lnS0dGeVozVnRaVzUwY3k1c1pXNW5kR2dnUGlBeEtTQjdYRzRnSUNBZ0lDQWdJR1p2Y2lBb2RtRnlJR2tnUFNBeE95QnBJRHdnWVhKbmRXMWxiblJ6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCaGNtZHpXMmtnTFNBeFhTQTlJR0Z5WjNWdFpXNTBjMXRwWFR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0J4ZFdWMVpTNXdkWE5vS0c1bGR5QkpkR1Z0S0daMWJpd2dZWEpuY3lrcE8xeHVJQ0FnSUdsbUlDaHhkV1YxWlM1c1pXNW5kR2dnUFQwOUlERWdKaVlnSVdSeVlXbHVhVzVuS1NCN1hHNGdJQ0FnSUNBZ0lISjFibFJwYldWdmRYUW9aSEpoYVc1UmRXVjFaU2s3WEc0Z0lDQWdmVnh1ZlR0Y2JseHVMeThnZGpnZ2JHbHJaWE1nY0hKbFpHbGpkR2xpYkdVZ2IySnFaV04wYzF4dVpuVnVZM1JwYjI0Z1NYUmxiU2htZFc0c0lHRnljbUY1S1NCN1hHNGdJQ0FnZEdocGN5NW1kVzRnUFNCbWRXNDdYRzRnSUNBZ2RHaHBjeTVoY25KaGVTQTlJR0Z5Y21GNU8xeHVmVnh1U1hSbGJTNXdjbTkwYjNSNWNHVXVjblZ1SUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11Wm5WdUxtRndjR3g1S0c1MWJHd3NJSFJvYVhNdVlYSnlZWGtwTzF4dWZUdGNibkJ5YjJObGMzTXVkR2wwYkdVZ1BTQW5Zbkp2ZDNObGNpYzdYRzV3Y205alpYTnpMbUp5YjNkelpYSWdQU0IwY25WbE8xeHVjSEp2WTJWemN5NWxibllnUFNCN2ZUdGNibkJ5YjJObGMzTXVZWEpuZGlBOUlGdGRPMXh1Y0hKdlkyVnpjeTUyWlhKemFXOXVJRDBnSnljN0lDOHZJR1Z0Y0hSNUlITjBjbWx1WnlCMGJ5QmhkbTlwWkNCeVpXZGxlSEFnYVhOemRXVnpYRzV3Y205alpYTnpMblpsY25OcGIyNXpJRDBnZTMwN1hHNWNibVoxYm1OMGFXOXVJRzV2YjNBb0tTQjdmVnh1WEc1d2NtOWpaWE56TG05dUlEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdVlXUmtUR2x6ZEdWdVpYSWdQU0J1YjI5d08xeHVjSEp2WTJWemN5NXZibU5sSUQwZ2JtOXZjRHRjYm5CeWIyTmxjM011YjJabUlEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdWNtVnRiM1psVEdsemRHVnVaWElnUFNCdWIyOXdPMXh1Y0hKdlkyVnpjeTV5WlcxdmRtVkJiR3hNYVhOMFpXNWxjbk1nUFNCdWIyOXdPMXh1Y0hKdlkyVnpjeTVsYldsMElEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdWNISmxjR1Z1WkV4cGMzUmxibVZ5SUQwZ2JtOXZjRHRjYm5CeWIyTmxjM011Y0hKbGNHVnVaRTl1WTJWTWFYTjBaVzVsY2lBOUlHNXZiM0E3WEc1Y2JuQnliMk5sYzNNdWJHbHpkR1Z1WlhKeklEMGdablZ1WTNScGIyNGdLRzVoYldVcElIc2djbVYwZFhKdUlGdGRJSDFjYmx4dWNISnZZMlZ6Y3k1aWFXNWthVzVuSUQwZ1puVnVZM1JwYjI0Z0tHNWhiV1VwSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KM0J5YjJObGMzTXVZbWx1WkdsdVp5QnBjeUJ1YjNRZ2MzVndjRzl5ZEdWa0p5azdYRzU5TzF4dVhHNXdjbTlqWlhOekxtTjNaQ0E5SUdaMWJtTjBhVzl1SUNncElIc2djbVYwZFhKdUlDY3ZKeUI5TzF4dWNISnZZMlZ6Y3k1amFHUnBjaUE5SUdaMWJtTjBhVzl1SUNoa2FYSXBJSHRjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0ozQnliMk5sYzNNdVkyaGthWElnYVhNZ2JtOTBJSE4xY0hCdmNuUmxaQ2NwTzF4dWZUdGNibkJ5YjJObGMzTXVkVzFoYzJzZ1BTQm1kVzVqZEdsdmJpZ3BJSHNnY21WMGRYSnVJREE3SUgwN1hHNGlMQ0l2THlCRVQwMGdRVkJKY3l3Z1ptOXlJR052YlhCc1pYUmxibVZ6YzF4dVhHNXBaaUFvZEhsd1pXOW1JSE5sZEZScGJXVnZkWFFnSVQwOUlDZDFibVJsWm1sdVpXUW5LU0JsZUhCdmNuUnpMbk5sZEZScGJXVnZkWFFnUFNCbWRXNWpkR2x2YmlncElIc2djbVYwZFhKdUlITmxkRlJwYldWdmRYUXVZWEJ3Ykhrb2QybHVaRzkzTENCaGNtZDFiV1Z1ZEhNcE95QjlPMXh1YVdZZ0tIUjVjR1Z2WmlCamJHVmhjbFJwYldWdmRYUWdJVDA5SUNkMWJtUmxabWx1WldRbktTQmxlSEJ2Y25SekxtTnNaV0Z5VkdsdFpXOTFkQ0E5SUdaMWJtTjBhVzl1S0NrZ2V5QmpiR1ZoY2xScGJXVnZkWFF1WVhCd2JIa29kMmx1Wkc5M0xDQmhjbWQxYldWdWRITXBPeUI5TzF4dWFXWWdLSFI1Y0dWdlppQnpaWFJKYm5SbGNuWmhiQ0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY3BJR1Y0Y0c5eWRITXVjMlYwU1c1MFpYSjJZV3dnUFNCbWRXNWpkR2x2YmlncElIc2djbVYwZFhKdUlITmxkRWx1ZEdWeWRtRnNMbUZ3Y0d4NUtIZHBibVJ2ZHl3Z1lYSm5kVzFsYm5SektUc2dmVHRjYm1sbUlDaDBlWEJsYjJZZ1kyeGxZWEpKYm5SbGNuWmhiQ0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY3BJR1Y0Y0c5eWRITXVZMnhsWVhKSmJuUmxjblpoYkNBOUlHWjFibU4wYVc5dUtDa2dleUJqYkdWaGNrbHVkR1Z5ZG1Gc0xtRndjR3g1S0hkcGJtUnZkeXdnWVhKbmRXMWxiblJ6S1RzZ2ZUdGNibHh1THk4Z1ZFOUVUem9nUTJoaGJtZGxJSFJ2SUcxdmNtVWdaV1ptYVdWamFXVnVkQ0JzYVhOMElHRndjSEp2WVdOb0lIVnpaV1FnYVc0Z1RtOWtaUzVxYzF4dUx5OGdSbTl5SUc1dmR5d2dkMlVnYW5WemRDQnBiWEJzWlcxbGJuUWdkR2hsSUVGUVNYTWdkWE5wYm1jZ2RHaGxJSEJ5YVcxcGRHbDJaWE1nWVdKdmRtVXVYRzVjYm1WNGNHOXlkSE11Wlc1eWIyeHNJRDBnWm5WdVkzUnBiMjRvYVhSbGJTd2daR1ZzWVhrcElIdGNiaUFnYVhSbGJTNWZkR2x0Wlc5MWRFbEVJRDBnYzJWMFZHbHRaVzkxZENocGRHVnRMbDl2YmxScGJXVnZkWFFzSUdSbGJHRjVLVHRjYm4wN1hHNWNibVY0Y0c5eWRITXVkVzVsYm5KdmJHd2dQU0JtZFc1amRHbHZiaWhwZEdWdEtTQjdYRzRnSUdOc1pXRnlWR2x0Wlc5MWRDaHBkR1Z0TGw5MGFXMWxiM1YwU1VRcE8xeHVmVHRjYmx4dVpYaHdiM0owY3k1aFkzUnBkbVVnUFNCbWRXNWpkR2x2YmlocGRHVnRLU0I3WEc0Z0lDOHZJRzkxY2lCdVlXbDJaU0JwYlhCc0lHUnZaWE51SjNRZ1kyRnlaU0FvWTI5eWNtVmpkRzVsYzNNZ2FYTWdjM1JwYkd3Z2NISmxjMlZ5ZG1Wa0tWeHVmVHRjYmx4dVpYaHdiM0owY3k1elpYUkpiVzFsWkdsaGRHVWdQU0J5WlhGMWFYSmxLQ2R3Y205alpYTnpMMkp5YjNkelpYSXVhbk1uS1M1dVpYaDBWR2xqYXp0Y2JpSXNJaTh2SUhOb2FXMGdabTl5SUhWemFXNW5JSEJ5YjJObGMzTWdhVzRnWW5KdmQzTmxjbHh1WEc1MllYSWdjSEp2WTJWemN5QTlJRzF2WkhWc1pTNWxlSEJ2Y25SeklEMGdlMzA3WEc1Y2JuQnliMk5sYzNNdWJtVjRkRlJwWTJzZ1BTQW9ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCallXNVRaWFJKYlcxbFpHbGhkR1VnUFNCMGVYQmxiMllnZDJsdVpHOTNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0oxeHVJQ0FnSUNZbUlIZHBibVJ2ZHk1elpYUkpiVzFsWkdsaGRHVTdYRzRnSUNBZ2RtRnlJR05oYmxCdmMzUWdQU0IwZVhCbGIyWWdkMmx1Wkc5M0lDRTlQU0FuZFc1a1pXWnBibVZrSjF4dUlDQWdJQ1ltSUhkcGJtUnZkeTV3YjNOMFRXVnpjMkZuWlNBbUppQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2x4dUlDQWdJRHRjYmx4dUlDQWdJR2xtSUNoallXNVRaWFJKYlcxbFpHbGhkR1VwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaMWJtTjBhVzl1SUNobUtTQjdJSEpsZEhWeWJpQjNhVzVrYjNjdWMyVjBTVzF0WldScFlYUmxLR1lwSUgwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tHTmhibEJ2YzNRcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUhGMVpYVmxJRDBnVzEwN1hHNGdJQ0FnSUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkdFpYTnpZV2RsSnl3Z1puVnVZM1JwYjI0Z0tHVjJLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnYzI5MWNtTmxJRDBnWlhZdWMyOTFjbU5sTzF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0NoemIzVnlZMlVnUFQwOUlIZHBibVJ2ZHlCOGZDQnpiM1Z5WTJVZ1BUMDlJRzUxYkd3cElDWW1JR1YyTG1SaGRHRWdQVDA5SUNkd2NtOWpaWE56TFhScFkyc25LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWlhZdWMzUnZjRkJ5YjNCaFoyRjBhVzl1S0NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSEYxWlhWbExteGxibWQwYUNBK0lEQXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJR1p1SUQwZ2NYVmxkV1V1YzJocFpuUW9LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ptNG9LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDBzSUhSeWRXVXBPMXh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtZFc1amRHbHZiaUJ1WlhoMFZHbGpheWhtYmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY1hWbGRXVXVjSFZ6YUNobWJpazdYRzRnSUNBZ0lDQWdJQ0FnSUNCM2FXNWtiM2N1Y0c5emRFMWxjM05oWjJVb0ozQnliMk5sYzNNdGRHbGpheWNzSUNjcUp5azdYRzRnSUNBZ0lDQWdJSDA3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlHNWxlSFJVYVdOcktHWnVLU0I3WEc0Z0lDQWdJQ0FnSUhObGRGUnBiV1Z2ZFhRb1ptNHNJREFwTzF4dUlDQWdJSDA3WEc1OUtTZ3BPMXh1WEc1d2NtOWpaWE56TG5ScGRHeGxJRDBnSjJKeWIzZHpaWEluTzF4dWNISnZZMlZ6Y3k1aWNtOTNjMlZ5SUQwZ2RISjFaVHRjYm5CeWIyTmxjM011Wlc1MklEMGdlMzA3WEc1d2NtOWpaWE56TG1GeVozWWdQU0JiWFR0Y2JseHVjSEp2WTJWemN5NWlhVzVrYVc1bklEMGdablZ1WTNScGIyNGdLRzVoYldVcElIdGNiaUFnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjNCeWIyTmxjM011WW1sdVpHbHVaeUJwY3lCdWIzUWdjM1Z3Y0c5eWRHVmtKeWs3WEc1OVhHNWNiaTh2SUZSUFJFOG9jMmgwZVd4dFlXNHBYRzV3Y205alpYTnpMbU4zWkNBOUlHWjFibU4wYVc5dUlDZ3BJSHNnY21WMGRYSnVJQ2N2SnlCOU8xeHVjSEp2WTJWemN5NWphR1JwY2lBOUlHWjFibU4wYVc5dUlDaGthWElwSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KM0J5YjJObGMzTXVZMmhrYVhJZ2FYTWdibTkwSUhOMWNIQnZjblJsWkNjcE8xeHVmVHRjYmlKZGZRPT0ifQ==
