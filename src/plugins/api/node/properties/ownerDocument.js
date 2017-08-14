'use strict'

const ownerDocument = ({ api, state, core }) => {
  core.registerProperty({
    target: api,
    name: 'ownerDocument',
    get: () => api.ancestorNodes.find( current => current.isDocumentNode() )
  })
}

module.exports = ownerDocument
