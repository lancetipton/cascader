import { cascadeModel } from './cascadeModel'
import { get } from 'jsutils'

const { cascade, catalog } = cascadeModel

/**
 * Gets and builds the parent object used in the recursive cascade call
 * @param {string} pos - cacade position of the node to get from the cascadeModel
 *
 * @returns {Object} - cascade node at the pos position
 */
const buildParent = pos => {
  const parentNode = get(cascade, pos)
  const parentId = get(parentNode, '1.id')
  return { cascade: parentNode, props: { ...catalog[parentId], ...parentNode[1] }, parent: {} }
}

/**
 * Helper to override a console function
 * @param {string} type - type of console function to override
 *
 * @returns {function} - helper to reset the console override
 */
const consoleOverride = type => {
  const oldType = console[type]
  console[type] = jest.fn()
  return () => console[type] = oldType
}

export {
  buildParent,
  consoleOverride
}