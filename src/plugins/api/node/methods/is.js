'use strict'

const nameToNodeType = {
  'Element': 1,
  'Text': 3,
  'ProcessingInstruction': 7,
  'Comment': 8,
  'Document': 9,
  'DocumentType': 10,
  'DocumentFragment': 11
}

const nodeTypeNames = Object.keys( nameToNodeType )

const nodeTypeToName = nodeTypeNames.reduce( ( obj, name ) => {
  const nodeType = nameToNodeType[ name ]

  obj[ nodeType ] = name

  return obj
}, {})

const is = ({ api, state }) => {
  nodeTypeNames.forEach( name => {
    const fname = 'is' + name

    api[ fname ] = () => state.value.nodeType === nameToNodeType[ name ]
  })
}

module.exports = is
