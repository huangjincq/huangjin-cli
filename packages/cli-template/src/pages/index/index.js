import { cloneDeep, debounce, throttle } from 'lodash-es'
import $ from 'jquery'
import 'reset.css'
import '@/assets/styles/common.less'
import './index.less'

import './test.js'

console.log(cloneDeep, throttle, debounce, $)

if (module.hot) {
  module.hot.accept('./test.js', function () {
    console.log('hot reload')
  })
}
