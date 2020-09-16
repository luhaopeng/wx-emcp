import React from 'react'
import { SegmentedControl, List, Toast, Modal } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import './index.less'
import { Elec, Test } from '../../api/url'
import Reporter from '../../util/reporter'

const FULL = 'YYYY-MM-DD HH:mm:ss'

class Bill extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      billType: 0,
      single: true,
      type: 1,
      curElec: null,
      curWater: null,
      done: false,
      pastElec: [],
      pastWater: [],
    }
    this.num = 0
    this.queryCount = 0
  }

  handleBillTypeChange = e => {
    let idx = e.nativeEvent.selectedSegmentIndex
    this.setState({ billType: idx })
  }

  handleListClick = time => {
    let { billType } = this.state
    sessionStorage.time = time
    sessionStorage.billType = billType
    this.props.history.push({ pathname: '/detail' })
  }

  queryCurrent = async () => {
    if (!this.queryCount++) {
      Toast.loading('加载中...', 0)
    }
    try {
      let { data } = await Elec.curBill.query({
        customerid: localStorage.customerId,
      })
      if (!--this.queryCount) {
        Toast.hide()
      }

      if (data.errcode === 0) {
        let { prepayType, curMonth, curMonthWater } = data.data
        this.setState({
          billType: !curMonth && curMonthWater ? 1 : 0,
          single: !(curMonth && curMonthWater),
          type: prepayType,
          curElec: curMonth,
          curWater: curMonthWater,
        })
      }
    } catch (err) {
      --this.queryCount
      Toast.fail('请求超时')
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('bill/current', '当月账单'))
    }
  }

  queryPast = async () => {
    if (this.state.done) {
      return
    }
    if (!this.queryCount++) {
      Toast.loading('加载中...', 0)
    }
    try {
      let { data } = await Elec.billList.query({
        customerid: localStorage.customerId,
        num: this.num++,
      })
      if (!--this.queryCount) {
        Toast.hide()
      }
      if (data.errcode !== 0) {
        this.setState({ done: true })
      } else {
        let { prepayType, briefList: elec, briefWaterList: water } = data.data
        if (this.num > 1) {
          let { pastElec, pastWater } = this.state
          this.setState({
            pastElec: pastElec.concat(elec),
            pastWater: pastWater.concat(water),
          })
        } else {
          this.setState({
            billType: elec.length === 0 && water.length > 0 ? 1 : 0,
            single: !(elec.length > 0 && water.length > 0),
            type: prepayType,
            pastElec: elec,
            pastWater: water,
          })
        }
      }
    } catch (err) {
      --this.queryCount
      Toast.fail('请求超时')
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('bill/past', '往月账单'))
    }
  }

  componentDidMount() {
    if (localStorage.shouldChangePwd === '1') {
      Modal.alert('请修改密码', '为了您的数据安全，请先修改密码', [
        { text: '去修改', onPress: () => this.props.history.push('/user/pwd') },
      ])
      return
    }
    this.queryCurrent()
    this.queryPast()
  }

  render() {
    let {
      type,
      single,
      billType,
      curElec,
      curWater,
      pastElec,
      pastWater,
      done,
    } = this.state
    let cur = billType ? curWater : curElec
    let past = billType ? pastWater : pastElec
    let list = past.map(item => {
      let { datatime, energyzong: usage, fee, updatetime } = item
      return (
        <List.Item
          key={datatime}
          arrow='horizontal'
          onClick={() => {
            this.handleListClick(datatime)
          }}
        >
          <div className='list-row'>
            <div className='list-col'>
              <span>{dayjs(datatime).format('YYYY年MM月')}</span>
              <span className='brief'>
                结算时间: {dayjs(updatetime).format(FULL)}
              </span>
            </div>
            <div className='list-col right'>
              {type === 3 ? null : (
                <span className='usage'>
                  {usage === null ? '---' : usage.toFixed(2)}
                  {billType ? ' 吨' : ' 度'}
                </span>
              )}
              <span className='price'>{fee ? fee.toFixed(2) : '0.00'} 元</span>
            </div>
          </div>
        </List.Item>
      )
    })
    list.push(
      <List.Item key='more'>
        <div className='more' onClick={this.queryPast}>
          {done ? '没有更多了' : '加载更多'}
        </div>
      </List.Item>,
    )
    return (
      <div className='page-bill'>
        <SegmentedControl
          selectedIndex={billType}
          className={classNames('segment-control', {
            hide: single,
          })}
          values={['电费账单', '水费账单']}
          onChange={this.handleBillTypeChange}
        />
        <div className='content'>
          <section>
            <header>
              <h3>当月情况</h3>
              <div>
                {!cur ? '暂无当月信息' : dayjs(cur.updatetime).format(FULL)}
              </div>
            </header>
            <div
              className='cur'
              onClick={() => {
                if (cur) {
                  this.handleListClick(cur.datatime)
                }
              }}
            >
              <div>
                <h3 className='usage'>
                  {!cur ? '-.--' : cur.energyzong.toFixed(2)}
                </h3>
                <span>
                  {billType
                    ? '消耗水量 (吨)'
                    : type === 3
                      ? '购电金额 (元)'
                      : '消耗电量 (度)' // prettier-ignore
                  }
                </span>
              </div>
              <div>
                <h3 className='price'>{!cur ? '-.--' : cur.fee.toFixed(2)}</h3>
                <span>预计{billType ? '水' : '电'}费 (元)</span>
              </div>
            </div>
          </section>
          <section>
            <header>
              <h3>往月账单</h3>
            </header>
            <List>{list}</List>
          </section>
        </div>
      </div>
    )
  }
}

export default Bill
