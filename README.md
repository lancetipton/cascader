# Cascader
React Cascade Render


# Setup
  * Add to your package.json
```js
  "cascader": "git+https://github.com/lancetipton/cascader.git"
```

## Cascader Component
  * Import the `Cascader` Component
  * Pass in the `cascade` object
  * Profit!

### Example 
```js
import { Cascader, registerComponents } from 'cascader'
import { cascade, catalog, styles, identity } from './path/to/cascade/object'
import * as Components from './components'

registerComponents(Components)

export const App = () => {

  return  (
    <Cascader
      cascade={ cascade }
      catalog={ catalog }
      styles={ styles }
      identity={ identity }
    />
  )

}

```