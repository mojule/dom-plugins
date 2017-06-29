'use strict'

const nodeValue = ({ api, state, privates }) => {
  privates.registerProperty({
    target: api,
    name: 'nodeValue',
    get: () => state.value.nodeValue,
    set: value => state.value.nodeValue = value
  })
}

module.exports = nodeValue
