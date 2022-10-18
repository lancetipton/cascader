/** @module Cascader */
import type { ReactNode } from 'react'
import type {
  TCascade,
  TNodeProps,
  TReactComp,
  TCascadeNode,
  TCascadeItem,
  TCascadeMeta,
  TCatalogProps,
} from '../types'


import { useEffect, createElement } from 'react'
import { findComponent, getCached, addCached } from '../register'
import { buildCascadeProps, updateCatalogProps, buildConfig } from '../utils'
import { isObj, isArr, isFunc, eitherObj, isColl, get, checkCall } from '@keg-hub/jsutils'

/**
 * Gets a component from cache or tries to find it in the registered components
 * <br> Also add to cache when a component is found, and the node has an id
 */
const getComponent = (
  cascade:TCascadeNode,
  metadata:TCascadeMeta,
  props:TNodeProps,
  parent:TNodeProps
) => {
  const { catalog, buildCatalog } = metadata
  const { id } = props

  // Check if the comp is cached
  const CachedComp = id && getCached(id)

  // If no cached comp, Try to find it
  const FoundComp = CachedComp || findComponent(cascade, props, metadata, parent)

  // Cache the found component which should make next render faster
  // Add cached component if there's no cached component and a function component was found
  id && !CachedComp && isFunc(FoundComp) && addCached(id, FoundComp)
  
  // Update the catalog with update props when an id exists and buildCatalog === true
  id && buildCatalog && updateCatalogProps(
    eitherObj<TCatalogProps, TCatalogProps>(catalog[id], {} as TCatalogProps),
    props,
    metadata
  )

  // Return the found component
  return FoundComp as TReactComp
}

/**
 * Creates a React component by calling the React.createElement method
 */
const getRenderEl = (
  cascade:TCascadeNode,
  metadata:TCascadeMeta,
  props:TNodeProps,
  parent:TNodeProps
):ReactNode => {

  // Create the react version of the element
  return createElement(
    // Get the component to use, either a string || React function component
    getComponent(cascade, metadata, props, parent),
    props,
    // Render the children of the cascade node
    renderCascade(
      cascade[2],
      metadata,
      { cascade, parent, props }
    )
  )
}

/**
 * Builds a single cascade node and returns it, or null if node can not be built
 */
const buildCascadeNode = (
  cascade:TCascadeNode,
  metadata:TCascadeMeta,
  parent:TNodeProps
) => {

  // If no cascade, or no type, return null
  return !cascade || !cascade[0]
    ? null
    : getRenderEl(
        cascade,
        metadata,
        // Build the props for the cascade node
        eitherObj(buildCascadeProps(cascade, metadata, parent), {}),
        parent
      )
}

/**
 * Loops an array, calling renderCascade on each element
 */
const loopCascadeArray = (
  cascade:TCascadeNode[],
  metadata:TCascadeMeta,
  parent:TNodeProps
):ReactNode[] => {
  // Cache the current pos, because we update metadata in place
  // This keeps the correct pos for each child of the cascade
  const curPos = metadata.pos

  return cascade.map((child, index) => {
    // Update the pos for the child node
    metadata.pos = `${curPos}.2.${index}`

    return renderCascade(child, metadata, parent)
  })
}

/**
 * Recursively converts cascade to React.createElement
 * @function
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} parent - Cascade nodes parent data
 *
 * @return {Object} rendered React vDom elements
 */
const renderCascade = (
  cascade:TCascadeNode|TCascadeItem,
  metadata:TCascadeMeta,
  parent:TNodeProps
):ReactNode => {
  // If not a collection, it should just return the value
  return !isColl(cascade)
    ? cascade
    // If first element is Loading, return null
    // Helper for returning when an element needs to wait due to loading
    : cascade[0] === metadata.isLoading
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
 * <br> Validates passed in props, and logs warning when they are incorrect
 */
export const Cascader = (props:TCascade) => {

  // Ensure a cascade object exists
  if(!isObj(props) || !isColl(props.cascade)){
    console.warn(`Cascader requires a cascade object as a prop!`, props)
    return null
  }

  if(props.catalog && !isObj(props.catalog)){
    console.warn(`Cascader requires the catalog prop to be an object or falsy!`, props)
    return null
  }

  if(props.events && !isObj(props.events)){
    console.warn(`Cascader requires the events prop to be an object or falsy!`, props)
    return null
  }

  // Join the passed in config with the default config
  const config = buildConfig(props.config)

  const metadata:TCascadeMeta = {
    catalog: isObj(props.catalog) && props.catalog || {},
    styles: props.styles,
    events:  props.events,
    config: config,
    // Cache the CASCADE_LOADING value, so we don't have to look it up each time
    isLoading: get(config, [ 'constants', 'CASCADE_LOADING' ]),
    // Check if the catalog should be built while rendering
    // If there is a getCatalog method, and
    // The config.catalog.build options is not set to false
    buildCatalog: props.getCatalog && get(config, [ 'catalog', 'build' ]) !== false,
    // Default position of the root cascade node
    pos: '0',
  }

  // If a getCatalog is passed in
  // Add the useEffect to call the callback after render
  props.getCatalog && useEffect(() => checkCall(props.getCatalog, metadata.catalog))

  // Render the Cascade
  return renderCascade(props.cascade, metadata, eitherObj(props.parent, {}))

}