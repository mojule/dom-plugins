'use strict'

const appendChild = ({ api, state, core }) => {
  const { appendChild } = api

  api.appendChild = child => {
    child = appendChild( child )

    if( child.parentNode && child.isDocumentFragmentNode() )
      child.unwrap()

    return child
  }
}

module.exports = appendChild
