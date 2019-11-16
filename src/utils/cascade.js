import { get, isObj, isStr, isArr, deepMerge, softFalsy } from 'jsutils'

/**
 * Finds the ID of a cascade node from the identity and cascade pos
 * Uses the parents pos, plus the cascade nodes pos in the parents children array
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} parent - Cascade nodes parent data
 * @param {Object} parent.node - Parent cascade node
 * @param {Object} parent.parent - Parent object of the parent cascade node
 * @param {Object} parent.props - Props object of the parent cascade node
 * @param {Object} identity - Maps position to and id, and visa versa
 * 
 * @return {string} Found the Id from the cascade node position in the identity
 */
export const getIdentityId = (cascade, parent, identity={}) => {
  if(!isObj(parent) || !isObj(cascade)) return
  
  // Get the parent pos, and the parent cascade node
  const { props: { pos: parentPos }, node } = parent

  if(!isObj(node) || !isStr(parentPos))
    return console.warn(`Cascade node parent does not exist!`, parent, cascade)

  // position of the cascade within the children === the pos of the cascade node
  const pos = node[2].indexOf(cascade)

  // There should always be a pos, because the cascade should always be a child of the parent
  return softFalsy(pos)
    ? identity[`${parentPos}.2.${pos}`]
    : console.warn(`Cascade node pos not found!`, parent, cascade)

}

/**
 * Builds the props of a cascade node
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} metadata.catalog - Lookup table for cascade nodes
 * @param {Object} metadata.styles - Styles by size for cascade nodes
 * @param {Object} metadata.identity - Maps position to and id, and visa versa
 * @param {Object} parent - Cascade nodes parent data
 * @param {Object} parent.node - Parent cascade node
 * @param {Object} parent.parent - Parent object of the parent cascade node
 * @param {Object} parent.props - Props object of the parent cascade node
 *
 * @returns {Object} - Built cascade node props
 */
export const buildCascadeProps = (cascade, metadata, parent) => {
  // Get the props directly on the cascade node
  const inlineProps = get(cascade, [ '1' ], {})
  
  // Get the identity and catalog from finding the cascade node metadata
  const { identity, catalog } = metadata

  // Get the id for the cascade, if no Id in the props, try to get the id from the position
  const cascadeId = findCascadeId(cascade, identity, inlineProps, parent)

  // If no id on the inline props, then no way to get metadata props || parent props
  // If there is an id, get the metadata && parent props
  return !cascadeId
    ? inlineProps
    : deepMerge(
        get(parent, [ 'props', 'children', cascadeId ]),
        catalog[cascadeId],
        inlineProps
      )
}

/**
 * Gets the ID of a cascade node from the passed in id || cascade node || props
 * @param {Object} cascade - Node describing a UI element
 * @param {Object} props - properties of the cascade node
 * @param {string} id - ID property of the cascade node
 *
 * @returns {string} - ID of the cascade node
 */
export const getCascadeId = (cascade, props, id) => (
  id || get(props, [ 'id' ], get(cascade, [ '1', 'id' ]))
)

/**
 * Tries to find the cascade id from the cascade || props || position
 * @param {Object} cascade - Node describing a UI element
 * @param {Object} identity - Maps position to and id, and visa versa
 * @param {Object} props - properties of the cascade node
 * @param {Object} parent - Cascade nodes parent data
 * @param {Object} parent.node - Parent cascade node
 * @param {Object} parent.parent - Parent object of the parent cascade node
 * @param {Object} parent.props - Props object of the parent cascade node
 *
 * @returns {string} - ID of the cascade node
 */
export const findCascadeId = (cascade, identity, props, parent) => (
  getCascadeId(cascade, props) || getIdentityId(cascade, parent, identity)
)