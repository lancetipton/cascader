import { isObj, isStr, isArr } from 'jsutils'

/**
 * Gets the catalog props based on an ID
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
 * Gets the component key
 * @param {Object} catalog - Lookup table for cascade nodes
 * @param {string} id - ID of the cascade node
 *
 * @returns {string} - Type of component to render ( Native ( div / img ) || custom ( React Component ) )
 */
export const getAltRender = (catalog, id) => {

  // Get catalogProps based on the id
  const catalogProps = getCatalogProps(catalog, id)

  // Get the altRender || render from the catalogProps
  return isObj(catalogProps) && (catalogProps.altRender || catalogProps.render)

}