'use strict'

const isSameNode = ({ api, state, core }) => {
  api.isSameNode = node => node === core.getApi( state )
}

module.exports = isSameNode
