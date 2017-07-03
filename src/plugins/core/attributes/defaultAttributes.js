'use strict'

const defaultAttributes = ({ core }) => {
  core.registerAttribute({
    name: 'class',
    propertyName: () => 'className',
    parse: str => str.split( ' ' ),
    toString: value => value.join( ' ' )
  })
}

module.exports = defaultAttributes
