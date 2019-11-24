import { get, isObj, isStr, isArr, deepMerge, softFalsy } from 'jsutils'


/**
 * Builds the props of a cascade node
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} parent - Cascade nodes parent data
 *
 * @returns {Object} - Built cascade node props
 */
export const buildCascadeProps = (cascade, metadata, parent) => {
  // Get the props directly on the cascade node
  const inlineProps = get(cascade, [ '1' ], {})

  // Get the identity and catalog from finding the cascade node metadata
  const { identity, catalog } = metadata

  // Get the id for the cascade, if no Id in the props, try to get the id from the position
  const cascadeId = getCascadeId(cascade, inlineProps)

  // If no id on the inline props, then no way to get metadata props || parent props
  // If there is an id, get the metadata && parent props
  const cascadeProps = !cascadeId
    ? inlineProps
    : deepMerge(
        get(parent, [ 'props', 'children', cascadeId ]),
        catalog[cascadeId],
        inlineProps
      )

  // Ensure a key is added to the props, use either the ID or the pos
  // If not other key can be used, use the pos from the metadata
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos
  
  return cascadeProps
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
  (isStr(id) && id) ||
  (isObj(cascade) && (
    get(cascade, [ '1', 'id' ]) ||
    !props && get(cascade, [ 'id' ]))
  ) ||
  get(props, [ 'id' ])
)