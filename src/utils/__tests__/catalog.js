import { cascadeModel, consoleOverride } from '../../mocks'
import { get } from 'jsutils'

const { cascade, catalog, styles } = cascadeModel

const Catalog = require('../catalog')

describe('/catalog', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('getCatalogProps', () => {
    
    beforeEach(() => jest.resetAllMocks())
    
    it('should return the catalogProps that match the passed in ID', () => {

      const node = get(cascade, '2.0')
      const nodeId = get(node, '1.id')
      const catalogProps = Catalog.getCatalogProps(catalog, nodeId)

      expect(catalogProps.id).toBe(nodeId)
      expect(catalogProps.pos).toBe('0.2.0')

    })

    it('should return undefined when an invalid Id is passed in', () => {

      const reset = consoleOverride('warn')

      expect(Catalog.getCatalogProps(catalog, 12345)).toBe(undefined)
      expect(Catalog.getCatalogProps(catalog, [])).toBe(undefined)
      expect(Catalog.getCatalogProps(catalog, {})).toBe(undefined)
      expect(Catalog.getCatalogProps(catalog, null)).toBe(undefined)

      reset()

    })

    it('should return undefined when an invalid catalog is passed in', () => {

      const reset = consoleOverride('warn')

      const node = get(cascade, '2.0')
      const nodeId = get(node, '1.id')

      expect(Catalog.getCatalogProps([], nodeId)).toBe(undefined)
      expect(Catalog.getCatalogProps(null, nodeId)).toBe(undefined)
      expect(Catalog.getCatalogProps("test", nodeId)).toBe(undefined)
      
      reset()

    })

    it('should call console.warn when an invalid catalog is passed!', () => {

      const reset = consoleOverride('warn')

      const node = get(cascade, '2.0')
      const nodeId = get(node, '1.id')

      Catalog.getCatalogProps([], nodeId)

      expect(console.warn).toHaveBeenCalled()

      reset()
    })

    it('should call console.warn when an invalid catalog is passed!', () => {

      const reset = consoleOverride('warn')

      Catalog.getCatalogProps(catalog)

      expect(console.warn).toHaveBeenCalled()

      reset()
    })

  })

  describe('getAltRender', () => {
    
    beforeEach(() => jest.resetAllMocks())
    
    it('should return the altRender from the catalogProps', () => {

      const node = get(cascade, '2.0')
      const nodeId = get(node, '1.id')
      
      expect(Catalog.getAltRender(catalog, nodeId) === catalog[nodeId].altRender).toBe(true)

    })

    it('should return the render key when altRender does not exist from the catalogProps', () => {

      const node = get(cascade, '2.0')
      const nodeId = get(node, '1.id')
      const altRender = catalog[nodeId].altRender
      catalog[nodeId].altRender = undefined
      catalog[nodeId].render = 'Column'

      expect(Catalog.getAltRender(catalog, nodeId) === 'Column').toBe(true)

    })

    it('should return false when the Id is invalid', () => {

      const reset = consoleOverride('warn')

      expect(Catalog.getAltRender(catalog, 12345)).toBe(false)
      expect(Catalog.getAltRender(catalog, [])).toBe(false)
      expect(Catalog.getAltRender(catalog, {})).toBe(false)
      expect(Catalog.getAltRender(catalog, null)).toBe(false)

      reset()

    })

    it('should return false when an invalid catalog is passed in', () => {

      const reset = consoleOverride('warn')

      const node = get(cascade, '2.0')
      const nodeId = get(node, '1.id')

      expect(Catalog.getAltRender([], nodeId)).toBe(false)
      expect(Catalog.getAltRender(null, nodeId)).toBe(false)
      expect(Catalog.getAltRender("test", nodeId)).toBe(false)

      reset()

    })

  })


  describe('catalogFromCascade', () => {

    it('', () => {
      const builtCatalog = Catalog.catalogFromCascade(cascade)
      
    })

    it('', () => {
      const builtCatalog = Catalog.catalogFromCascade(cascade, true)
    })

  })

})