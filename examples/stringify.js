'use strict'

const domPlugins = require( '../src' )
const { Factory } = require( '@mojule/tree' )

const Tree = Factory( domPlugins )

const backpack = Tree({
  nodeType: 'backpack',
  attributes: {
    class: 'container cloth',
    weight: 1
  }
})

const lunchbox = Tree({
  nodeType: 'lunchbox',
  attributes: {
    class: 'container plastic',
    weight: 0.3
  }
})

const apple = Tree({
  nodeType: 'apple',
  attributes: {
    class: 'food fruit',
    weight: 0.85
  }
})

const pamphlet = Tree({
  nodeType: 'pamphlet',
  attributes: {
    class: 'paper',
    weight: 0.05
  }
})

const message = Tree.createText( 'Only you can save humanity' )

lunchbox.add( apple )
pamphlet.add( message )
backpack.add( lunchbox )
backpack.add( pamphlet )

console.log( backpack.stringify() )
