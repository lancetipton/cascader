import { cascadeModel } from '../../mocks'
import { get } from 'jsutils'

const { content, catalog, identity, styles } = cascadeModel

const Cascade = require('../cascade')

describe('/cascade', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('getIdentityId', () => {

    it('should get the id of a node from the identity', () => {
      const parentNode = get(content, '2.0')
      const parentId = get(parentNode, '1.id')
      const parent = { node: parentNode, props: { ...catalog[parentId], ...parentNode[1] }, parent: {} }
      const node = get(content, '2.0.2.0')

      expect(Cascade.getIdentityId(node, parent, identity) === get(node, '1.id')).toBe(true)
    })

  })


})