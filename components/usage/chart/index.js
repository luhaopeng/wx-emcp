const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/dataZoom')
const theme = require('./theme.json')

echarts.registerTheme('roma', theme)

function buildChart(domEl, option) {
  let chart = echarts.getInstanceByDom(domEl) || echarts.init(domEl, 'roma')
  chart.clear()
  chart.setOption(option)
  window.onresize = chart.resize
  return chart
}

export default { buildChart }
