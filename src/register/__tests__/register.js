import { cascadeModel, buildParent } from '../../mocks'
import { get, deepClone } from 'jsutils'

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
      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get the render component when one exists, and no altRender key exists', () => {

      Register.registerComponents({ Container: TestComp })

      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      catalog[ node[1].id ].render = 'Container'
      delete catalog[ node[1].id ].altRender

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get a component when the cascade capitalized type matches', () => {

      Register.registerComponents({ Div: TestComp })

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get a component when the cascade type matches', () => {

      Register.registerComponents({ div: TestComp })

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get a component when the id matches', () => {

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      Register.registerComponents({ [node[1].id]: TestComp2 })

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(TestComp2)

    })

    it('should return the type when no matching component exists', () => {

      Register.registerComponents({ Row: TestComp, Container: TestComp2 })
      const parent = buildParent('0')
      const node = get(cascade, '2.0')

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(node[0])

    })

    it('should get the lowercase type component over the id component', () => {

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      Register.registerComponents({ div: TestComp, [node[1].id]: TestComp2 })

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get the capitalized type component over the lowercase type component', () => {

      Register.registerComponents({ Div: TestComp, div: TestComp2 })

      const parent = buildParent('2.0')
      const node = get(cascade, '2.0.2.0')

      delete catalog[ node[1].id ].altRender
      delete catalog[ node[1].id ].render

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
      expect(RenderComp).toBe(TestComp)

    })

    it('should get the render component over the capitalized type component', () => {

      Register.registerComponents({ Row: TestComp,  Div: TestComp2, })

      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      node[0] = 'div'

      delete catalog[ node[1].id ].altRender
      catalog[ node[1].id ].render = 'Row'

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)

      expect(RenderComp).toBe(TestComp)

    })

    it('should get the altRender component over the render component', () => {

      Register.registerComponents({ Row: TestComp, Container: TestComp2 })

      const parent = buildParent('0')
      const node = get(cascade, '2.0')
      catalog[ node[1].id ].render = 'Container'

      const RenderComp = Register.findComponent(node, node[1], catalog, parent)
      
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

  })

})
