import React from 'react'
import { Button, Toast } from 'antd-mobile'
import queryString from 'query-string'
import Icon from '../../icon'
import './index.less'
import { Pay, Test } from '../../../api/url'
import Reporter from '../../../util/reporter'

const ResultEnum = {
  regular: {
    unknown: {
      title: '充值尚未到账',
      message: () => (
        <p>
          预计10分钟内到账
          <br />
          请稍后前往个人中心查询充值记录
        </p>
      ),
    },
    succeed: {
      title: '充值成功',
      message: remain => (
        <p>
          当前余额为 <b>{remain.toFixed(2)}</b> 元
        </p>
      ),
    },
    error: {
      title: '交易失败或关闭',
      message: () => <p>交易超时, 请重新发起交易</p>,
    },
  },
  icm: {
    unknown: {
      title: '支付尚未到账',
      message: () => <p>请稍后关注公众号推送消息</p>,
    },
    processing: {
      title: '电量下发中',
      message: () => <p>请稍后关注公众号推送消息</p>,
    },
    succeed: {
      title: '购电成功',
      message: () => <p>请稍后关注卡表电量</p>,
    },
    error: {
      title: '交易失败或关闭',
      message: () => <p>交易超时, 请重新发起交易</p>,
    },
    refund: {
      title: '购电失败',
      message: () => (
        <p>
          已退款
          <br />
          请稍后关注您的余额信息
        </p>
      ),
    },
    warning: {
      title: '购电超时',
      message: () => (
        <p>
          请到物业处人工处理
          <br />
          本次购电金额无需重复缴纳
        </p>
      ),
    },
  },
}

function categorize({ type, recharge, operate }) {
  let cat, status
  if (type === 2 || type === 3) {
    // icm
    cat = 'icm'
    switch (recharge) {
      case 0:
        status = 'unknown'
        break
      case 1:
        switch (operate) {
          case 0:
            status = 'processing'
            break
          case 1:
            status = 'succeed'
            break
          case 2:
            status = 'error'
            break
          case 3:
            status = 'warning'
            break
          default:
            break
        }
        break
      case 2:
        status = 'error'
        break
      case 3:
        status = 'refund'
        break
      default:
        break
    }
  } else {
    // regular
    cat = 'regular'
    switch (recharge) {
      case 0:
        status = 'unknown'
        break
      case 1:
        status = 'succeed'
        break
      case 2:
        status = 'error'
        break
    }
  }
  return { cat, status }
}

class PayResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'query',
      title: '查询中',
      message: () => {},
      remain: 0,
    }
  }

  handleRedirectUserClick = () => {
    this.props.history.push('/user')
  }

  handleRedirectPayClick = () => {
    this.props.history.push('/pay')
  }

  async componentDidMount() {
    let { type, id } = queryString.parse(this.props.location.search)
    Toast.loading('查询中...', 0)
    try {
      let { data } = await Pay.result.query({ rechargeid: id, type })
      Toast.hide()
      let { rechargeResult, operateResult, remain } = data.data
      let { cat, status } = categorize({
        type,
        recharge: rechargeResult,
        operate: operateResult,
      })
      let result = ResultEnum[cat][status]
      let { title, message } = result
      this.setState({ status, title, message, remain })
    } catch (err) {
      Toast.fail('查询超时，请刷新页面')
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('pay/result/mount', '查询结果'))
    }
  }

  render() {
    let { status, title, message, remain } = this.state
    return (
      <div className='page-result'>
        <Icon
          className='result-icon'
          svg={require(`../../../static/img/result/${status}.svg`).default}
        />
        <h2>{title}</h2>
        {message(remain)}
        <footer>
          <Button type='primary' onClick={this.handleRedirectUserClick}>
            前往个人中心
          </Button>
          <Button onClick={this.handleRedirectPayClick}>返回充值页</Button>
        </footer>
      </div>
    )
  }
}

export default PayResult
