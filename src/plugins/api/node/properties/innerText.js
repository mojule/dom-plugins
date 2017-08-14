'use strict'

const innerText = ({ api, core, Api }) => {
  // they're not actually the same - whitespace is different - consider fixing
  core.registerProperty({
    target: api,
    name: 'innerText',
    get: () => api.textContent,
    set: value => api.textContent = value
  })
}

module.exports = innerText
