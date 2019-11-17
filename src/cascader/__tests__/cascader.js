import { cascadeModel, consoleOverride } from '../../mocks'
import { get } from 'jsutils'

const { registerComponents, removeComponents } = require('../../register')
const Cascader = require('../cascader').Cascader

describe('/cascader', () => {

  beforeEach(() => {
    jest.resetAllMocks()
    removeComponents()
  })

  it('should render the passed in cascade model', () => {

    const rendered = Cascader(cascadeModel)
    const firstChild = get(rendered, ['props', 'children', '0' ])

    expect(rendered['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(rendered.type).toBe(cascadeModel.cascade[0])
    expect(rendered.key).toBe(cascadeModel.cascade[1].id)

    expect(Array.isArray(rendered.props.children)).toBe(true)
    expect(firstChild['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(firstChild.type).toBe(cascadeModel.cascade[2][0][0])
    expect(firstChild.key).toBe(cascadeModel.cascade[2][0][1].id)

  })

  it('should render the passed in cascade model without IDs', () => {

    const cascade = { 0: 'div', 1: {}, 2: [ 'I am some text' ] }
    const rendered = Cascader({ cascade })

    expect(rendered.type).toBe(cascade[0])
    expect(rendered.props.children[0]).toBe(cascade[2][0])

  })

  it('should render single children text element', () => {

    const cascade = { 0: 'div', 1: {}, 2: 'I am some text' }
    const rendered = Cascader({ cascade })

    expect(rendered.type).toBe(cascade[0])
    expect(rendered.props.children).toBe(cascade[2])

  })

  it('should render when only the cascade is passed in', () => {

    const rendered = Cascader({ cascade: cascadeModel.cascade })
    const firstChild = get(rendered, ['props', 'children', '0' ])

    expect(rendered['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(rendered.type).toBe(cascadeModel.cascade[0])
    expect(rendered.key).toBe(cascadeModel.cascade[1].id)

    expect(Array.isArray(rendered.props.children)).toBe(true)
    expect(firstChild['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(firstChild.type).toBe(cascadeModel.cascade[2][0][0])
    expect(firstChild.key).toBe(cascadeModel.cascade[2][0][1].id)

  })

  it('should handle when the cascade is an array', () => {

    const cascade = cascadeModel.cascade[2]
    
    expect(Array.isArray(cascade)).toBe(true)

    const rendered = Cascader({ cascade })
    const firstChild = rendered[0]

    expect(Array.isArray(rendered)).toBe(true)

    expect(firstChild['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(firstChild.type).toBe(cascadeModel.cascade[2][0][0])
    expect(firstChild.key).toBe(cascadeModel.cascade[2][0][1].id)

  })

  it('should return null when no cascade is passed in', () => {

    const reset = consoleOverride('warn')
    const { cascade, ...others } = cascadeModel
    const rendered = Cascader(others)

    expect(rendered).toBe(null)

    reset()

  })

  it('should return null when cascade type ( 0 ) is not defined', () => {

    expect(Cascader({ cascade: { 1: {}, 2: [] } })).toBe(null)

  })

  it('should return null when cascade type ( 0 ) is equal to CASCADE_LOADING', () => {

    expect(Cascader({ cascade: { 0: 'CASCADE_LOADING' } })).toBe(null)

  })

  it('should call console.warn when no cascade is passed in', () => {

    const reset = consoleOverride('warn')
    const { cascade, ...others } = cascadeModel
    const rendered = Cascader(others)

    expect(console.warn).toHaveBeenCalled()

    reset()

  })

  it('should render altRenders when they exist', () => {

    const components = { Row: () => "I am an Alt Render" }
    registerComponents(components)
    const rendered = Cascader(cascadeModel)
    
    const altRender = get(rendered, ['props', 'children', '0' ])

    expect(altRender.type).toBe(components.Row)
    expect(altRender['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(altRender.type).not.toBe(cascadeModel.cascade[2][0][0])
    expect(altRender.key).toBe(cascadeModel.cascade[2][0][1].id)

  })

  it('should render altRenders at all levels', () => {

    const components = { Row: () => "Row Alt Render", input: () => "Input Alt Render" }
    registerComponents(components)
    const rendered = Cascader(cascadeModel)
    const altRender = get(rendered, ['props', 'children', '0' ])
    const deepAltRender = get(altRender, ['props', 'children', '1', 'props', 'children', '1' ])
    const deepCascade = get(cascadeModel.cascade, [ '2', '0', '2', '1', '2', '1' ])
    
    expect(altRender['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(altRender.type).toBe(components.Row)

    expect(deepAltRender['$$typeof'].toString()).toBe('Symbol(react.element)')
    expect(deepAltRender.type).toBe(components.input)
    expect(deepAltRender.key).toBe(deepCascade[1].id)

  })

})