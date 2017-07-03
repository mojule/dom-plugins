'use strict'

const ownerDocument = ({ api, state, core }) => {
  core.registerProperty({
    target: api,
    name: 'ownerDocument',
    get: () => {
      if( state.value.document )
        return state.value.document

      return api.ancestorNodes.find( current => current.isDocumentNode() )
    }
  })
}

module.exports = ownerDocument
