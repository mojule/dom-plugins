'use strict'

const assert = require( 'assert' )
const Factory = require( '@mojule/tree' ).Factory
const is = require( '@mojule/is' )
const plugins = require( '../src' )

const Tree = Factory( plugins )

describe( 'DOM plugins', () => {
  describe( 'types', () => {
    describe( 'text', () => {
      const node = Tree.createText( 'test' )

      it( 'isTextNode', () => {
        assert( node.isTextNode() )
      })

      it( 'isEmpty', () => {
        assert( node.isEmpty() )
      })

      it( 'toString', () => {
        const str = node.toString()
        assert.equal( str, 'test' )
      })

      it( 'nodeValue', () => {
        assert.equal( node.nodeValue, 'test' )
      })

      it( 'nodeName', () => {
        assert.equal( node.nodeName, '#text' )
      })

      it( 'enum', () => {
        assert.equal( node.nodeType, Tree.TEXT_NODE )
      })
    })

    it( 'createComment', () => {
      const node = Tree.createComment( 'test' )

      assert( node.isCommentNode() )
      assert( node.isEmpty() )
      assert.equal( node.toString(), '<!--test-->' )
      assert.equal( node.nodeValue, 'test' )
      assert.equal( node.nodeName, '#comment' )
      assert.equal( node.nodeType, Tree.COMMENT_NODE )
    })

    it( 'createDocumentFragment', () => {
      const node = Tree.createDocumentFragment()

      assert( node.isDocumentFragmentNode() )
      assert( !node.isEmpty() )
      assert.equal( node.nodeName, '#document-fragment' )
      assert.equal( node.nodeType, Tree.DOCUMENT_FRAGMENT_NODE )
    })

    it( 'createDocumentType', () => {
      const node = Tree.createDocumentType( 'html' )

      assert( node.isDocumentTypeNode() )
      assert( node.isEmpty() )
      assert.equal( node.toString(), '<!doctype html>' )
      assert.equal( node.nodeName, 'html' )
      assert.equal( node.nodeType, Tree.DOCUMENT_TYPE_NODE )
    })

    it( 'createDocument', () => {
      const node = Tree.createDocument()

      assert( node.isDocumentNode() )
      assert( !node.isElementNode() )
      assert( !node.isEmpty() )
      assert.equal( node.nodeName, '#document' )
      assert.equal( node.nodeType, Tree.DOCUMENT_NODE )
    })

    it( 'createElement', () => {
      const node = Tree.createElement( 'div', { id: 'myDiv' } )

      assert( node.isElementNode() )
      assert( !node.isEmpty() )
      assert.equal( node.toString(), '<div id="myDiv"></div>' )
      assert.equal( node.nodeName, 'div' )
      assert.equal( node.tagName, 'div' )
      assert.equal( node.nodeType, Tree.ELEMENT_NODE )
    })
  })

  describe( 'element', () => {
    const Dom = () => {
      const div = Tree.createElement( 'div', { id: 'myDiv', class: 'foo baz qux', title: 'bar' } )
      const p = Tree.createElement( 'p' )
      const div2 = Tree.createElement( 'div' )
      const span = Tree.createElement( 'span', { class: 'bar' } )
      const strong = Tree.createElement( 'strong', { class: 'bar' } )
      const strong2 = Tree.createElement( 'strong', { class: 'foo' } )
      const text = Tree.createTextNode( 'hello' )

      div.appendChild( p )
      p.appendChild( div2 )
      div2.append( span, strong, strong2, text )

      return { div, p, div2, span, strong, strong2, text }
    }

    describe( 'methods', () => {
      it( 'closest', () => {
        const { div, strong, p } = Dom()

        const target = strong.closest( 'p' )

        assert.equal( target, p )
      })

      it( 'getAttribute', () => {
        const { div } = Dom()
        const id = div.getAttribute( 'id' )

        assert.strictEqual( id, "myDiv" )
      })

      it( 'getAttributes', () => {
        const { div } = Dom()

        assert.deepEqual(
          div.getAttributes(),
          { id: 'myDiv', class: 'foo baz qux', title: 'bar' }
        )
      })

      it( 'getElementsByClassName', () => {
        const { div, span, strong } = Dom()

        const els = div.getElementsByClassName( 'bar' )

        assert.deepEqual( Array.from( els ), [ span, strong ] )

        const liveNode = Tree.createElement( 'div', { class: 'bar' } )

        strong.appendChild( liveNode )

        assert.deepEqual( Array.from( els ), [ span, strong, liveNode ] )
      })

      it( 'getElementsByTagName', () => {
        const { div, strong, strong2 } = Dom()

        const els = div.getElementsByTagName( 'strong' )

        assert.deepEqual( Array.from( els ), [ strong, strong2 ] )

        const liveNode = Tree.createElement( 'strong' )

        strong2.appendChild( liveNode )

        assert.deepEqual( Array.from( els ), [ strong, strong2, liveNode ] )
      })

      it( 'matches', () => {
        const { div } = Dom()

        assert( !div.matches( 'span' ) )
        assert( div.matches( 'div' ) )
        assert( div.matches( '#myDiv' ) )
        assert( div.matches( '.foo' ) )
        assert( div.matches( '[title=bar]' ) )
      })

      it( 'non standard contains selector', () => {
        const div = Tree.createElement( 'div' )
        const text = Tree.createTextNode( 'hello' )

        div.appendChild( text )

        assert( div.matches( ':contains(hello)' ) )
      })

      it( 'querySelector', () => {
        const { div, strong, div2 } = Dom()

        const target1 = div.querySelector( 'strong' )
        const target2 = div.querySelector( 'div' )

        assert.equal( target1, strong )
        assert.equal( target2, div2 )
      })

      it( 'querySelectorAll', () => {
        const { div, strong, strong2, div2 } = Dom()

        const target1 = div.querySelectorAll( 'strong' )
        const target2 = div.querySelectorAll( 'div' )

        assert.deepEqual( Array.from( target1 ), [ strong, strong2 ] )
        assert.deepEqual( Array.from( target2 ), [ div2 ] )
      })

      it( 'removeAttribute', () => {
        const { div } = Dom()

        div.removeAttribute( 'title' )

        assert.deepEqual(
          div.getAttributes(),
          { id: 'myDiv', class: 'foo baz qux' }
        )
      })

      it( 'select', () => {
        const { div } = Dom()

        assert.equal( div.select( 'div' ), div )
      })

      it( 'selectAll', () => {
        const { div, div2 } = Dom()

        assert.deepEqual( Array.from( div.selectAll( 'div' ) ), [ div, div2 ] )
      })

      it( 'setAttribute', () => {
        const node = Tree.createElement( 'div' )

        node.setAttribute( 'id', 'myDiv' )

        assert.deepEqual( node.getAttributes(), { id: "myDiv" } )
      })

      it( 'setAttributes', () => {
        const node = Tree.createElement( 'div' )

        node.setAttributes( { id: 'myDiv' } )

        assert.deepEqual( node.getAttributes(), { id: "myDiv" } )

        assert.throws( () => node.setAttributes( [] ) )
      })
    })

    describe( 'properties', () => {
      it( 'attributes', () => {
        const { div } = Dom()

        assert.deepEqual(
          Array.from( div.attributes ),
          [
            { name: 'id', value: 'myDiv' },
            { name: 'class', value: 'foo baz qux' },
            { name: 'title', value: 'bar' }
          ]
        )
      })

      it( 'childElementCount', () => {
        const { div2 } = Dom()

        assert.equal( div2.childElementCount, 3 )
      })

      it( 'children', () => {
        const { div2, span, strong, strong2 } = Dom()

        assert.deepEqual(
          Array.from( div2.children ),
          [ span, strong, strong2 ]
        )
      })

      describe( 'classList', () => {
        it( 'contains', () => {
          const { div } = Dom()

          assert( div.classList.contains( 'foo' ) )
          assert( !div.classList.contains( 'nope' ) )
        })

        it( 'add', () => {
          const { div } = Dom()

          div.classList.add( 'new' )

          assert( div.classList.contains( 'new' ) )
        })

        it( 'remove', () => {
          const { div } = Dom()

          div.classList.remove( 'foo' )

          assert( !div.classList.contains( 'foo' ) )
        })

        it( 'replace', () => {
          const { div } = Dom()

          div.classList.replace( 'foo', 'new' )

          assert( div.classList.contains( 'new' ) )
          assert( !div.classList.contains( 'foo' ) )
        })

        describe( 'toggle', () => {
          it( 'toggles on', () => {
            const { div } = Dom()

            div.classList.toggle( 'new' )

            assert( div.classList.contains( 'new' ) )
          })

          it( 'toggles off', () => {
            const { div } = Dom()

            div.classList.toggle( 'foo' )

            assert( !div.classList.contains( 'foo' ) )
          })

          it( 'forces on', () => {
            const { div } = Dom()

            div.classList.toggle( 'new', true )
            div.classList.toggle( 'foo', true )

            assert( div.classList.contains( 'new' ) )
            assert( div.classList.contains( 'foo' ) )
          })

          it( 'forces new off', () => {
            const { div } = Dom()

            div.classList.toggle( 'new', false )
            div.classList.toggle( 'foo', false )

            assert( !div.classList.contains( 'new' ) )
            assert( !div.classList.contains( 'foo' ) )
          })
        })
      })

      it( 'className', () => {
        const { div } = Dom()
        const newDiv = Tree.createElement( 'div' )

        assert.equal( div.className, 'foo baz qux' )
        assert.equal( newDiv.className, '' )

        div.className = 'foo bar baz'

        assert.equal( div.className, 'foo bar baz' )
      })

      it( 'dataset', () => {
        const div = Tree.createElement( 'div' )

        div.dataset.firstName = 'Nik'

        assert.equal( div.getAttribute( 'data-first-name' ), 'Nik' )

        div.setAttribute( 'data-last-name', 'Coughlin' )

        assert.equal( div.dataset.lastName, 'Coughlin' )
      })

      it( 'firstElementChild', () => {
        const { div2, span } = Dom()

        assert.equal( div2.firstElementChild, span )
      })

      it( 'id', () => {
        const { div, div2 } = Dom()

        assert.equal( div.id, 'myDiv' )
        assert.equal( div2.id, '' )

        div2.id = 'myDiv2'

        assert.equal( div2.id, 'myDiv2' )
      })

      it( 'innerHTML', () => {
        const { div2 } = Dom()

        assert.equal(
          div2.innerHTML,
          '<span class="bar"></span><strong class="bar"></strong><strong class="foo"></strong>hello'
        )

        div2.innerHTML = '<p>hello world</p>'

        assert.equal(
          div2.toString(),
          '<div><p>hello world</p></div>'
        )
      })

      it( 'lastElementChild', () => {
        const { div2, strong2 } = Dom()

        assert.equal( div2.lastElementChild, strong2 )
      })

      it( 'name', () => {
        const div1 = Tree.createElement( 'div', { name: 'foo' } )
        const div2 = Tree.createElement( 'div' )

        assert.equal( div1.name, 'foo' )
        assert.equal( div2.name, undefined )

        div2.name = 'bar'

        assert.equal( div2.name, 'bar' )
      })

      it( 'nextElementSibling', () => {
        const { span, strong } = Dom()

        assert.equal( span.nextElementSibling, strong )
      })

      it( 'outerHTML', () => {
        const { div2 } = Dom()

        const parent = div2.parentNode

        assert.equal( div2.outerHTML, div2.toString() )

        div2.outerHTML = '<p>Hello</p>'

        assert.equal( parent.innerHTML, '<p>Hello</p>' )
      })

      it( 'previousElementSibling', () => {
        const { span, strong } = Dom()

        assert.equal( strong.previousElementSibling, span )
      })

      it( 'tagName', () => {
        const div = Tree.createElement( 'div' )
        const text = Tree.createTextNode( 'hello' )

        assert.equal( div.tagName, 'div' )
        assert.equal( text.tagName, undefined )
      })

      it( 'title', () => {
        const { div } = Dom()
        const div2 = Tree.createElement( 'div' )

        assert.equal( div.title, 'bar' )
        assert.equal( div2.title, '' )

        div2.title = 'foo'
        assert.equal( div2.title, 'foo' )
      })
    })
  })

  describe( 'node', () => {
    describe( 'methods', () => {
      describe( 'cloneNode', () => {
        it( 'shallow', () => {
          const div = Tree.createElement( 'div' )
          const text = Tree.createTextNode( 'hello' )

          div.id = 'myDiv'
          div.appendChild( text )

          const clone = div.cloneNode()

          assert.equal( clone.toString(), '<div id="myDiv"></div>' )
          assert( div !== clone )
        })

        it( 'deep', () => {
          const div = Tree.createElement( 'div' )
          const text = Tree.createTextNode( 'hello' )

          div.id = 'myDiv'
          div.appendChild( text )

          const clone = div.cloneNode( true )

          assert.equal( clone.toString(), '<div id="myDiv">hello</div>' )
          assert( div !== clone )
        })
      })

      it( 'isEqualNode', () => {
        const div = Tree.createElement( 'div' )
        const text = Tree.createTextNode( 'hello' )

        div.id = 'myDiv'
        div.appendChild( text )

        const divClone = div.cloneNode( true )
        const textClone = text.cloneNode()

        assert( div.isEqualNode( divClone ) )
        assert( text.isEqualNode( textClone ) )
        assert( !div.isEqualNode( text ) )
      })

      it( 'isSameNode', () => {
        const div = Tree.createElement( 'div' )
        const divClone = div.cloneNode( true )

        assert( div.isSameNode( div ) )
        assert( !div.isSameNode( divClone ) )
      })

      it( 'normalize', () => {
        const div = Tree.createElement( 'div' )
        const span = Tree.createElement( 'span' )

        div.appendChild( span )

        const text = Tree.createTextNode( 'hello' )
        const text2 = Tree.createTextNode( '' )
        const text3 = Tree.createTextNode( ' ' )
        const text4 = Tree.createTextNode( '' )
        const text5 = Tree.createTextNode( 'world' )

        span.append( text, text2, text3, text4, text5 )

        const text6 = Tree.createTextNode( '' )

        div.append( text6 )

        div.normalize()

        assert.equal( div.childNodes.length, 1 )
        assert.equal( span.childNodes.length, 1 )
        assert.equal( span.firstChild.nodeValue, 'hello world' )
      })

      it( 'toString', () => {
        const div = Tree.createElement( 'div' )

        assert.equal( div.toString(), '<div></div>' )
      })

      it( 'whitespace', () => {
        const dom = Tree.parse( '    <div>    \n</div>\r\n\t  ' )

        dom.whitespace({ normalizeWhitespace: true })

        assert.equal( dom.toString(), ' <div> </div> ' )
      })
    })

    describe( 'properties', () => {
      it( 'baseURI', () => {
        const div = Tree.createElement( 'div' )

        assert.equal( div.baseURI, '/' )
      })

      it( 'innerText', () => {
        const div = Tree.createElement( 'div' )
        const span = Tree.createElement( 'span' )
        const text = Tree.createTextNode( 'hello' )

        div.appendChild( span )
        span.appendChild( text )

        assert.equal( div.innerText, 'hello' )

        div.innerText = 'world'

        assert.equal( div.childNodes.length, 1 )
        assert( div.firstChild.isTextNode() )
        assert.equal( div.firstChild.nodeValue, 'world' )
      })

      it( 'nodeName', () => {
        const div = Tree.createElement( 'div' )

        assert.equal( div.nodeName, 'div' )
      })

      it( 'nodeValue', () => {
        const text = Tree.createTextNode( 'hello' )

        assert.equal( text.nodeValue, 'hello' )
      })

      it( 'ownerDocument', () => {
        const document = Tree.createDocument()
        const div = Tree.createElement( 'div' )

        document.appendChild( div )

        assert.equal( div.ownerDocument, document )
      })

      it( 'parentElement', () => {
        const div = Tree.createElement( 'div' )
        const text = Tree.createTextNode( 'hello' )

        div.appendChild( text )

        assert.equal( text.parentElement, div )
        assert.equal( div.parentElement, null )
      })

      it( 'textContent', () => {
        const div = Tree.createElement( 'div' )
        const span = Tree.createElement( 'span' )
        const text = Tree.createTextNode( 'hello' )

        div.appendChild( span )
        span.appendChild( text )

        assert.equal( div.textContent, 'hello' )

        div.textContent = 'world'

        assert.equal( div.childNodes.length, 1 )
        assert( div.firstChild.isTextNode() )
        assert.equal( div.firstChild.nodeValue, 'world' )
      })
    })
  })

  describe( 'statics', () => {
    describe( 'parse', () => {
      it( 'comment', () => {
        const comment = Tree.parse( '<!-- hello -->' )

        assert( comment.isCommentNode() )
      })

      it( 'doctype', () => {
        const doctype = Tree.parse( '<!doctype html>' )

        assert( doctype.isDocumentTypeNode() )
      })

      it( 'processing instruction', () => {
        const pi = Tree.parse( '<?hello world ?>' )

        // todo
        assert( pi.isCommentNode() )
      })
    })

    describe( 'h', () => {
      it( 'h', () => {
        const { h } = Tree

        const {
          document, documentType, documentFragment, text, comment,
          element
        } = h

        const docType = documentType( 'silly' )
        const div = element(
          'div',
          { id: 'myBox' },
          text( 'delicious ' ),
          'cheese'
        )

        const doc = document(
          docType,
          documentFragment(
            comment( 'so silly' ),
            div
          )
        )

        const expect = '<!doctype silly><!--so silly--><div id="myBox">delicious cheese</div>'

        assert.equal( doc.toString(), expect )
      })
    })
  })
})

const testHFactory = () => {
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
            p( 'hi' ),
            span(
              text( 'delicious ' ),
              'cheese'
            )
          )
        )
      )

      const expect = '<!doctype html><!--so silly--><div id="myDiv"><p>hi</p><span>delicious cheese</span></div>'

      assert.equal( doc.stringify(), expect )
    })

    it( 'pretty', () => {
      const Html = require( '@mojule/html' )

      const isInline = node => {
        return {
          isInline: () => Html.isInline( node.tagName() ),
          isEmpty: () => Html.isEmpty( node.nodeName() )
        }
      }

      const Tree = Factory( plugins.concat( isInline ) )

      const h = Tree.H()

      const {
        document, documentType, html, head, meta, title, body, style, script,
        pre, textarea, documentFragment, text, comment, div, p, span, strong
      } = h

      const doc = document(
        documentType( 'html' ),
        html(
          head(
            meta( { charset: 'utf-8' } ),
            title( 'Hello' ),
            style( '\n    /*  style  */\n    ' )
          ),
          body(
            documentFragment(
              comment( 'so silly' ),
              div(
                { id: 'myDiv' },
                p( 'hi' ),
                p(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
                  strong( 'Suspendisse suscipit molestie dui' ),
                  ', eu volutpat ex posuere sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus.'
                ),
                span(
                  text( 'delicious ' ),
                  'cheese'
                ),
                textarea( '  Hello\n\n' )
              )
            ),
            script( '/*   script   */' )
          )
        )
      )

      const expect = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello</title>
    <style>
    /*  style  */
    </style>
  </head>
  <body>
    <!--so silly-->
    <div id="myDiv">
      <p>hi</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <strong>Suspendisse suscipit molestie dui</strong>, eu volutpat ex
        posuere sit amet. Interdum et malesuada fames ac ante ipsum primis in
        faucibus.
      </p>
      <span>delicious cheese</span>
      <textarea>  Hello

</textarea>
    </div>
    <script>/*   script   */</script>
  </body>
</html>
`

      assert.equal( doc.stringify( { pretty: true } ), expect )

      const textOnly = text( 'Hello World!' )

      assert.equal( textOnly.stringify( { pretty: true } ), 'Hello World!\n' )
    })
  })
}