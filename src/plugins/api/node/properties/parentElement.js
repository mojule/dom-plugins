'use strict'

const parentElement = ({ api, privates }) => {
  privates.registerGet({
    target: api,
    name: 'parentElement',
    get: () => {
      const parent = api.parentNode

      return parent && parent.isElement() ? parent : null
    }
  })
}

module.exports = parentElement
