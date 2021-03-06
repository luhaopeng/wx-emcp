import React from 'react'
import { List, Toast } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import './index.less'
import { Mine, Test } from '../../../api/url'
import Reporter from '../../../util/reporter'

class History extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [],
      done: false,
      type: 1,
    }
    this.num = 0
  }

  componentDidMount() {
    this.queryData()
  }

  queryData = async () => {
    if (this.state.done) {
      return
    }
    Toast.loading('加载中...', 0)
    let { customerId } = localStorage
    try {
      let { data } = await Mine.history.query({
        customerid: customerId,
        num: this.num++,
      })
      Toast.hide()
      if (data.errcode !== 0) {
        this.setState({ done: true })
      } else {
        let {
          prepayType,
          esamRechargeHistory,
          icmRechargeHistory,
          rechargeHistory,
        } = data.data
        let historySup = []
        switch (parseInt(prepayType)) {
          case 2:
            historySup = icmRechargeHistory.map(item => {
              let { handler, addTime, buyMoney, pointName } = item
              return {
                handler,
                money: buyMoney,
                time: addTime,
                name: pointName,
              }
            })
            break
          case 3:
            historySup = esamRechargeHistory.map(item => {
              let { handler, addTime, money, pointName } = item
              return {
                handler,
                money,
                time: addTime,
                name: pointName,
              }
            })
            break
          case 1:
          default:
            historySup = rechargeHistory.map(item => {
              let { handler, addtime, payMoney, actualMoney, payway } = item
              return {
                handler,
                time: addtime,
                money: actualMoney || payMoney,
                withdraw: payway == -1,
              }
            })
            break
        }
        let { history } = this.state
        this.setState({
          type: parseInt(prepayType),
          history: history.concat(historySup),
        })
      }
    } catch (err) {
      Toast.fail('请求超时')
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('user/history/data', '获取数据'))
    }
  }

  render() {
    let { history, type } = this.state
    let list = history.map(({ handler, time, money, withdraw, name }, idx) => (
      <List.Item key={idx}>
        <div className='history-row'>
          <div className='history-item'>
            <h4>{handler}</h4>
            <span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
          <div className='history-item'>
            <h4
              className={classNames({
                plus: !withdraw,
                minus: withdraw,
              })}
            >
              {money.toFixed(2)}
            </h4>
            {type > 1 ? <span>{name}</span> : null}
          </div>
        </div>
      </List.Item>
    ))
    list.push(
      <List.Item key='more'>
        <div className='more' onClick={this.queryData}>
          {this.state.done ? '没有更多了' : '加载更多'}
        </div>
      </List.Item>,
    )
    return (
      <div className='page-history'>
        <List>{list}</List>
      </div>
    )
  }
}

export default History
