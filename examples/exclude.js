'use strict'

const html = require( '@mojule/html' )
const { Factory } = require( '@mojule/tree' )
const domPlugins = require( '../src' )
const doc = require( './excludeDoc' )

const isInline = node => {
  return {
    isInline: () => html.isInline( node.tagName() )
  }
}

const Tree = Factory( domPlugins.concat( isInline ) )

const tree = Tree.parse( doc, {
  removeWhitespace: true,
  trimText: true,
  xmlMode: false
})

console.log( tree.stringify() )

console.log( tree.stringify( { pretty: true } ) )