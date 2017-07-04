'use strict'

const elementChild = ({ privates, state, core }) => {
  privates.elementChild = function*(){
    const { getApi } = core
    let current = state.firstChild

    while( current ){
      if( current.isElementNode() )
        yield getApi( current )

      current = current.nextSibling
    }
  }

  privates.registerGenerator( 'elementChild' )
}

module.exports = elementChild
