'use strict'

const baseURI = ({ api, privates }) => {
  privates.registerGet({
    target: api,
    name: 'baseURI',
    get: () => '/'
  })
}

module.exports = baseURI
