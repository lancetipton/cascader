# Cascader
React Cascade Render

## Install
* With NPM - `npm install @ltipton/cascader`
* With Yarn - `yarn add @ltipton/cascader`


## Cascader Component
  * Import the `Cascader` Component
  * Pass in the `cascade` object
  * Profit!

## Use

```js

// Cascade.js
export const cascade = {
  0: `MyComp1`,
  1: { className: `my-comp-1`, id: `my-comp-1` },
  2: [{
    0: `MyComp2`,
    1: { className: `my-comp-2`, id: `my-comp-2` },
    2: [{
      0: `p`,
      1: {},
      2: `Child text of MyComp2 Component`
    }]
  }]
}

export const styles = {
  `my-comp-1`: {
    // ...custom styles ref Id
  },
  `my-comp-2`: {
    // ...custom styles ref Id
  }
}

export const catalog = {
  `my-comp-1`: {
    // ...custom props by ref Id
  },
  `my-comp-2`: {
    // ...custom props by ref Id
  }
}


// Components.js
export const MyComp1 = ({ children, ...props}) => (<div {...props} />{children}</div>)
export const MyComp2 = ({ children, ...props}) => (<div {...props} />{children}</div>)

// App.js File
import { Cascader, registerComponents } from 'cascader'
import { cascade, catalog, styles } from './Cascade'
import * as Components from './Components'

registerComponents(Components)

export const App = () => {

  return  (
    <Cascader
      cascade={ cascade }
      catalog={ catalog }
      styles={ styles }
    />
  )
}

```

### Output
```html
<div class='my-comp-1' id='my-comp-1' >
  <div class='my-comp-2' id='my-comp-2' >
    <p>
      Child text of MyComp2 Component
    </p>
  </div>
</div>
```