'use strict'

const createTextNode = ({ statics }) => {
  // the DOM is inconsistent on this :/
  statics.createTextNode = text => statics.createText( text )
}

module.exports = createTextNode
