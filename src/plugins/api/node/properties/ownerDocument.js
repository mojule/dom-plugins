'use strict'

const ownerDocument = ({ api, state, privates }) => {
  privates.registerGet({
    target: api,
    name: 'ownerDocument',
    get: () => {
      if( state.value.document )
        return state.value.document

      return api.ancestorNodes.find( current => current.isDocument() )
    }
  })
}

module.exports = ownerDocument
