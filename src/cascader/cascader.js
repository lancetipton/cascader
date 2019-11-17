import React from 'react'
import { isObj, isArr, eitherObj, isColl } from 'jsutils'
import { getRegisteredComponent } from '../register'
import { buildCascadeProps } from '../utils'

/**
 * Creates a React component by calling the React.createElement method
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} metadata.catalog - Lookup table for cascade nodes
 * @param {Object} metadata.styles - Styles by size for cascade nodes
 * @param {Object} metadata.identity - Maps position to and id, and visa versa
 * @param {Object} props - Cascade nodes props
 * @returns {React Component}
 */
const getRenderEl = (cascade, metadata, props, parent) => (
  React.createElement(
    getRegisteredComponent(cascade, metadata, props, parent) || cascade[0],
    props,
    renderCascade(children, metadata, { cascade, parent, props })
  )
)

/**
 * Recursively converts cascade to React.createElement
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} metadata.catalog - Lookup table for cascade nodes
 * @param {Object} metadata.styles - Styles by size for cascade nodes
 * @param {Object} metadata.identity - Maps position to and id, and visa versa
 * @param {Object} parent - Cascade nodes parent data
 * @param {Object} parent.cascade - Parent cascade node
 * @param {Object} parent.parent - Parent object of the parent cascade node
 * @param {Object} parent.props - Props object of the parent cascade node
 *
 * @return {Object} rendered React vDom elements
 */
const renderCascade = (cascade, metadata, parent) => {

  // not a collection should just return the value
  if(!isColl(cascade)) return cascade
  
  // If first element is just Loading, reutrn null
  if (cascade[0] === 'CASCADE_LOADING') return null
  
  // Get the element to be rendered, and return it
  return isArr(cascade)
    ? cascade.map(child => render(child, metadata, parent))
    : cascade[0] && getRenderEl(
        cascade,
        metadata,
        buildCascadeProps(cascade, metadata, parent),
        parent
      )

}

export const Cascader = props => {

  // Ensure a cascade object exists
  if(!isObj(props) || !isObj(props.content)){
    console.warn(`Cascader requires a content object as a prop!`, props)
    return null
  } 

  // Render the Cascade
  return renderCascade(
    props.content,
    {
      catalog: eitherObj(props.catalog, {}),
      styles: eitherObj(props.styles, {}),
      identity: eitherObj(props.identity, {}),
    },
    eitherObj(props.parent, {})
  )

}