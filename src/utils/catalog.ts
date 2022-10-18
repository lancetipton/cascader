/** @module Utils */

import type {
  TNodeProps,
  TMetaLookup,
  TMetaCatalog,
  TCascadeMeta,
  TCascadeNode,
  TCatalogProps,
} from '../types'


import { isObj, isStr, isArr, uuid } from '@keg-hub/jsutils'

/**
 * Gets the catalog props based on an ID
 */
export const getCatalogProps = (
  catalog:TMetaCatalog,
  id:string
):TCatalogProps => {

  if(!isObj(catalog) || !isStr(id)){
    console.warn(`getCatalogProps requires a catalog object, and an id!`, catalog, id)
    return
  }

  return catalog[id]
}

/**
 * Updated the catalogProps ID and position (pos)
 */
export const updateCatalogProps = (
  catalogProps:TCatalogProps,
  props:TNodeProps,
  metadata: TCascadeMeta
) => {
  const { pos, catalog } = metadata

  // Set the id if it does not exist, or it's incorrect
  props.id && (!catalogProps.id || catalogProps.id !== props.id) &&
    (catalogProps = { ...catalogProps, id: props.id })

  // Check the pos, and update it if needed
  isStr(pos) && pos !== catalogProps.pos &&
    (catalogProps = { ...catalogProps, pos }) 

  // If the props are not euqal that means there was an update,
  // So set the new props to the catalog
  catalog[props.id] !== catalogProps &&
    (metadata.catalog = { ...catalog, [props.id]: catalogProps })

}

/**
 * Gets the component key
 * @function
 * @param {Object} catalog - Lookup table for cascade nodes
 * @param {string} id - ID of the cascade node
 * @param {Object} lookup - Config options for how to lookup the render key
 *
 * @returns {string} - Type of component to render (div / img ) || ( React Component )
 */
export const getAltRender = (
  catalog:TMetaCatalog,
  id:string,
  lookup?:TMetaLookup
) => {
  lookup = { key: 'altRender', altKey: 'render', ...(lookup || {}) }
  // Get catalogProps based on the id
  const catalogProps = getCatalogProps(catalog, id)

  // Get the render key || altKey from the catalogProps
  return isObj(catalogProps) && (catalogProps[lookup.key] || catalogProps[lookup.altKey])

}

/**
 * Builds the catalog props for a cascade node
 * @param {Object} [props={}] - Props from the cascade node
 * @param {boolean} [allProps=false] - Should include all props from the cascade node
 * @param {string} parentPos - Parents nodes position in the cascade
 * @param {string|number} index - current location of the node within the parents children
 *
 * @returns {Object} - Built catalogProps for the cascade node
 */
const buildCatalogProps = (
  props:TNodeProps={},
  allProps=false,
  parentPos:string,
  index:string|number
) => {

  // Ensure it has an ID
  const id = (props.id || uuid()) as string

  // Build the position based on the parent and the index
  const pos = parentPos !== 'ROOT_POS'
    ? `${parentPos}.2.${ index || 0 }`
    : '0'
  
  // Return the built props
  return {
    id,
    // Ensure a key exists
    key: props.key || id,
    // Check if all props from the cascade node should be added
    ...(allProps && props || {}),
    pos
  }
}

/**
 * Recursively builds the catalog object, keeping track of the position of the cascade
 * @param {Object} cascade - Cascade node to build the catalog from
 * @param {boolean} allProps - Should include all props from the cascade node
 * @param {Object} metaData - Holds the catalog, and cascade position info
 *
 * @returns {Object} - Built catalog object
 */
const buildCatalog = (
  cascade:TCascadeNode|TCascadeNode[]|string,
  allProps:boolean,
  { catalog, parentPos, index }:TCascadeMeta
) => {

  if(isObj<TCascadeNode>(cascade)){
    // Build the props for the cascade node
    const props = buildCatalogProps(cascade[1] || {}, allProps, parentPos, index)
    // Add the props to the catalog
    catalog[props.id] = props
    // Build the catalog props for any children of the cascade node
    buildCatalog(cascade[2], allProps, { catalog, parentPos: props.pos })
  }

  // If it's an array, loop over the array and build the catalog for each node
  else if(isArr<TCascadeNode[]>(cascade))
    cascade.forEach((node, idx) => buildCatalog(
      node,
      allProps,
      { catalog, parentPos, index: idx }
    ))

  // Return the built catalog
  return catalog
}

/**
 * Wrapper around buildCatalog, so the catalog object is managed internally
 * @param {Object} cascade - Root cascade node to build the catalog from
 * @param {boolean} allProps - Should include all props from the cascade node
 *
 * @returns {Object} - Built catalog object
 */
export const catalogFromCascade = (
  cascade:TCascadeNode|TCascadeNode[]|string,
  allProps:boolean,
) => {
  return buildCatalog(cascade, allProps, { catalog: {}, parentPos: 'ROOT_POS' })
}