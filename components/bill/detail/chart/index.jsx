import React from 'react'
import dayjs from 'dayjs'
import { Icon } from 'antd-mobile'
import { Singlet, Rating, Stair } from './regular'

const DATE = 'YYYY-MM-DD'
const MONTH = 'YYYY-MM'

function regularTop({ obj, detail, changeList, billType, checked }) {
  if (!obj) {
    return null
  }
  let { current, cost, change, should, balance, hm, datatime } = obj
  let titleSub = current ? '(预结)' : !checked ? '(未核算)' : ''
  let date = dayjs(datatime)
  return (
    <div className='detail-wrapper'>
      <h3>{date.format(`YYYY年MM月账单${titleSub}`)}</h3>
      <div className='table-title'>
        <p>户名：{hm}</p>
      </div>
      <table className='total'>
        <thead>
          <tr>
            <th>计费月份</th>
            <th>{billType ? '水' : '电'}表数量</th>
            <th>{billType ? '水' : '电'}费</th>
            <th>{current ? '总余额' : '追退费用'}</th>
            <th>{current ? '冻结余额' : '应付金额'}</th>
            <th>{current ? '可用余额' : '账户余额'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{date.format(MONTH)}</td>
            <td>{detail.length}</td>
            <td>{(cost * 1).toFixed(2)}</td>
            <td>{(change * 1).toFixed(2)}</td>
            <td>{(should * 1).toFixed(2)}</td>
            <td>{(balance * 1).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      {changeList && changeList.length ? <Change list={changeList} /> : null}
    </div>
  )
}

class Change extends React.Component {
  constructor(props) {
    super(props)
    this.state = { collapse: true }
  }

  handleCollapse = () => {
    let { collapse } = this.state
    this.setState({ collapse: !collapse })
  }

  componentDidMount() {
    this.style = {
      height: `${this.refs.content.scrollHeight}px`,
      opacity: 1,
    }
  }

  render() {
    let { collapse } = this.state
    let { list } = this.props
    return (
      <React.Fragment>
        <div className='panel-label' onClick={this.handleCollapse}>
          <p>追退详情</p>
          <p />
          <Icon type={collapse ? 'down' : 'up'} size='xs' color='#999' />
        </div>
        <section
          className='collapsible'
          style={collapse ? null : this.style}
          ref='content'
        >
          <table className='top'>
            <thead>
              <tr>
                <th>时间</th>
                <th>类型</th>
                <th>金额</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.addtime.replace('T', ' ')}</td>
                  <td>{item.typeStr}</td>
                  <td>{item.money.toFixed(2)}</td>
                  <td>{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </React.Fragment>
    )
  }
}

function regularTable({ obj, ...rest }) {
  let { type } = obj.pricerule
  switch (type) {
    case 1:
      return <Singlet key={obj.pointid} obj={obj} {...rest} />
    case 2:
      return <Rating key={obj.pointid} obj={obj} {...rest} />
    case 3:
      return <Stair key={obj.pointid} obj={obj} {...rest} />
    default:
      return null
  }
}

function icmTop({ obj, detail }) {
  if (!obj) {
    return null
  }
  let tBuy = 0,
    tDraw = 0,
    tElec = 0,
    tMoney = 0
  for (let { buyenergy, withdraw, useenergy, usemoney } of detail) {
    tBuy += buyenergy
    tDraw += withdraw
    tElec += useenergy
    tMoney += usemoney
  }
  let { datatime, hm } = obj
  let date = dayjs(datatime)
  return (
    <div className='detail-wrapper'>
      <h3>{date.format('YYYY年MM月账单')}</h3>
      <div className='table-title'>
        <p>户名：{hm}</p>
      </div>
      <table className='total'>
        <thead>
          <tr>
            <th>计费月份</th>
            <th>电表数量</th>
            <th>总购电量</th>
            <th>清除电量</th>
            <th>总用电量</th>
            <th>总用电费</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{date.format(MONTH)}</td>
            <td>{detail.length}</td>
            <td>{tBuy.toFixed(2)}</td>
            <td>{tDraw.toFixed(2)}</td>
            <td>{tElec.toFixed(2)}</td>
            <td>{tMoney.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

class IcmTable extends React.Component {
  render() {
    let { obj } = this.props
    let { name, updatetime } = obj
    let { buyenergy, withdraw, useenergy, remain, usemoney } = obj
    return (
      <div className='detail-wrapper'>
        <div className='table-title'>
          <p>计量点：{name}</p>
          <p>抄表日期：{dayjs(updatetime).format(DATE)}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>购电电量</th>
              <th>清除电量</th>
              <th>用电电量</th>
              <th>剩余电量</th>
              <th>用电电费</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{(buyenergy * 1).toFixed(2)}</td>
              <td>{(withdraw * 1).toFixed(2)}</td>
              <td>{(useenergy * 1).toFixed(2)}</td>
              <td>{(remain * 1).toFixed(2)}</td>
              <td>{(usemoney * 1).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

function esamTop({ obj, detail }) {
  if (!obj) {
    return null
  }
  let tBuy = 0,
    tDraw = 0,
    tMoney = 0
  for (let { buymoney, withdraw, usemoney } of detail) {
    tBuy += buymoney
    tDraw += withdraw
    tMoney += usemoney
  }
  let date = dayjs(obj.datatime)
  return (
    <div className='detail-wrapper'>
      <h3>{date.format('YYYY年MM月账单')}</h3>
      <div className='table-title'>
        <p>户名：{obj.hm}</p>
      </div>
      <table className='total'>
        <thead>
          <tr>
            <th>计费月份</th>
            <th>电表数量</th>
            <th>总购电金额</th>
            <th>用电电费</th>
            <th>退还金额</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{date.format(MONTH)}</td>
            <td>{detail.length}</td>
            <td>{tBuy.toFixed(2)}</td>
            <td>{tMoney.toFixed(2)}</td>
            <td>{tDraw.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

class EsamTable extends React.Component {
  render() {
    let { obj } = this.props
    let { name, updatetime } = obj
    let { withdraw, buymoney, remain, usemoney } = obj
    return (
      <div className='detail-wrapper'>
        <div className='table-title'>
          <p>计量点：{name}</p>
          <p>抄表日期：{dayjs(updatetime).format(DATE)}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>购电金额</th>
              <th>剩余金额</th>
              <th>用电金额</th>
              <th>退还金额</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{(buymoney * 1).toFixed(2)}</td>
              <td>{(remain * 1).toFixed(2)}</td>
              <td>{(usemoney * 1).toFixed(2)}</td>
              <td>{(withdraw * 1).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

function buildTop({ type, ...rest }) {
  switch (type) {
    case 3:
      return esamTop(rest)
    case 2:
      return icmTop(rest)
    case 1:
      return regularTop(rest)
    default:
      return null
  }
}

function buildTable({ type, ...rest }) {
  switch (type) {
    case 3:
      return <EsamTable key={rest.obj.pointid} {...rest} />
    case 2:
      return <IcmTable key={rest.obj.pointid} {...rest} />
    case 1:
      return regularTable(rest)
    default:
      return null
  }
}

export { buildTop, buildTable }
