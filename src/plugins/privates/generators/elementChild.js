'use strict'

const elementChild = ({ privates, state, core, Api }) => {
  privates.elementChild = function*(){
    const { getApi } = core
    let current = state.firstChild

    while( current ){
      if( current.value.nodeType === Api.ELEMENT_NODE )
        yield getApi( current )

      current = current.nextSibling
    }
  }

  privates.registerGenerator( 'elementChild' )
}

module.exports = elementChild
