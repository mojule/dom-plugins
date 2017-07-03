'use strict'

const parentElement = ({ api, core }) => {
  core.registerProperty({
    target: api,
    name: 'parentElement',
    get: () => {
      const parent = api.parentNode

      return parent && parent.isElementNode() ? parent : null
    }
  })
}

module.exports = parentElement
