import { cascadeModel, buildParent } from '../../mocks'
import { get, deepClone } from 'jsutils'
import { Cascader } from '../../cascader'
import { buildConfig } from '../../utils'

const { styles } = cascadeModel
let cascade
let catalog
const TestComp = () => ('I am the test component!')
const TestComp2 = () => ('I am the test 2 component!')

const Register = require('../register')

describe('/register', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('registerComponents', () => {

    it('should register the passed in components to the component cache', () => {

      const compCache = Register.registerComponents({ TestComp })

      expect(compCache.TestComp === TestComp).toBe(true)

      Register.removeComponent('TestComp')

    })

    it('should console.warn when an object is not passed in', () => {

      const oldWarn = console.warn
      console.warn = jest.fn()
      const compCache = Register.registerComponents(null)

      expect(console.warn).toHaveBeenCalled()

      console.warn = oldWarn

    })

    it('should console.warn when an array passed in', () => {

      const oldWarn = console.warn
      console.warn = jest.fn()
      const compCache = Register.registerComponents([])

      expect(console.warn).toHaveBeenCalled()

      console.warn = oldWarn

    })

  })

  describe('removeComponent', () => {

    it('should remove only the component the matches the passed in key', () => {

      Register.registerComponents({ TestComp, OtherComp: TestComp })

      Register.removeComponent('TestComp')
      const compNames = Object.keys(Register.getComponents())
      
      expect(compNames.length).toBe(1)
      expect(compNames[0]).toBe('OtherComp')

      Register.removeComponent()

    })

  })

  describe('removeComponents', () => {

    it('should remove all components', () => {

      Register.registerComponents({ TestComp, OtherComp: TestComp })

      Register.removeComponents()

      expect(Object.keys(Register.getComponents()).length).toBe(0)

    })

  })

  describe('getComponent', () => {

    beforeEach(() => Register.removeComponents())

    it('should return only the component the matches the passed in key', () => {

      Register.registerComponents({ TestComp, OtherComp: TestComp })

      expect(Register.getComponent('TestComp')).toBe(TestComp)

    })

    it('should return falsy when no key is passed', () => {
      const allComps = { TestComp, OtherComp: TestComp }
      Register.registerComponents(allComps)

      expect(Register.getComponent()).toBeFalsy()

    })

  })

  describe('getComponents', () => {

    it('should return all components when no key is passed in', () => {
      const allComps = { TestComp, OtherComp: TestComp }
      Register.registerComponents(allComps)

      Object.keys(Register.getComponents())
        .map(key => expect(allComps[key]).toBe(TestComp))

      Register.removeComponents()

    })

  })

  describe('findComponent', () => {
    
    beforeEach(() => {

      jest.resetAllMocks()
      Register.removeComponents()

      cascade = deepClone(cascadeModel.cascade)
      catalog = deepClone(cascadeModel.catalog)

    })

    it('should get the altRender component when one exists', () => {

      Register.registerComponents({ Row: TestComp })

      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      const RenderComp = Register.findComponent(node, node[1], { catalog }, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get the render component when one exists, and no altRender key exists', () => {

      Register.registerComponents({ Container: TestComp })

      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      catalog[ node[1].id ].render = 'Container'
      delete catalog[ node[1].id ].altRender

      const RenderComp = Register.findComponent(node, node[1], { catalog }, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get a component when the cascade capitalized type matches', () => {

      Register.registerComponents({ Div: TestComp })
      const config = { components: { lookup: { capitalize: true } } }
      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], { catalog, config }, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get a component when the cascade type matches', () => {

      Register.registerComponents({ div: TestComp })
      const config = { components: { lookup: { type: true } } }
      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], { catalog, config }, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get a component when the id matches', () => {

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')
      const config = { components: { lookup: { id: true } } }
      Register.registerComponents({ [node[1].id]: TestComp2 })

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], { catalog, config }, parent)
      
      expect(RenderComp).toBe(TestComp2)

    })

    it('should return the type when no matching component exists', () => {

      Register.registerComponents({ Row: TestComp, Container: TestComp2 })
      const parent = buildParent('0')
      const node = get(cascade, '2.0')

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], { catalog, config: {} }, parent)
      
      expect(RenderComp).toBe(node[0])

    })

    it('should get the lowercase type component over the id component', () => {

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')
      const config = buildConfig({})

      Register.registerComponents({ div: TestComp, [node[1].id]: TestComp2 })

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], { catalog, config }, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get the capitalized type component over the lowercase type component', () => {

      Register.registerComponents({ Div: TestComp, div: TestComp2 })

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')
      const config = buildConfig({})

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], { catalog, config }, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get the render component over the capitalized type component', () => {

      Register.registerComponents({ Row: TestComp,  Div: TestComp2, })

      const config = buildConfig({})
      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      node[0] = 'div'

      delete catalog[ node[1].id ].altRender
      catalog[ node[1].id ].render = 'Row'

      const RenderComp = Register.findComponent(node, node[1], { catalog, config }, parent)

      expect(RenderComp).toBe(TestComp)

    })

    it('should get the altRender component over the render component', () => {

      Register.registerComponents({ Row: TestComp, Container: TestComp2 })

      const config = buildConfig({})
      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      catalog[ node[1].id ].render = 'Container'

      const RenderComp = Register.findComponent(node, node[1], { catalog, config }, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

  })

  describe('registerCustomFind', () => {

    it('should override the default find method with the passed in function', () => {

      const customFindMethod = jest.fn()
      Register.registerCustomFind(customFindMethod)

      Register.findComponent()

      expect(customFindMethod).toHaveBeenCalled()

      Register.registerCustomFind(null)

    })

    it('should unregister the customFind function when passing a falsy value', () => {

      const customFindMethod = jest.fn()
      Register.registerCustomFind(customFindMethod)

      Register.findComponent()

      expect(customFindMethod).toHaveBeenCalled()

      customFindMethod.mockReset()
      Register.registerCustomFind(null)
      Register.registerComponents({ Row: TestComp, Container: TestComp2 })
      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      catalog[ node[1].id ].render = 'Container'

      Register.findComponent(node, node[1], { catalog }, parent)

      expect(customFindMethod).not.toHaveBeenCalled()

    })

  })

  describe('getCached', () => {

    beforeEach(() => Register.clearCache())

    it('should return a cached component when a valid id is passed in', () => {

      Register.registerComponents({ Row: TestComp, Container: TestComp2 })
      const rendered = Cascader(cascadeModel)
      const cachedComp = Register.getCached('3af353c4-64f9-4edf-8324-bcbdf37d88cc')

      expect(cachedComp).toBe(TestComp)

    })

    it('should NOT return a cached component when an invalid id is passed in', () => {

      Register.registerComponents({ Row: TestComp, Container: TestComp2 })
      const rendered = Cascader(cascadeModel)
      const cachedComp = Register.getCached('')
      const cachedComp2 = Register.getCached(1234)
      const cachedComp3 = Register.getCached({})

      expect(cachedComp).toBe(undefined)
      expect(cachedComp2).toBe(undefined)
      expect(cachedComp3).toBe(undefined)

    })

  })

  describe('addCached', () => {
    
    beforeEach(() => Register.clearCache())
    
    it('should add a component to the cached components', () => {

      const cachedId = 'test-add'

      expect(Register.getCached(cachedId)).toBe(undefined)
      
      Register.addCached(cachedId, TestComp)
      const cachedComp = Register.getCached(cachedId)

      expect(cachedComp).toBe(TestComp)

    })

    it('should call console.warn when an invalid id is passed in', () => {

      const oldWarn = console.warn
      console.warn = jest.fn()

      Register.addCached(null)
      Register.addCached(123)
      Register.addCached({})
      Register.addCached([])
      Register.addCached(() => {})
      Register.addCached('1234', () => {})

      expect(console.warn).toHaveBeenCalledTimes(5)

      console.warn = oldWarn

    })

    it('should call console.warn when an invalid component is passed in', () => {

      const oldWarn = console.warn
      console.warn = jest.fn()

      Register.addCached('1234', null)
      Register.addCached('1234', {})
      Register.addCached('1234', [])
      Register.addCached('1234', 1)
      Register.addCached('1234', '1')
      Register.addCached('1234', () => {})

      expect(console.warn).toHaveBeenCalledTimes(5)

      console.warn = oldWarn

    })

  })

  describe('clearCache', () => {

    beforeEach(() => Register.clearCache())

    it('should clear only the component matching the passed in ID', () => {

      const cachedId = 'test-add'
      const cachedId2 = 'test-add2'
      Register.addCached(cachedId, TestComp)
      Register.addCached(cachedId2, TestComp2)
      const cachedComp = Register.getCached(cachedId)
      const cachedComp2 = Register.getCached(cachedId2)

      expect(cachedComp).toBe(TestComp)
      expect(cachedComp2).toBe(TestComp2)

      Register.clearCache(cachedId)

      expect(Register.getCached(cachedId)).toBe(undefined)
      expect(Register.getCached(cachedId2)).toBe(TestComp2)

    })

    it('should clear all cached component when no id is passed in', () => {

      const cachedId = 'test-add'
      const cachedId2 = 'test-add2'
      Register.addCached(cachedId, TestComp)
      Register.addCached(cachedId2, TestComp2)
      const cachedComp = Register.getCached(cachedId)
      const cachedComp2 = Register.getCached(cachedId2)

      expect(cachedComp).toBe(TestComp)
      expect(cachedComp2).toBe(TestComp2)

      Register.clearCache()

      expect(Register.getCached(cachedId)).toBe(undefined)
      expect(Register.getCached(cachedId2)).toBe(undefined)

    })

  })

  
  describe('clear', () => {

    it('should clear all component and cache', () => {

      Register.registerComponents({ Row: TestComp, Container: TestComp2 })
      Cascader(cascadeModel)

      expect(Register.getCached('3af353c4-64f9-4edf-8324-bcbdf37d88cc')).toBe(TestComp)
      expect(Register.getComponent('Row')).toBe(TestComp)
      expect(Register.getComponent('Container')).toBe(TestComp2)

      Register.clear()

      expect(Register.getCached('3af353c4-64f9-4edf-8324-bcbdf37d88cc')).toBe(undefined)
      expect(Register.getComponent('Row')).toBe(undefined)
      expect(Register.getComponent('Container')).toBe(undefined)

    })

  })


})
