import { isObj, isStr, isArr } from 'jsutils'

/**
 * Gets the catalog props based on an ID
 * @param {Object} catalog - Lookup table for cascade nodes
 * @param {string} id - ID property of the cascade node
 *
 * @returns {Object} - Catalog props
 */
export const getCatalogProps = (catalog, id) => {
  return isObj(catalog) && isStr(id) && catalog[id]
}

/**
 * Gets the component key
 * @param {Object} catalog - Lookup table for cascade nodes
 * @param {string} id - ID of the cascade node
 *
 * @returns {string}
 */
export const getAltRender = (catalog, id) => {

  // Get catalogProps based on the id
  const catalogProps = getCatalogProps(catalog, id)

  // Get the key || altRender from the catalogProps
  return isObj(catalogProps) && (catalogProps.altRender || catalogProps.render)
}