'use strict'

/*
  if( api.isElement() ) return 1
  if( api.isText() ) return 3
  if( api.isProcessingInstruction() ) return 7
  if( api.isComment() ) return 8
  if( api.isDocument() ) return 9
  if( api.isDocumentType() ) return 10
  if( api.isDocumentFragment() ) return 11
*/

const nodeType = ({ api, state, privates }) => {
  privates.registerGet({
    target: api,
    name: 'nodeType',
    get: () => state.value.nodeType
  })
}

module.exports = nodeType
