/** @module Utils */

import { isObj, isStr, isArr } from 'jsutils'

/**
 * Gets the catalog props based on an ID
 * @function
 * @param {Object} catalog - Lookup table for cascade nodes
 * @param {string} id - ID property of the cascade node
 *
 * @returns {Object} - Catalog props
 */
export const getCatalogProps = (catalog, id) => {
  return !isObj(catalog) || !isStr(id)
    ? console.warn(`getCatalogProps requires a catalog object, and an id!`, catalog, id)
    : catalog[id]
}

/**
 * Updated the catalogProps ID and position (pos)
 * @function
 * @param {Object} catalogProps - catalogProps of the node
 * @param {Object} props - props passed to node when rendering
 * @param {string} pos - The position of the node in the cascade when it was rendered
 *
 * @returns {Object} - Updated catalogProps
 */
export const updateCatalogProps = (catalogProps, props, metadata) => {
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
export const getAltRender = (catalog, id, lookup={}) => {
  lookup = { key: 'altRender', altKey: 'render', ...lookup }
  // Get catalogProps based on the id
  const catalogProps = getCatalogProps(catalog, id)

  // Get the render key || altKey from the catalogProps
  return isObj(catalogProps) && (catalogProps[lookup.key] || catalogProps[lookup.altKey])

}