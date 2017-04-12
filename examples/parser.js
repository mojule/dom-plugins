'use strict'

const domPlugins = require( '../src' )
const { Factory } = require( '@mojule/tree' )

const Tree = Factory( domPlugins )

const markup = `
  <backpack class="container cloth" weight="1">
    <lunchbox class="container plastic" weight="0.3">
      <apple class="food fruit" weight="0.85"></apple>
    </lunchbox>
    <pamphlet class="paper" weight="0.05">Only you can save humanity</pamphlet>
  </backpack>`

const doc = Tree.parse( markup, { removeWhitespace: true } )

doc.walk( ( current, parent, depth ) => {
  console.log( '  '.repeat( depth ), current.nodeName() )
})
