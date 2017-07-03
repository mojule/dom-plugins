'use strict'

const baseURI = ({ api, core }) => {
  core.registerProperty({
    target: api,
    name: 'baseURI',
    get: () => '/'
  })
}

module.exports = baseURI
