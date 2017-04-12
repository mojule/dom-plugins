# DOM plugins

A set of plugins for mojule tree that lets you treat any tree as a DOM, allowing
you to do interesting things like run query selectors over your tree even if
the nodes don't represent HTML elements.

## Install

`npm install @mojule/dom-plugins`

## Examples

### Tree to markup

```javascript
const domPlugins = require( '@mojule/dom-plugins' )
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

const markup = backpack.stringify()

console.log( markup )
```

```html
<backpack class="container cloth" weight="1">
  <lunchbox class="container plastic" weight="0.3">
    <apple class="food fruit" weight="0.85"></apple>
  </lunchbox>
  <pamphlet class="paper" weight="0.05">Only you can save humanity</pamphlet>
</backpack>
```

### Parser

```javascript
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
```

```
 backpack
   lunchbox
     apple
   pamphlet
     #text
```

### Query selectors

```javascript
const domPlugins = require( '@mojule/dom-plugins' )
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

/*
  Like the browser dom, all attributes are converted to strings, so we have to
  convert it back to a number

  You could also access the underlying number with:
  const attributes = obj.getValue( 'attributes' )
  const weight = attributes.weight
*/
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
```

```
Total weight 2.90kg
Weight exluding containers 1.60kg
You have 1.55kg of apples
You have a piece of paper about humans
No paper mentioning animals was found
```

## Plugins Reference

This section describes the default plugins that enable querying, parsing and
stringifying arbitrary tree structures. They really shine when you write custom
plugins that override the defaults to better match the type of data you have and
your desired use cases, but will work fine out of the box.

### attributes

Allows you to get and set attributes on a node in a similar manner to the
browser DOM eg attributes are like an object where all of the properties are
strings.

By default, the plugins look for a property called `attributes` on the node's
value object.  Alternatively you can have the value object itself treated as
the attributes, see `valueToAttributes` and `attributesToValue` below.

#### attributes

Gets or sets the node's attribute object. Calls `setAttributes`/`getAttributes`
under the hood.

```javascript
node.attributes({ id: 'myNode' })

// { id: 'myNode' }
console.log( node.attributes() )
```

#### getAttributes

Gets the node's attributes. If the node value does not contain a property
called attributes, an empty object will be returned.

```javascript
const node = Tree( { name: 'Nik' } )

// {}
console.log( node.attributes() )

const node2 = Tree( { attributes: { id: 'myNode' } } )

// { id: 'myNode' }
console.log( node2.attributes )
```

#### setAttributes

Sets the node's attributes. Note that setAttributes extends or override the
current attributes rather than removing them all and setting them to the new
value. You can do the latter using `clearAttrs` followed by `setAttributes`.

In the default implementation, if your node's value object does not current
have an `attributes` property it will be added.

```javascript
const node = Tree( { name: 'Nik' } )

node.setAttributes( { id: 'myNode' } )

// { id: 'myNode' }
console.log( node.attributes() )

node.setAttributes( { name: node.getValue( 'name' ) } )

// { id: 'myNode', name: 'Nik' }
console.log( node.attributes() )

node.setAttributes( { id: 'namedNode' } )

// { id: 'namedNode', name: 'Nik' }
console.log( node.attributes() )
```

#### attr

Get or set the named attribute. Calls `getAttr`/`setAttr` under the hood.

```javascript
node.attr( 'name', 'Nik' )

// 'Nik'
console.log( node.attr( 'name' ) )
```

#### getAttr

Get the named attribute. Returns `undefined` if it does not exist. Calls
`getAttributes` under the hood.

```javascript
node.attr( 'name', 'Nik' )

// 'Nik'
console.log( node.getAttr( 'name' ) )
```

#### setAttr

Set the named attribute

```javascript
node.setAttr( 'name', 'Nik' )

// 'Nik'
console.log( node.getAttr( 'name' ) )
```

#### hasAttr

Returns boolean true if the named attribute exists

```javascript
node.attr( 'name', 'Nik' )

// true
console.log( node.hasAttr( 'name' ) )
```

#### removeAttr

Removes the named attribute

```javascript
node.attr( 'name', 'Nik' )
node.removeAttr( 'name' )

// false
console.log( node.hasAttr( 'name' ) )
```

#### clearAttrs

Removes all attributes

```javascript
node.attr( 'name', 'Nik' )

node.clearAttrs()

// {}
console.log( node.attributes() )
```

#### valueToAttributes

A helper function that can be used to back a custom `getAttributes` plugin.

Takes the node's value object, [flattens](https://github.com/mojule/flatten) it
and converts the keys to be suitable for use in attributes, by replacing `.`
with `_` and indices like `[0]` with `-0`.

We do not currently handle cases where keys already contain the `_` or `-`
characters, so this behaviour is undefined. In addition, the flatten package
does not currently handle cases where the key contains `.`, `[` or `]`, so the
behaviour is also undefined in these cases.

```javascript
const node = Tree({
  nodeType: 'something',
  foo: 'hello',
  num: 42,
  bar: {
    a: [ 'b', 'c', { d: 'e', f: 3 } ]
  }
})

console.log( node.valueToAttributes() )
```

```json
{
  "nodeType": "something",
  "foo": "hello",
  "num": "42",
  "bar_a-0": "b",
  "bar_a-1": "c",
  "bar_a-2_d": "e",
  "bar_a-2_f": "3"
}
```

#### attributesToValue

### classes

#### classNames
#### addClass
#### hasClass
#### addClasses
#### removeClass
#### toggleClass
#### clearClasses

### createNodes

#### createText
#### createComment
#### createDocumentFragment
#### createDocumentType
#### createDocument
#### createElement

### dataset

#### getDataset
#### setDataset
#### dataset

### getText

### isEmpty

### isType

#### isText
#### isComment
#### isDocumentFragment
#### isDocumentType
#### isDocument
#### isElement

### name

#### tagName
#### nodeName

### nodeValue

#### getNodeValue
#### setNodeValue
#### nodeValue

### parser



### select

querySelector
querySelectorAll
matches

### stringify

### treeType
