'use strict'

const lib = {}

const toBase64Mock = function() {
  return ''
}

lib.MnemonicQR = jest.fn().mockImplementation(function() {
  return {toBase64: toBase64Mock };
});

module.exports = lib