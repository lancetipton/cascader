import { cascadeModel, buildParent, consoleOverride } from '../../mocks'
import { get, deepClone } from 'jsutils'

const { cascade, catalog, identity, styles } = cascadeModel

const Cascade = require('../cascade')

describe('/cascade', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('buildCascadeProps', () => {

    it('should return the joined props of from the catalog and node', () => {
      
      const catalogCopy = deepClone(catalog)
      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')
      node[1].inlineTest = `INLINE PROP`
      catalogCopy[ node[1].id ].catalogTest = `CATALOG PROP`
      const builtProps = Cascade.buildCascadeProps(node, { identity, catalog: catalogCopy }, parent)

      expect(builtProps.inlineTest === `INLINE PROP`).toBe(true)
      expect(builtProps.catalogTest === `CATALOG PROP`).toBe(true)

    })

    it('should join the props from the parent catalogProps.children[id] when it exists', () => {

      const catalogCopy = deepClone(catalog)
      const parent = buildParent('2.0')
      const node = deepClone(get(cascade, '2.0.2.0'))
      node[1].inlineTest = `INLINE PROP`
      catalogCopy[ node[1].id ].catalogTest = `CATALOG PROP`
      parent.props.children = { [ node[1].id ]: { parentTest: `PARENT PROP` } }
      
      const builtProps = Cascade.buildCascadeProps(node, { identity, catalog: catalogCopy }, parent)
      
      expect(builtProps.parentTest === `PARENT PROP`).toBe(true)
      expect(builtProps.inlineTest === `INLINE PROP`).toBe(true)
      expect(builtProps.catalogTest === `CATALOG PROP`).toBe(true)

    })


    it('should have the catalogProps override the parentProps', () => {

      const catalogCopy = deepClone(catalog)
      const parent = buildParent('2.0')
      const node = deepClone(get(cascade, '2.0.2.0'))
      catalogCopy[ node[1].id ].overRideTest = `CATALOG PROP`
      parent.props.children = { [ node[1].id ]: { overRideTest: `PARENT PROP` } }
      
      const builtProps = Cascade.buildCascadeProps(node, { identity, catalog: catalogCopy }, parent)
      
      expect(builtProps.overRideTest === `CATALOG PROP`).toBe(true)

    })


    it('should have the inlineProps override the catalogProps', () => {

      const catalogCopy = deepClone(catalog)
      const parent = buildParent('2.0')
      const node = deepClone(get(cascade, '2.0.2.0'))
      node[1].overRideTest = `INLINE PROP`
      catalogCopy[ node[1].id ].overRideTest = `CATALOG PROP`

      const builtProps = Cascade.buildCascadeProps(node, { identity, catalog: catalogCopy }, parent)

      expect(builtProps.overRideTest === `INLINE PROP`).toBe(true)

    })

    it('should have the inlineProps override the parentProps', () => {

      const catalogCopy = deepClone(catalog)
      const parent = buildParent('2.0')
      const node = deepClone(get(cascade, '2.0.2.0'))
      node[1].overRideTest = `INLINE PROP`
      catalogCopy[ node[1].id ].overRideTest = `CATALOG PROP`
      parent.props.children = { [ node[1].id ]: { overRideTest: `PARENT PROP` } }

      const builtProps = Cascade.buildCascadeProps(node, { identity, catalog: catalogCopy }, parent)

      expect(builtProps.overRideTest === `INLINE PROP`).toBe(true)

    })


    it('should return the inlineProps when no id can be found', () => {

      const parent = buildParent('2.0')
      const node = deepClone(get(cascade, '2.0.2.0'))
      const nodeId = node[1].id
      const identityCopy = deepClone(identity)
      const nodePos = catalog[nodeId].pos
      
      delete identityCopy[nodePos]
      delete identityCopy[nodeId]
      delete node[1].id

      const builtProps = Cascade.buildCascadeProps(node, { identity: identityCopy, catalog }, parent)

      expect(builtProps === node[1]).toBe(true)

    })

  })

  describe('getCascadeId', () => {

    it('should return the id when is passed as the last argument', () => {

      const node = get(cascade, '2.0.2.0')

      expect(Cascade.getCascadeId(null, null, node[1].id))

    })

    it('should return the id from the inlineProps when no id is passed', () => {

      const props = { id: 'SHOULD NOT RETURN' }
      const node = { 1: { id: 'TEST ID' } }

      expect(Cascade.getCascadeId(node, props)).toBe('TEST ID')

    })

    it('should return the id when inlineProps are passed as the first argument', () => {

      expect(Cascade.getCascadeId({ id: 'TEST ID' })).toBe('TEST ID')

    })

    it('should return the id from the props when no id or inlineProp.is is passed', () => {

      const props = { id: 'TEST ID' }
      const node = { 1: {} }

      expect(Cascade.getCascadeId(node, props)).toBe('TEST ID')

    })

    it('should return undefined when no valid ID is passed', () => {

      const props = {}
      const node = { 1: {} }

      expect(Cascade.getCascadeId(props, node)).toBe(undefined)
      expect(Cascade.getCascadeId(null, null)).toBe(undefined)
      expect(Cascade.getCascadeId(null, null, 12345)).toBe(undefined)

    })

  })

})