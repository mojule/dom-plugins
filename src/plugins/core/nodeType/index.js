'use strict'

const is = require( '@mojule/is' )
const { escapeHtml } = require( '@mojule/utils' )

const createNodeValue = nodeValue => ({ nodeValue: escapeHtml( nodeValue ) })

const nodeType = ({ core }) => {
  core.registerNodeType({
    nodeType: 1,
    name: 'element',
    // if it's a registered element isEmpty and accepts will be overridden
    isEmpty: () => false,
    accepts: ( parent, child ) => true,
    create: ( tagName, attributes = {} ) => ({ tagName, attributes })
  })

  core.registerNodeType({
    nodeType: 3,
    name: 'text',
    isEmpty: () => true,
    create: createNodeValue
  })

  core.registerNodeType({
    nodeType: 7,
    name: 'processing-instruction',
    isEmpty: () => true,
    create: ( target, data ) =>
      ({ target: escapeHtml( target ), data: escapeHtml( data ) })
  })

  core.registerNodeType({
    nodeType: 8,
    name: 'comment',
    isEmpty: () => true,
    create: createNodeValue
  })

  core.registerNodeType({
    nodeType: 9,
    name: 'document',
    isEmpty: () => false,
    // todo
    accepts: ( parent, child ) => true,
    create: ( namespaceURI, qualifiedNameStr, documentType ) => {
      // todo
      return { namespaceURI, qualifiedNameStr, documentType }
    }
  })

  core.registerNodeType({
    nodeType: 10,
    name: 'document-type',
    isEmpty: () => true,
    create: ( name, publicId = '', systemId = '' ) =>
      ({ name, publicId, systemId })
  })

  core.registerNodeType({
    nodeType: 11,
    name: 'document-fragment',
    isEmpty: () => false,
    accepts: ( parent, child ) => true,
    create: () => ({})
  })
}

module.exports = nodeType
