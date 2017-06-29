'use strict'

const innerText = ({ api, privates, Api }) => {
  // they're not actually the same - whitespace is different - consider fixing
  privates.registerProperty({
    target: api,
    name: 'innerText',
    get: () => api.textContent,
    set: value => api.textContent = value
  })
}

module.exports = innerText
