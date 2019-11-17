import { cascadeModel, buildParent, consoleOverride } from '../../mocks'
import { get, deepClone } from 'jsutils'

const { cascade, catalog, identity, styles } = cascadeModel

const Cascade = require('../cascade')

describe('/cascade', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('getIdentityId', () => {

    it('should get the id of a node from the identity', () => {
      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      expect(Cascade.getIdentityId(node, identity, parent) === get(node, '1.id')).toBe(true)

    })

    it('should return undefined when the parent is not an object', () => {
      const node = get(cascade, '2.0.2.0')

      expect(Cascade.getIdentityId(node, identity, null)).toBe(undefined)

    })

    it('should return undefined when the cascade is not an object', () => {
      const parent = buildParent('2.0')

      expect(Cascade.getIdentityId([], identity, parent)).toBe(undefined)

    })


    it('should call console.warn when parent.cascade is not an object', () => {
      
      const reset = consoleOverride('warn')
      
      const parent = buildParent('2.0')
      parent.cascade = 'Not AN Object'

      const node = get(cascade, '2.0.2.0')
      Cascade.getIdentityId(node, identity, parent)

      expect(console.warn).toHaveBeenCalled()

      reset()

    })

    it('should call console.warn when parent.props.pos does not exist', () => {
      
      const reset = consoleOverride('warn')
      
      const parent = buildParent('2.0')
      delete parent.props.pos

      const node = get(cascade, '2.0.2.0')
      Cascade.getIdentityId(node, identity, parent)

      expect(console.warn).toHaveBeenCalled()

      reset()

    })

    it('should call console.warn when parent.props.pos is not a string', () => {
      
      const reset = consoleOverride('warn')
      
      const parent = buildParent('2.0')
      parent.props.pos = 123456

      const node = get(cascade, '2.0.2.0')
      Cascade.getIdentityId(node, identity, parent)

      expect(console.warn).toHaveBeenCalled()

      reset()

    })

  })

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
  
  describe('findCascadeId', () => {

    it('should return the id when the inlineProps', () => {

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      expect(Cascade.findCascadeId(node))

    })


    it('should return the id when no inlineProps, but has catalogProps', () => {

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')
      const catalogProps = catalog[ node[1].id ]

      expect(Cascade.findCascadeId({}, catalogProps ))

    })

    it('should return the id when no inlineProps, but has catalogProps', () => {

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')
      const catalogProps = catalog[ node[1].id ]

      expect(Cascade.findCascadeId({}, catalogProps ))

    })


    it('should return the id from the identity when no inlineProps and no catalogProps', () => {

      const catalogCopy = deepClone(catalog)
      const parent = buildParent('2.0')
      const node = deepClone(get(cascade, '2.0.2.0'))
      const nodeId = node[1].id
      const identityCopy = deepClone(identity)
      const nodePos = catalogCopy[nodeId].pos
      const catalogProps = catalogCopy[ node[1].id ]
      
      parent.cascade[2][0] = node
      identityCopy[nodePos] = 'TEST ID'
      delete node[1].id
      delete catalogProps.id

      expect(Cascade.findCascadeId(node, catalogProps, identityCopy, parent )).toBe('TEST ID')

    })

  })

})