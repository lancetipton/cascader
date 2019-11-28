import { deepMerge } from 'jsutils'

const defConfig = {
  constants: {
    CASCADE_LOADING: 'CASCADE_LOADING',
  },
  components: {
    lookup: {
      key: 'altRender',
      altKey: 'render',
      capitalize: true,
      type: true,
      id: true
    }
  }
}

export const buildConfig = (config={}) => {
  return deepMerge(defConfig, config)
}