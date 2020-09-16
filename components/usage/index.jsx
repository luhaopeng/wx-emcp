import React from 'react'
import classNames from 'classnames'
import { List, SegmentedControl, Toast, Modal } from 'antd-mobile'
import dayjs from 'dayjs'
import './index.less'
import Chart from './chart'
import { Elec, Test } from '../../api/url'
import Empty from '../empty'
import Switch from '../switch'
import Reporter from '../../util/reporter'

class Usage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      elecList: [],
      waterList: [],
      usageType: 0,
      type: 1,
      mode: 0,
      single: true,
    }
    this.chartRef = React.createRef()
    this.chart = null
  }

  handleUsageTypeChange = e => {
    let idx = e.nativeEvent.selectedSegmentIndex
    this.setState({ usageType: idx })
  }

  handleModeChange = () => {
    this.queryData(this.state.mode ^ 1)
  }

  buildChart() {
    let { usageType, elecList, waterList, mode } = this.state
    let usageList = usageType ? waterList : elecList
    if (usageList.length === 0) {
      this.chart && this.chart.clear()
      return true
    }

    let timePeriod = mode && !usageType ? 24 : 7
    let FORMAT = mode && !usageType ? 'HH' : 'MM-DD'
    let cat = usageType ? '水' : '电'
    let unit = usageType ? '吨' : '度'
    let dayList = [],
      dataList = []

    usageList.map(item => {
      dayList.unshift(dayjs(item.datatime).format(FORMAT))
      dataList.unshift(usageType ? item.used : item.zong)
    })
    if (usageList.length < timePeriod) {
      let addNum = timePeriod - usageList.length
      for (let j = 0; j < addNum; j++) {
        dayList.unshift('')
        dataList.unshift('')
      }
    }

    let option = {
      title: {
        text: `最近${!usageType && mode ? 3 : 30}天用${cat}量(${unit})`,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 12,
        },
      },
      tooltip: {
        show: false,
      },
      xAxis: {
        type: 'category',
        data: dayList,
      },
      yAxis: [
        {
          type: 'value',
        },
      ],
      grid: {
        top: '18%',
        bottom: '18%',
        left: '5%',
        right: '6%',
        containLabel: true,
      },
      animationDurationUpdate: 500,
      dataZoom: [
        {
          type: 'slider',
          show: true,
          startValue: dayList[dayList.length - timePeriod],
          endValue: dayList[dayList.length - 1],
          handleSize: 2,
        },
        {
          type: 'inside',
          startValue: dayList[dayList.length - timePeriod],
          endValue: dayList[dayList.length - 1],
        },
      ],
      series: [
        {
          type: 'bar',
          data: dataList,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: 'orange',
                  fontSize: '12',
                  fontWeight: 'bold',
                },
              },
              labelLine: {
                show: false,
                length: 10,
              },
            },
            emphasis: {
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: 'orange',
                  fontSize: '12',
                  fontWeight: 'bold',
                },
              },
            },
          },
        },
      ],
    }
    this.chart = Chart.buildChart(this.chartRef.current, option)
  }

  buildTable() {
    let { usageType, elecList, waterList, type } = this.state
    let usageList = usageType ? waterList : elecList
    let list = usageList.map(function build(item) {
      return (
        <List.Item key={item.datatime}>
          <div className='list-row'>
            <div>{dayjs(item.datatime).format('MM-DD')}</div>
            {usageType ? (
              <div>{item.used.toFixed(2)}</div>
            ) : (
              <div>{item.zong.toFixed(2)}</div>
            )}
            {usageType || type > 1 ? null : (
              <React.Fragment>
                <div>{item.jian.toFixed(2)}</div>
                <div>{item.feng.toFixed(2)}</div>
                <div>{item.ping.toFixed(2)}</div>
                <div>{item.gu.toFixed(2)}</div>
              </React.Fragment>
            )}
          </div>
        </List.Item>
      )
    })
    return list
  }

  async queryData(newMode) {
    let { mode } = this.state
    Toast.loading('加载中...', 0)
    try {
      let { data } = await Elec.usage.query({
        mode: newMode !== undefined ? newMode : mode,
        customerid: localStorage.customerId,
      })
      Toast.hide()
      let { dayUseList: elec, dayWaterList: water, prepayType } = data.data
      if (newMode !== undefined) {
        this.setState({
          elecList: elec,
          waterList: water,
          mode: newMode,
        })
      } else {
        this.setState({
          elecList: elec,
          waterList: water,
          usageType: elec.length === 0 && water.length > 0 ? 1 : 0,
          type: prepayType,
          single: !(elec.length > 0 && water.length > 0),
        })
      }
    } catch (err) {
      Toast.fail('请求超时')
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('usage/data', '获取数据'))
    }
  }

  componentDidMount() {
    if (localStorage.shouldChangePwd === '1') {
      Modal.alert('请修改密码', '为了您的数据安全，请先修改密码', [
        { text: '去修改', onPress: () => this.props.history.push('/user/pwd') },
      ])
      return
    }
    this.queryData()
  }

  render() {
    let { usageType, single, type, mode } = this.state
    let clear = this.chartRef.current && this.buildChart()
    let list = this.buildTable()
    return (
      <div className='page-usage'>
        <SegmentedControl
          selectedIndex={usageType}
          className={classNames('segment-control', {
            hide: single,
          })}
          values={['用电分析', '用水分析']}
          onChange={this.handleUsageTypeChange}
        />
        <Switch
          className={classNames('mode-switch', {
            hide: usageType > 0,
            'non-seg': single,
          })}
          checked={mode}
          onLabel='时'
          offLabel='天'
          onClick={this.handleModeChange}
        />
        {clear && <Empty style={{ height: '216px' }} className='empty' />}
        <div
          className={classNames('chart-root', {
            hide: clear,
          })}
          ref={this.chartRef}
        />
        <div className='list-header'>
          <h3>日期</h3>
          {usageType ? <h3>用水量</h3> : <h3>{type > 1 ? '用电量' : '总'}</h3>}
          {usageType || type > 1 ? null : (
            <React.Fragment>
              <h3>尖</h3>
              <h3>峰</h3>
              <h3>平</h3>
              <h3>谷</h3>
            </React.Fragment>
          )}
        </div>
        {list.length > 0 ? (
          <List className={single ? 'non-seg' : ''}>{list}</List>
        ) : (
          <Empty className='empty' />
        )}
      </div>
    )
  }
}

export default Usage
