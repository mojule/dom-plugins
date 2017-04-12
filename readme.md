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

A static helper function that can be used to back a custom `getAttributes` 
plugin.

Takes a node value object, [flattens](https://github.com/mojule/flatten) it,
converts the keys to be suitable for use in attributes, by replacing `.` with 
`_` and indices like `[0]` with `-0`, and if the value is not a string, appends
a suffix indicating the type, like `-number`.

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

const value = node.getValue()

console.log( Tree.valueToAttributes( value ) )
```

```json
{
  "nodeType": "something",
  "foo": "hello",
  "num-number": "42",
  "bar_a-0": "b",
  "bar_a-1": "c",
  "bar_a-2_d": "e",
  "bar_a-2_f-number": "3"
}
```

#### attributesToValue

Converts an attributes value created by `valueToAttributes` back to a node 
value. 

```javascript
const attributes = {
  nodeType: 'something',
  foo: 'hello',
  'num-number': '42',
  'bar_a-0': 'b',
  'bar_a-1': 'c',
  'bar_a-2_d': 'e',
  'bar_a-2_f-number': '3'
}

console.log( Tree.attributesToValue( attributes ) )
```

```json
{
  "nodeType": "something",
  "foo": "hello",
  "num": "42",
  "bar": {
    "a": [ "b", "c", { "d": "e", "f": "3" } ]
  }
}
```

### classes

Various plugins for working with a node's classes. Like the browser DOM, these
are expected to be a space separated list of classnames stored in the `class`
property of the attribute object. Override the plugins for custom behaviour.

#### classNames

Gets an array of class name strings

```javascript
const node = Tree({
  attributes: {
    class: 'one two three'
  }
})

// [ 'one', 'two', 'three' ]
console.log( node.classNames() )
```

#### addClass

Adds a class to the classNames list

```javascript
const node = Tree({
  attributes: {
    class: 'one two three'
  }
})

node.addClass( 'four' )

// [ 'one', 'two', 'three', 'four' ]
console.log( node.classNames() )
```

#### hasClass

Returns a boolean indicating if the node has the named class

```javascript
const node = Tree({
  attributes: {
    class: 'one two three'
  }
})

// true
console.log( node.hasClass( 'one' ) )
```

#### addClasses

Adds multiple class names - you can either pass multiple string arguments or
an array of strings

```javascript
const node = Tree.createElement( 'lunchbox' )

node.addClasses( 'one', 'two' )
node.addClasses( [ 'three', 'four' ] )
```

#### removeClass

Removes the named class

```javascript
const node = Tree({
  attributes: {
    class: 'one two three'
  }
})

node.removeClass( 'two' )

// true
console.log( node.hasClass( 'one' ) )
// false
console.log( node.hasClass( 'two' ) )
```

#### toggleClass

Toggles the named class on or off. 

If just the class name is passed it will:

- add the class if it doesn't already exist
- remove the class if it already exists

If you pass the class name and a boolean it will add the class if you pass true,
and remove it if you pass false

```javascript
const node = Tree.createElement( 'div', { class: 'one two three' } )

// exists, gets toggled off and removed
node.toggleClass( 'one' )

// doesn't exist, will get added
node.toggleClass( 'four' )

// adds 'one'
node.toggleClass( 'one', true )

// removes 'two'
node.toggleClass( 'two', false )

// adds five
node.toggleClass( 'five', true )

// does not add six
node.toggleClass( 'six', false )
```

#### clearClasses

Removes all classes

```javascript
const node = Tree.createElement( 'div', { class: 'one two three' } )

node.clearClasses()

// []
console.log( node.classNames() )
```

### createNodes

Static helpers for creating different types of nodes analagous to those of the
DOM. If some of these nodes map well to your underlying data structure you may
want to override these plugins.

#### createText

Creates a text node. The new node's value looks like: 

```json
{
  "nodeType": "text",
  "nodeValue": "some text value"
}
```

```javascript
const node = Tree.createText( 'Hello' )

// 'Hello'
console.log( node.getValue( "nodeValue" ) )
```

#### createComment

Creates a comment node. The new node's value looks like: 

```json
{
  "nodeType": "comment",
  "nodeValue": "some text value"
}
```

```javascript
const node = Tree.createComment( 'Delete this' )

// 'Delete this'
console.log( node.getValue( "nodeValue" ) )
```

#### createDocumentFragment

Creates a document fragment node. The new node's value looks like: 

```json
{
  "nodeType": "documentFragment"
}
```

```javascript
const node = Tree.createDocumentFragment()

// add some children
```

#### createDocumentType

Creates a document type node. Analagous to the doctype in the DOM.

The new node's value looks like: 

```json
{
  "nodeType": "documentType",
  "name": "...",
  "publicId": "...",
  "systemId": "..."
}
```

The name is rquired, but publicId and systemId are optional:

```javascript
const html5 = Tree.createDocumentType( 'html' )
const html4 = Tree.createDocumentType( 
  'HTML', '-//W3C//DTD HTML 4.01//EN', 'http://www.w3.org/TR/html4/strict.dtd' 
)
```

#### createDocument

Creates a document node. The new node's value looks like: 

```json
{
  "nodeType": "document"
}
```

```javascript
const node = Tree.createDocument()

// add some children
```

#### createElement

Creates an element node. The new node's value looks like this:

```json
{ 
  "nodeType": "element", 
  "tagName": "...", 
  "attributes": {} 
}
```

Takes a tagName and an attributes object:

```javascript
const lunchbox = Tree.createElement( 'lunchbox', {
  class: 'container plastic',
  weight: 0.3
})
```

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
