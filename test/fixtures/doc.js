'use strict'

module.exports = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello, world!</title>
    <style>
html {
  box-sizing: border-box;
  font-family: sans-serif;
}

*, *:before, *:after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  background: #fff;
  color: #000;
  overflow-y: scroll;
}
    </style>
  </head>
  <body>
    <header>
      <h1>Hello, world!</h1>
      <nav>
        <ul>
          <li>Hello</li>
          <li>World</li>
        </ul>
      </nav>
    </header>
    <main>
      <h1>The World</h1>
      <p>Short Text</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        suscipit molestie dui, eu volutpat ex posuere sit amet. Interdum et
        malesuada fames ac ante ipsum primis in faucibus.
      </p>
      <p>
        Lorem <strong>ipsum dolor</strong> sit amet, consectetur adipiscing
        elit. Suspendisse suscipit molestie dui, eu volutpat ex posuere sit
        amet. Interdum et malesuada fames ac ante ipsum primis in faucibus.
      </p>
      <textarea>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse suscipit molestie dui, eu volutpat ex posuere sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus.</textarea>
    </main>
    <footer>
      <p>© 2017 Acme Corp</p>
    </footer>
    <script>
      'use strict'

      const is = require( '@mojule/is' )

      const ensureName = name => {
        if( !is.string( name ) || name.trim() === '' )
          throw new Error( 'Class name should be a non-empty string' )
      }

      const classes = node => {
        return {
          classNames: () => {
            const classAttr = node.getAttr( 'class' )

            if( is.string( classAttr ) )
              return classAttr.split( ' ' ).map( s =>
                s.trim()
              ).filter( s => s !== '' )

            return []
          },
          addClass: name => {
            ensureName( name )

            const classNames = node.classNames()

            classNames.push( name.trim() )

            node.setAttr( 'class', classNames.join( ' ' ) )

            return node
          },
          hasClass: name => node.classNames().includes( name ),
          addClasses: ( ...names ) => {
            if( names.length === 1 && is.array( names[ 0 ] ) )
              names = names[ 0 ]

            names.forEach( node.addClass )

            return node
          },
          removeClass: name => {
            ensureName( name )

            const classNames = node.classNames().filter( n => n !== name.trim() )

            node.setAttr( 'class', classNames.join( ' ' ) )

            return node
          },
          toggleClass: ( name, shouldHave ) => {
            ensureName( name )

            name = name.trim()

            const alreadyHas = node.hasClass( name )

            if( is.undefined( shouldHave ) )
              return node.toggleClass( name, !alreadyHas )

            if( alreadyHas ){
              if( shouldHave )
                return node

              return node.removeClass( name )
            }

            if( shouldHave )
              return node.addClass( name )

            return node
          },
          clearClasses: () => {
            node.setAttr( 'class', '' )

            return node
          }
        }
      }

      module.exports = classes
    </script>
  </body>
</html>
`