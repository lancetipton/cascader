import React, { useEffect } from 'react'
import { isObj, isArr, isFunc, isStr, eitherObj, isColl, get, checkCall, deepClone } from 'jsutils'
import { findComponent, getCached, addCached } from '../register'
import { buildCascadeProps, updateCatalogProps } from '../utils'

/**
 * Creates a React component by calling the React.createElement method
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} metadata.catalog - Lookup table for cascade nodes
 * @param {Object} metadata.styles - Styles by size for cascade nodes
 * @param {Object} props - Cascade nodes props
 * @returns {React Component}
 */
const getRenderEl = (cascade, metadata, props, parent) => {
  const { catalog } = metadata

  // Try to find the component
  const FoundComp = findComponent(cascade, props, catalog, parent)
  
  // Add cached component if there's an ID and a function component if found
  if(props.id){
    // Cache the found component which should make next render fater
    isFunc(FoundComp) && addCached(props.id, FoundComp)

    // Update the catalogProps if needed
    updateCatalogProps(eitherObj(catalog[props.id], {}), props, metadata)
  }

  // Create the react version of the element
  return React.createElement(
    FoundComp,
    props,
    renderCascade(cascade[2], metadata, { cascade, parent, props })
  )
}

/**
 * Builds a single cascade node and returns it, or null if node can not be built
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} parent - Cascade nodes parent data
 *
 * @return {Object} React vDom element
 */
const buildCascadeNode = (cascade, metadata, parent) => {

  // If no cascade, or not type, return null
  if(!cascade || !cascade[0]) return null

  // Build the props for the cascade node
  const props = buildCascadeProps(cascade, metadata, parent) || {}

  return props.id && getCached(props.id) || getRenderEl(
    cascade,
    metadata,
    props,
    parent
  )
}

/**
 * Loops an array, calling renderCascade on each element
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} parent - Cascade nodes parent data
 *
 * @return {Array} rendered React vDom elements
 */
const loopCascadeArray = (cascade, metadata, parent) => {
  const curPos = metadata.pos
  return cascade.map((child, index) => {
    metadata.pos = `${curPos}.2.${index}`

    return renderCascade(child, metadata, parent)
  })
}

/**
 * Recursively converts cascade to React.createElement
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} parent - Cascade nodes parent data
 *
 * @return {Object} rendered React vDom elements
 */
const renderCascade = (cascade, metadata, parent) => {
  // If not a collection, it should just return the value
  return !isColl(cascade)
    ? cascade
    // If first element is Loading, return null
    // Helper for returning when an element needs to wait due to loading
    : cascade[0] === 'CASCADE_LOADING'
      ? null
      : isArr(cascade)
        // Get the element to be rendered, and return it
        // Check if cascade is an array
        // Recursively loop and render the elements of the ray
        ? loopCascadeArray(cascade, metadata, parent)
        : buildCascadeNode(cascade, metadata, parent)
}

/**
 * Kicks off the cascade render
 * <br> Ensures all needed props exist
 * @param {Object} props - component props passed from the consumer
 * @param {Object} props.cascade - The cascade tree render
 * @param {Object} props.catalog - Lookup table for cascade nodes
 * @param {Object} props.styles - Styles by size for cascade nodes
 *
 * @returns {React Component} - React component tree of the passed in cascade
 */
export const Cascader = props => {

  // Ensure a cascade object exists
  if(!isObj(props) || !isColl(props.cascade)){
    console.warn(`Cascader requires a cascade object as a prop!`, props)
    return null
  }

  if(props.catalog && !isObj(props.catalog)){
    console.warn(`Cascader requires the catalog prop to be an object or falsy!`, props)
    return null
  }

  const metadata = {
    catalog: isObj(props.catalog) && props.catalog || {},
    styles: props.styles,
    pos: '0',
  }

  // If a getCatalog is passed in
  // Add the useEffect to call the callback after render
  props.getCatalog && useEffect(() => checkCall(props.getCatalog, metadata.catalog))

  // Render the Cascade
  return renderCascade(props.cascade, metadata, eitherObj(props.parent, {}))

}