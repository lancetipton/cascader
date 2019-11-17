const Register = require('../register')


const TestComp = () => {
  return 'I am the test component!'
}

describe('/register', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('register', () => {

    it('should register the passed in components to the component cache', () => {

      const compCache = Register.register({ TestComp })

      expect(compCache.TestComp === TestComp).toBe(true)

    })

    it('should console.warn when an object is not passed in', () => {

      const oldWarn = console.warn
      console.warn = jest.fn()
      const compCache = Register.register(null)

      expect(console.warn).toHaveBeenCalled()

      console.warn = oldWarn

    })

    it('should console.warn when an array passed in', () => {

      const oldWarn = console.warn
      console.warn = jest.fn()
      const compCache = Register.register([])

      expect(console.warn).toHaveBeenCalled()

      console.warn = oldWarn

    })


  })


})
