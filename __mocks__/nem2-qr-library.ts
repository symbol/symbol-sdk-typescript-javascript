'use strict'

const toBase64Mock = function() {
  return ''
}

export const MnemonicQR = jest.fn().mockImplementation(function() {
  return {toBase64: toBase64Mock };
});