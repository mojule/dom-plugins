'use strict'

const assert = require( 'assert' )
const Factory = require( '@mojule/tree' ).Factory
const plugins = require( '../src' )

const Tree = Factory( plugins )

describe( 'DOM plugins', () => {
  describe( 'types', () => {
    it( 'createText', () => {
      const node = Tree.createText( 'test' )

      assert( node.isText() )
      assert( node.isEmpty() )
      assert.equal( node.stringify(), 'test' )
      assert.equal( node.nodeValue(), 'test' )
      assert.equal( node.nodeName(), '#text' )
    })

    it( 'createComment', () => {
      const node = Tree.createComment( 'test' )

      assert( node.isComment() )
      assert( node.isEmpty() )
      assert.equal( node.stringify(), '<!--test-->' )
      assert.equal( node.nodeValue(), 'test' )
      assert.equal( node.nodeName(), '#comment' )
    })

    it( 'createDocumentFragment', () => {
      const node = Tree.createDocumentFragment()

      assert( node.isDocumentFragment() )
      assert( !node.isEmpty() )
      assert.equal( node.nodeName(), '#document-fragment' )
    })

    it( 'createDocumentType', () => {
      const node = Tree.createDocumentType( 'html' )

      assert( node.isDocumentType() )
      assert( node.isEmpty() )
      assert.equal( node.stringify(), '<!doctype html>' )
      assert.equal( node.nodeName(), 'html' )
    })

    it( 'createDocument', () => {
      const node = Tree.createDocument()

      assert( node.isDocument() )
      assert( !node.isElement() )
      assert( !node.isEmpty() )
      assert.equal( node.nodeName(), '#document' )
    })

    it( 'createElement', () => {
      const node = Tree.createElement( 'div', { id: 'myDiv' } )

      assert( node.isElement() )
      assert( !node.isEmpty() )
      assert.equal( node.stringify(), '<div id="myDiv"></div>' )
      assert.equal( node.nodeName(), 'div' )
      assert.equal( node.tagName(), 'div' )
    })
  })

  describe( 'Attributes', () => {
    it( 'getAttributes', () => {
      const node = Tree.createElement( 'div', { id: 'myDiv' } )

      assert.deepEqual( node.getAttributes(), { id: "myDiv" } )

      node.setValue( 'attributes', [] )

      assert.throws( () => node.getAttributes() )

      const something = Tree( { nodeType: 'something' } )

      assert.deepEqual( something.getAttributes(), {} )
    })

    it( 'setAttributes', () => {
      const node = Tree.createElement( 'div' )

      node.setAttributes( { id: 'myDiv' } )

      assert.deepEqual( node.getAttributes(), { id: "myDiv" } )

      assert.throws( () => node.setAttributes( [] ) )
    })

    it( 'attributes', () => {
      const node = Tree.createElement( 'div' )

      node.attributes( { id: 'myDiv' } )

      assert.deepEqual( node.attributes(), { id: "myDiv" } )

      assert.throws( () => node.attributes( [] ) )
    })

    it( 'getAttr', () => {
      const node = Tree.createElement( 'div', { id: 'myDiv' } )

      assert.equal( node.getAttr( 'id' ), 'myDiv' )
      assert.equal( node.getAttr( 'nope' ), undefined )
    })

    it( 'setAttr', () => {
      const node = Tree.createElement( 'div' )

      node.setAttr( 'id', 'myDiv' )

      assert.equal( node.getAttr( 'id' ), 'myDiv' )
    })

    it( 'attr', () => {
      const node = Tree.createElement( 'div' )

      node.attr( 'id', 'myDiv' )

      assert.equal( node.attr( 'id' ), 'myDiv' )
    })

    it( 'hasAttr', () => {
      const node = Tree.createElement( 'div', { id: 'myDiv' } )

      assert( node.hasAttr( 'id' ) )
      assert( !node.hasAttr( 'nope' ) )
    })

    it( 'removeAttr', () => {
      const node = Tree.createElement( 'div', { id: 'myDiv', class: 'myClass' } )

      assert( node.hasAttr( 'id' ) )
      assert( node.hasAttr( 'class' ) )

      node.removeAttr( 'class' )

      assert( node.hasAttr( 'id' ) )
      assert( !node.hasAttr( 'class' ) )
    })

    it( 'clearAttrs', () => {
      const node = Tree.createElement( 'div', { id: 'myDiv', class: 'myClass' } )

      node.clearAttrs()

      assert( !node.hasAttr( 'id' ) )
      assert( !node.hasAttr( 'class' ) )
      assert.deepEqual( node.getAttributes(), {} )
    })

    it( 'valueToAttributes/attributesToValue', () => {
      const value = {
        nodeType: 'something',
        foo: 'hello',
        num: 42,
        bool: false,
        n: null,
        bar: {
          a: [ 'b', 'c', { d: 'e', f: 3 } ]
        }
      }

      const expectAttributes = {
        nodeType: 'something',
        foo: 'hello',
        'num-number': '42',
        'bool-boolean': 'false',
        'n-null': 'null',
        'bar_a-0': 'b',
        'bar_a-1': 'c',
        'bar_a-2_d': 'e',
        'bar_a-2_f-number': '3'
      }

      const attributes = Tree.valueToAttributes( value )

      assert.deepEqual( attributes, expectAttributes )

      const nodeValue = Tree.attributesToValue( attributes )

      assert.deepEqual( nodeValue, value )

      assert.throws( () => Tree.attributesToValue() )
    })
  })

  describe( 'Classes', () => {
    it( 'classNames', () => {
      const n1 = Tree.createElement( 'div' )

      assert.deepEqual( n1.classNames(), [] )

      const n2 = Tree.createElement( 'div', { class: ' cool  ok yeah ' } )

      assert.deepEqual( n2.classNames(), [ 'cool', 'ok', 'yeah' ] )
    })

    it( 'addClass', () => {
      const n2 = Tree.createElement( 'div', { class: ' cool  ok yeah ' } )

      n2.addClass( ' awesome  ' )

      assert.deepEqual( n2.classNames(), [ 'cool', 'ok', 'yeah', 'awesome' ] )

      n2.addClass( ' two   three ' )

      assert.deepEqual( n2.classNames(), [ 'cool', 'ok', 'yeah', 'awesome', 'two', 'three' ] )

      assert.throws( () => n2.addClass() )
    })

    it( 'hasClass', () => {
      const n2 = Tree.createElement( 'div', { class: ' cool  ok yeah ' } )

      assert( n2.hasClass( 'cool' ) )
      assert( n2.hasClass( 'ok' ) )
      assert( n2.hasClass( 'yeah' ) )
      assert( !n2.hasClass( 'awesome' ) )
    })

    it( 'addClasses', () => {
      const n = Tree.createElement( 'div', { class: ' cool  ok yeah ' } )

      n.addClasses( ' one', 'two ' )

      assert.deepEqual( n.classNames(), [ 'cool', 'ok', 'yeah', 'one', 'two' ] )

      n.addClasses( [ 'three', ' four' ] )

      assert.deepEqual( n.classNames(), [ 'cool', 'ok', 'yeah', 'one', 'two', 'three', 'four' ] )

      n.addClasses( 'five six' )

      assert.deepEqual( n.classNames(), [ 'cool', 'ok', 'yeah', 'one', 'two', 'three', 'four', 'five', 'six' ] )
    })

    it( 'removeClass', () => {
      const n = Tree.createElement( 'div', { class: ' cool  ok yeah ' } )

      n.removeClass( ' ok' )

      assert.deepEqual( n.classNames(), [ 'cool', 'yeah' ] )
    })

    it( 'toggleClass', () => {
      const n = Tree.createElement( 'div', { class: ' cool  ok yeah ' } )

      n.toggleClass( 'cool' )
      assert( !n.hasClass( 'cool' ), 'toggle existing' )

      n.toggleClass( 'awesome' )
      assert( n.hasClass( 'awesome' ), 'toggle nonexistant' )

      n.toggleClass( 'one', true )
      assert( n.hasClass( 'one' ), 'set new' )

      n.toggleClass( 'two', false )
      assert( !n.hasClass( 'two' ), 'remove new' )

      n.toggleClass( 'ok', true )
      assert( n.hasClass( 'ok' ), 'set existing' )

      n.toggleClass( 'yeah', false )
      assert( !n.hasClass( 'yeah' ), 'remove existing' )
    })

    it( 'clearClasses', () => {
      const n = Tree.createElement( 'div', { class: ' cool  ok yeah ' } )

      n.clearClasses()

      assert.deepEqual( n.classNames(), [] )
    })
  })

  describe( 'dataset', () => {
    it( 'getDataset', () => {
      const n = Tree.createElement( 'div' )

      assert.deepEqual( n.getDataset(), {} )

      const value = {
        id: 'myDiv',
        'data-first-name': 'Nik',
        'data-last-name': 'Coughlin',
        'data-age': 36
      }

      const expect = {
        firstName: 'Nik',
        lastName: 'Coughlin',
        age: '36'
      }

      const n2 = Tree.createElement( 'div', value )

      const dataset = n2.getDataset()

      assert.deepEqual( dataset, expect )
    })

    it( 'setDataset', () => {
      const n = Tree.createElement( 'div', { id: 'myDiv' } )

      const value = {
        firstName: 'Nik',
        lastName: 'Coughlin',
        age: 36
      }

      const expect = {
        id: 'myDiv',
        'data-first-name': 'Nik',
        'data-last-name': 'Coughlin',
        'data-age': '36'
      }

      n.setDataset( value )

      assert.deepEqual( n.getAttributes(), expect )

      assert.throws( () => n.setDataset() )
    })

    it( 'dataset', () => {
      const n = Tree.createElement( 'div' )

      assert.deepEqual( n.dataset(), {} )

      const value = {
        id: 'myDiv',
        'data-first-name': 'Nik',
        'data-last-name': 'Coughlin',
        'data-age': 36
      }

      const expect = {
        firstName: 'Nik',
        lastName: 'Coughlin',
        age: '36'
      }

      const n2 = Tree.createElement( 'div', value )

      const dataset = n2.dataset()

      assert.deepEqual( dataset, expect )

      const n3 = Tree.createElement( 'div', { id: 'myDiv' } )

      const value2 = {
        firstName: 'Nik',
        lastName: 'Coughlin',
        age: 36
      }

      const expect2 = {
        id: 'myDiv',
        'data-first-name': 'Nik',
        'data-last-name': 'Coughlin',
        'data-age': '36'
      }

      n3.dataset( value2 )

      assert.deepEqual( n3.getAttributes(), expect2 )
    })
  })

  it( 'getText', () => {
    const div = Tree.createElement( 'div' )
    const t1 = Tree.createText( 'Hello ' )
    const strong = Tree.createElement( 'strong' )
    const t2 = Tree.createText( 'World' )
    const i = Tree.createElement( 'i' )

    div.append( t1 )
    div.append( strong )
    strong.append( t2 )

    assert.equal( t1.getText(), 'Hello ' )
    assert.equal( t2.getText(), 'World' )
    assert.equal( strong.getText(), 'World' )
    assert.equal( div.getText(), 'Hello World' )
    assert.equal( i.getText(), '' )
  })

  it( 'getTagName', () => {
    const cool = Tree( { tagName: 'cool' } )

    assert.equal( cool.getTagName(), 'cool' )

    const wut = Tree( { tagName: '' } )

    assert.throws( () => wut.getTagName() )

    const nope = Tree( { tagName: 42 } )

    assert.equal( nope.getTagName(), 'node', 'falls back to default nodeType' )
  })

  it( 'setTagName', () => {
    const cool = Tree( { tagName: 'cool' } )

    cool.setTagName( 'dumb' )

    assert.equal( cool.getTagName(), 'dumb' )

    cool.tagName( 'cool' )

    assert.equal( cool.getTagName(), 'cool' )

    assert.throws( () => cool.setTagName() )
  })

  it( 'nodeName', () => {
    const cool = Tree( { nodeType: 'documentType' } )

    assert.equal( cool.nodeName(), cool.treeType(), 'defaults to treeType' )

    const nope = Tree( { nodeType: 'documentType', name: '' } )

    assert.throws( () => nope.nodeName() )
  })

  describe( 'nodeValue', () => {
    it( 'getNodeValue', () => {
      const n = Tree( { nodeType: 'text', nodeValue: 'Hello' } )

      assert.equal( n.getNodeValue(), 'Hello' )
    })

    it( 'setNodeValue', () => {
      const n = Tree( { nodeType: 'text', nodeValue: 'Hello' } )

      n.setNodeValue( 'World' )

      assert.equal( n.getNodeValue(), 'World' )

      assert.throws( () => n.setNodeValue() )
    })

    it( 'nodeValue', () => {
      const n = Tree( { nodeType: 'text', nodeValue: 'Hello' } )

      n.nodeValue( 'World' )

      assert.equal( n.nodeValue(), 'World' )
    })
  })

  describe( 'parser', () => {
    it( 'single element', () => {
      const html = '<div>Hello</div>'
      const div = Tree.parse( html )

      assert( div.isElement() )
      assert.equal( div.nodeType(), 'element' )
      assert.equal( div.tagName(), 'div' )
      assert.equal( div.stringify(), html )
    })

    it( 'multiple elements', () => {
      const html = '<div>Hello</div><span> World</span>'
      const div = Tree.parse( html )

      assert( div.isDocumentFragment() )
      assert.equal( div.nodeType(), 'documentFragment' )
      assert.equal( div.stringify(), html )
    })

    it( 'doctype', () => {
      const html = '<!doctype html><div></div>'
      const fragment = Tree.parse( html )
      const dt = fragment.firstChild()

      assert( dt.isDocumentType() )
      assert.equal( fragment.stringify(), html )
    })
  })

  describe( 'stringify', () => {
    it( 'doctype', () => {
      const d = Tree.createDocumentType( 'html', 'myId', 'mySystemId' )

      assert.equal( d.stringify(), '<!doctype html public "myId" "mySystemId">' )
    })

    it( 'empty attributes', () => {
      const n = Tree.createElement( 'div', { checked: null } )

      assert.equal( n.stringify(), '<div checked></div>' )
    })

    it( 'empty nodes', () => {
      const isEmpty = node => {
        const { isEmpty } = node
        return {
          isEmpty: () => {
            if( node.nodeName() === 'cool' )
              return true

            return isEmpty()
          }
        }
      }

      const Tree = Factory( plugins.concat( isEmpty ) )

      const n = Tree.createElement( 'cool' )

      assert.equal( n.stringify(), '<cool />' )
    })
  })

  it( 'treeType', () => {
    const div = Tree.createElement( 'div' )

    assert.equal( div.treeType(), 'tree' )
  })

  describe( 'CSS select', () => {
    describe( 'querySelector', () => {
      it( 'tag', () => {
        const html = '<div><strong>Hello</strong></div>'
        const n = Tree.parse( html )

        const strong = n.querySelector( 'strong' )

        assert.equal( strong.nodeName(), 'strong' )
      })

      it( 'attribute', () => {
        const html = '<div><strong class="cool">Hello</strong></div>'
        const n = Tree.parse( html )

        const strong = n.querySelector( '.cool' )

        assert.equal( strong.nodeName(), 'strong' )
      })

      it( ':contains', () => {
        const html = '<div><strong>Hello</strong></div>'
        const n = Tree.parse( html )

        const strong = n.querySelector( ':contains(Hello)' )

        assert( strong.isElement() )
      })
    })

    describe( 'querySelectorAll', () => {
      it( 'tag', () => {
        const html = '<div><strong>Hello</strong> <strong>World</strong></div>'
        const n = Tree.parse( html )

        const strongs = n.querySelectorAll( 'strong' )

        assert.equal( strongs.length, 2 )
        assert( strongs.every( s => s.nodeName() === 'strong' ) )
      })

      it( 'attribute', () => {
        const html = '<div><strong class="cool">Hello</strong> <strong class="cool">World</strong></div>'
        const n = Tree.parse( html )

        const strongs = n.querySelectorAll( '.cool' )

        assert.equal( strongs.length, 2 )
        assert( strongs.every( s => s.nodeName() === 'strong' ) )
      })

      it( ':contains', () => {
        const html = '<div><strong class="cool">Hello</strong> <strong class="cool">Hello</strong></div>'
        const n = Tree.parse( html )

        const strongs = n.querySelectorAll( ':contains(Hello)' )

        assert.equal( strongs.length, 2 )
        assert( strongs.every( s => s.nodeName() === 'strong' ) )
      })
    })

    describe( 'matches', () => {
      it( 'tag', () => {
        const html = '<div><strong>Hello</strong></div>'
        const n = Tree.parse( html )

        const strong = n.querySelector( 'strong' )

        assert( strong.matches( 'strong' ) )
      })

      it( 'attribute', () => {
        const html = '<div><strong class="cool">Hello</strong></div>'
        const n = Tree.parse( html )

        const strong = n.querySelector( '.cool' )

        assert( strong.matches( '.cool' ) )
      })

      it( ':contains', () => {
        const html = '<div><strong>Hello</strong></div>'
        const n = Tree.parse( html )

        const strong = n.querySelector( ':contains(Hello)' )

        assert( strong.matches( ':contains(Hello)' ) )
      })
    })
  })

  describe( 'Parser', () => {
    it( 'comment', () => {
      const html = '<!--Hello-->'
      const n = Tree.parse( html )

      assert( n.isComment() )
    })

    it( 'processing instruction to comment', () => {
      const html = '<? Hello ?>'
      const n = Tree.parse( html )

      assert( n.isComment() )
    })

    it( 'removeWhitespace', () => {
      const html = '  <div>Hello</div>  <span>World</span>'
      const n = Tree.parse( html, { removeWhitespace: true } )

      assert.equal( n.stringify(), '<div>Hello</div><span>World</span>' )
    })

    it( 'ignoreWhitespace', () => {
      const html = '  \n\t<div>Hello</div> \n  \r  <span>World</span>  '
      const n = Tree.parse( html, { ignoreWhitespace: true } )

      assert.equal( n.stringify(), ' <div>Hello</div> <span>World</span> ' )
    })

    it( 'calls DomHandler onerror', () => {
      const DomHandler = require( '../src/domhandler-adapter' )
      const htmlparser2 = require( 'htmlparser2' )

      const handler = DomHandler( Tree )

      const parser = new htmlparser2.Parser( handler )

      parser.end( '<div></div>' )

      assert.throws( () => parser.write( '<div></div>' ) )
    })
  })

  describe( 'H Factory', () => {
    it( 'Takes custom nodeNames', () => {
      const tagNames = [ 'box', 'hat', 'cheese' ]

      const h = Tree.H( tagNames )

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

      const expect = '<!doctype silly><!--so silly--><box id="myBox"><hat></hat><cheese>delicious cheese</cheese></box>'

      assert.equal( doc.stringify(), expect )
    })

    it( 'defaults to HTML', () => {
      const h = Tree.H()

      const {
        document, documentType, documentFragment, text, comment,
        div, p, span
      } = h

      const doc = document(
        documentType( 'html' ),
        documentFragment(
          comment( 'so silly' ),
          div(
            { id: 'myDiv' },
            p(),
            span(
              text( 'delicious ' ),
              'cheese'
            )
          )
        )
      )

      const expect = '<!doctype html><!--so silly--><div id="myDiv"><p></p><span>delicious cheese</span></div>'

      assert.equal( doc.stringify(), expect )
    })
  })
})