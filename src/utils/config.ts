import { deepMerge } from '@keg-hub/jsutils'

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
  },
  catalog: {
    build: true
  }
}

export const buildConfig = (config={}) => {
  return deepMerge(defConfig, config)
}