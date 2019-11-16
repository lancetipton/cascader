import { cascadeModel } from '../../mocks'
import { get } from 'jsutils'

const { content, catalog, identity, styles } = cascadeModel

const Catalog = require('../catalog')

describe('/catalog', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('getCatalogProps', () => {

    it('should return the catalogProps that match the passed in ID', () => {

      const node = get(content, '2.0')
      const nodeId = get(node, '1.id')
      const catalogProps = Catalog.getCatalogProps(catalog, nodeId)

      expect(catalogProps.id === nodeId).toBe(true)
      expect(catalogProps.pos === '2.0').toBe(true)

    })

    it('should return false when an invalid Id is passed in', () => {
      expect(Catalog.getCatalogProps(catalog, 12345)).toBe(false)
      expect(Catalog.getCatalogProps(catalog, [])).toBe(false)
      expect(Catalog.getCatalogProps(catalog, {})).toBe(false)
      expect(Catalog.getCatalogProps(catalog, null)).toBe(false)
    })

    it('should return false when an invalid catalog is passed in', () => {
      const node = get(content, '2.0')
      const nodeId = get(node, '1.id')

      expect(Catalog.getCatalogProps([], nodeId)).toBe(false)
      expect(Catalog.getCatalogProps(null, nodeId)).toBe(false)
      expect(Catalog.getCatalogProps("test", nodeId)).toBe(false)

    })

  })

  describe('getAltRender', () => {

    it('should return the altRender from the catalogProps', () => {

      const node = get(content, '2.0')
      const nodeId = get(node, '1.id')
      
      expect(Catalog.getAltRender(catalog, nodeId) === catalog[nodeId].altRender).toBe(true)

    })

    it('should return the render key when altRender does not exist from the catalogProps', () => {

      const node = get(content, '2.0')
      const nodeId = get(node, '1.id')
      const altRender = catalog[nodeId].altRender
      catalog[nodeId].altRender = undefined
      catalog[nodeId].render = 'Column'

      expect(Catalog.getAltRender(catalog, nodeId) === 'Column').toBe(true)

    })

    it('should return false when the Id is invalid', () => {
      expect(Catalog.getAltRender(catalog, 12345)).toBe(false)
      expect(Catalog.getAltRender(catalog, [])).toBe(false)
      expect(Catalog.getAltRender(catalog, {})).toBe(false)
      expect(Catalog.getAltRender(catalog, null)).toBe(false)
    })

    it('should return false when an invalid catalog is passed in', () => {
      const node = get(content, '2.0')
      const nodeId = get(node, '1.id')

      expect(Catalog.getAltRender([], nodeId)).toBe(false)
      expect(Catalog.getAltRender(null, nodeId)).toBe(false)
      expect(Catalog.getAltRender("test", nodeId)).toBe(false)

    })

  })


})