# DOM plugins

A set of plugins for mojule [tree](https://github.com/mojule/tree) that lets you 
treat any tree as a DOM, allowing you to do interesting things like run query 
selectors over your tree even if the nodes don't represent HTML elements.

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
  "num": 42,
  "bar": {
    "a": [ "b", "c", { "d": "e", "f": 3 } ]
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

Acts like the browser DOM dataset - provides an abstraction over any attributes
prefixed by `data-`.

The abstraction converts between hyphenated `data-` style attributes and 
camelCased attributes:

```javascript
{
  'data-first-name': 'Nik',
  'data-last-name': 'Coughlin'
}

{
  firstName: 'Nik',
  lastName: 'Coughlin'
}
```

#### dataset

Convenience wrapper - calls getDataset/setDataset depending on arguments passed.

```javascript
node.dataset({
  firstName: 'Nik',
  lastName: 'Coughlin'
})

console.log( node.dataset() )
```

#### getDataset

Returns a camelCase style object from `data-` attributes

```javascript
const node = Tree.createElement( 'thing', {
  id: 'myThing'
  'data-first-name': 'Nik',
  'data-last-name': 'Coughlin'
})

console.log( node.dataset() )
```

```json
{
  "firstName": "Nik",
  "lastName": "Coughlin"
}
```

#### setDataset

Takes a camelCased object and sets `data-` attributes accordingly

```javascript
node.setDataset({
  firstName: 'Nik',
  lastName: 'Coughlin'
})
```

### getText

Gets a string which is the concatenation of all text nodes that are descendants
of the current node

```javascript
const container = Tree.createElement( 'container' )
const anotherContainer = Tree.createElement( 'container' )

const hello = Tree.createText( 'Hello' )
const world = Tree.createText( ', World!' )

container.append( hello )
container.append( anotherContainer )
anotherContainer.append( world )

// 'Hello, World!'
console.log( container.getText() )
```

### H Factory

Generates a [hyperscript](https://github.com/hyperhype/hyperscript)-like API
as a convenience wrapper for generating nested nodes - backed by 
[html-script](https://github.com/mojule/html-script/).

The arguments should either be multiple strings for the node names you want to
use, or a single array of strings

If you omit the arguments, the node names from HTML (`div`, `p` etc) will be 
used.

```javascript
// alternately, Tree.H( [ 'box', 'hat', 'cheese' ] )
const h = Tree.H( 'box', 'hat', 'cheese' )

const { 
  document, documentType, documentFragment, text, comment,
  box, hat, cheese
} = h

const doc = document(
  documentType( 'silly' ),
  documentFragment(
    comment( 'so silly' ),
    box(
      { id: 'myBox' },
      hat(),
      cheese(
        text( 'delicious ' ),
        'cheese'
      )
    )
  )
)

// '<!doctype silly><!--so silly--><box id="myBox"><hat></hat><cheese>delicious cheese</cheese></box>'
console.log( doc.stringify() )
```

### isEmpty

Overrides base `isEmpty` from 
[tree-factory](https://github.com/mojule/tree-factory) and any other `isEmpty`
plugins added prior to the DOM plugins, and returns `true` if the node matches 
any of the following `isType` plugins:

- isText
- isComment
- isDocumentType

`false` for the following:

- isDocumentFragment
- isDocument

If none of the above are true, it returns the result of the previous `isEmpty`
plugin.

```javascript
const text = Tree.createText( 'Hello' )

// true
console.log( text.isEmpty() )
```

### isType

A set of functions that return `true` if the current node is of a given node 
type.

#### isText

Default implementation returns `true` if `node.nodeType() === 'text'`

```javascript
const text = Tree.createText( 'Hello' )

// true
console.log( text.isText() )
```

#### isComment

Default implementation returns `true` if `node.nodeType() === 'comment'`

```javascript
const comment = Tree.createComment( 'Hello' )

// true
console.log( comment.isComment() )
```

#### isDocumentFragment

Default implementation returns `true` if 
`node.nodeType() === 'documentFragment'`

```javascript
const fragment = Tree.createDocumentFragment()

// true
console.log( fragment.isDocumentFragment() )
```

#### isDocumentType

Default implementation returns `true` if `node.nodeType() === 'documentType'`

```javascript
const doctype = Tree.createDocumentType( 'tree' )

// true
console.log( doctype.isDocumentType() )
```

#### isDocument

Default implementation returns `true` if `node.nodeType() === 'document'`

```javascript
const doc = Tree.createDocument()

// true
console.log( doc.isDocument() )
```

#### isElement

Returns true if none of the above conditions are met - this means that if you
don't override anything, most of your custom tree nodes will be considered 
elements, as will elements created with `Tree.createElement`

```javascript
const node = Tree({ name: 'Nik' })

// true
console.log( doc.isElement() )
```

### name

Plugins that emulate tagName and nodeName from the browser DOM

#### tagName

If the node has a tagName property on its value, that will be returned. Falls
back to `nodeType` otherwise. If you haven't overriden `nodeType`, the default
value is 'node'.

```javascript
const node = Tree({ name: 'Nik' })

// 'node'
console.log( node.tagName() )

const banana = Tree.createElement( 'banana' )

// 'banana'
console.log( banana.tagName() )
```

#### nodeName

Tests the various `isText`, `isComment` etc. and returns '#text', '#comment', 
'#document' or '#document-fragment' as appropriate.

If the node `isDocumentType` returns the node's `name` property if it exists, 
otherwise falls back to `node.treeType()`

If the node `isElement`, returns `node.tagName()`

```javascript
const hello = Tree.createText( 'Hello' )
const node = Tree({ name: 'Nik' })
const banana = Tree.createElement( 'banana' )

// '#text'
console.log( hello.nodeName() )

// 'node'
console.log( node.nodeName() )

// 'banana'
console.log( banana.nodeName() )
```

### nodeValue

By default, a shortcut to getting or setting the `nodeValue` property of the 
node's value object, can be overridden for custom behaviour

#### nodeValue

Convenience function around `getNodeValue`/`setNodeValue`

```javascript
const node = Tree.createText( 'Hello' )

node.nodeValue( 'Hello, World!' )

// 'Hello, World!'
console.log( node.nodeValue() )
```

#### getNodeValue

Get the `nodeValue` property of the node's value object

```javascript
const node = Tree.createText( 'Hello' )

// 'Hello'
console.log( node.getNodeValue() )
```

#### setNodeValue

Get the `nodeValue` property of the node's value object

```javascript
const node = Tree.createText( 'Hello' )

node.setNodeValue( 'Hello, World!' )

// 'Hello, World!'
console.log( node.nodeValue() )
```

### parser

Static method that parses an XML-like representation of your tree and returns 
either a root node if the markup has a single root element, or a 
documentFragment node if the markup contains more than one unrooted node.

Uses [htmlparser2](https://github.com/fb55/htmlparser2) with a custom adapter 
under the hood.

Takes an optional second `options` argument which is passed through to 
htmlparser2, see their docs for more info. Adds an extra property to the 
options, `removeWhitespace`, which will remove all whitespace-only nodes, useful
for parsing pretty-printed XML for custom trees where whitespace nodes don't
make sense.

```javascript
const node = Tree.parse( '<hello><world /></hello>' )

// 'hello'
console.log( node.tagName() )

const node2 = Tree.parse( `
<hello>
  <world class="foo" />
</hello>  
`, { removeWhitespace: true } )
```

### select

Plugins allowing you to use CSS selectors to query your tree.

Backed by [css-select](https://github.com/fb55/css-select) with a custom 
adapter. css-select supports all CSS3 selectors, as well as some additional
selectors from jQuery and some of its own as well. See the docs for more info.

#### querySelector

Finds the first descendant node of the current node that matches the given
selector. Like the browser DOM, it does not include the current node in the 
search.

```javascript
const node2 = Tree.parse( `
<hello>
  <world class="foo" />
</hello>  
`, { removeWhitespace: true } )

const foo = node2.querySelector( '.foo' )
```

#### querySelectorAll

Finds all descendant nodes that match the given selector.  Like the browser DOM, 
it does not include the current node in the search. Returns an array of matching
nodes.

```javascript
const node2 = Tree.parse( `
<hello>
  <world class="foo" />
  <world class="bar" />
</hello>  
`, { removeWhitespace: true } )

const worlds = node2.querySelectorAll( 'world' )

// 2
console.log( worlds.length )
```

#### matches

Returns a boolean indicating whether the current node matches the given 
selector.

```javascript
const node2 = Tree.parse( `
<hello>
  <world class="foo" />
</hello>  
`, { removeWhitespace: true } )

// true
console.log( node2.matches( 'hello' ) )
```

### stringify

Creates an XML-like string representation of your tree

```javascript
const box = Tree.createElement( 'box' )
const hat = Tree.createElement( 'hat' )
const priceTag = Tree.createElement( 'price' )
const price = Tree.createText( 'In this style 10/6' )

box.append( hat )
hat.append( priceTag )
priceTag.append( price )

// '<box><hat><price>In this style 10/6</price></hat></box>
console.log( box.stringify() )
```

### treeType

Returns the type of the current tree - default implementation always uses
`tree`, intended to be overridden by custom plugins. Used by documentType nodes
when there is no name property.

```javascript
// 'tree'
console.log( Tree.treeType() )
```