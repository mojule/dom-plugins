'use strict'

const domPlugins = require( '../src' )
const { Factory } = require( '@mojule/tree' )

const Tree = Factory( domPlugins )

const markup = `
  <backpack class="container cloth" weight="1">
    <lunchbox class="container plastic" weight="0.3">
      <apple class="food fruit" weight="0.85"></apple>
      <apple class="food fruit" weight="0.7"></apple>
    </lunchbox>
    <pamphlet class="paper" weight="0.05">Only you can save humanity</pamphlet>
  </backpack>`

const backpack = Tree.parse( markup, { removeWhitespace: true } )

const containers = []

// like in the browser DOM, querySelectorAll doesn't match the current element
if( backpack.matches( '.container' ) )
  containers.push( backpack )

containers.push( ...backpack.querySelectorAll( '.container' ) )

/*
  let's put the backpack in a document container so we don't have to use
  matches + querySelectorAll to include it in the query
*/

const doc = Tree.createDocument()

doc.add( backpack )

const weights = doc.querySelectorAll( '[weight]' )
const apples = doc.querySelectorAll( 'apple' )

const addWeight = ( sum, obj ) => sum + Number( obj.attr( 'weight' ) )

const containerWeight = containers.reduce( addWeight, 0 )
const totalWeight = weights.reduce( addWeight, 0 )
const applesWeight = apples.reduce( addWeight, 0 )
const exludingContainers = totalWeight - containerWeight

// non-standard :contains selector matches text nodes
const human = doc.querySelector( '.paper:contains(human)' )
// no match
const animal = doc.querySelector( '.paper:contains(animal)' )

console.log(
  `Total weight ${ totalWeight.toFixed( 2 ) }kg`
)

console.log(
  `Weight exluding containers ${ exludingContainers.toFixed( 2 ) }kg`
)

console.log(
  `You have ${ applesWeight.toFixed( 2 ) }kg of apples`
)

if( human ){
  console.log( 'You have a piece of paper about humans' )
} else {
  console.log( 'No paper mentioning humans was found' )
}

if( animal ){
  console.log( 'You have a piece of paper about animals' )
} else {
  console.log( 'No paper mentioning animals was found' )
}
