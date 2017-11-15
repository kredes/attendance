function leftPad(str, len, ch) {
	str = str + '';

	len = len - str.length;
	if (len <= 0) return str;

	if (!ch && ch !== 0) ch = ' ';
	ch = ch + '';

	return ch.repeat(len) + str;
};

var web3 = typeof web3 !== 'undefined' ? web3 : new Web3()

// the size of a character in a hex string in bytes
const HEX_CHAR_SIZE = 4

// the size to hash an integer if not explicity provided
const DEFAULT_SIZE = 256

/** Encodes a value in hex and adds padding to the given size if needed. Tries to determine whether it should be encoded as a number or string. Curried args. */
const encodeWithPadding = size => value => {
  return typeof value === 'string'
    // non-hex string
    ? web3.toHex(value)
    // numbers, big numbers, and hex strings
    : encodeNum(size)(value)
}

/** Encodes a number in hex and adds padding to the given size if needed. Curried args. */
const encodeNum = size => value => {
  return leftPad(web3.toHex(value < 0 ? value >>> 0 : value).slice(2), size / HEX_CHAR_SIZE, value < 0 ? 'F' : '0')
}

/** Hashes a single value at the given size. */
const sha3withsize = (value, size) => {
  const paddedArgs = encodeWithPadding(size)(value)
  return web3.sha3(paddedArgs, { encoding: 'hex' })
}

const sha3num = (value, size = DEFAULT_SIZE) => {
  const paddedArgs = encodeNum(size)(value)
  return web3.sha3(paddedArgs, { encoding: 'hex' })
}