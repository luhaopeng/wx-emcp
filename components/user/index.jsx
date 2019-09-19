import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Button, Toast } from 'antd-mobile'
import dayjs from 'dayjs'
import Icon from '../icon'
import './index.less'
import { Mine, Test } from '../../api/url'
import PageHistory from './history'
import PageMeters from './meterList'
import Reporter from '../../util/reporter'

class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hm: '---',
            user: '---',
            phone: '---',
            balance: 0,
            type: 1,
            history: []
        }
    }

    handleRelog = () => {
        // redirect
        let { history, location } = this.props
        let to = {
            pathname: '/login/guide',
            state: { from: location }
        }
        history.replace(to)
    }

    handleChargeClick = () => {
        this.props.history.push('/pay')
    }

    handleMoreClick = () => {
        this.props.history.push('/user/history')
    }

    handleSignOut = async () => {
        // open toast
        Toast.loading('加载中...', 0)
        try {
            await Mine.unbind.query({ openid: localStorage.openId })
        } catch (err) {
            console.error(err)
            Toast.fail('请求超时，请重试')
        }
        // close toast
        Toast.hide()

        localStorage.clear()
        window.location.reload()
    }

    handleMeterListClick = () => {
        if (this.state.type > 1) {
            this.props.history.push('/user/meters')
        }
    }

    async componentDidMount() {
        // open toast
        Toast.loading('加载中...', 0)
        // query data
        let { customerId } = localStorage
        try {
            let resBasic = await Mine.basic.query({ customerid: customerId })
            let { customer } = resBasic.data.data
            if (!customer) {
                Toast.fail('账户已被注销，请重新登录', 3, () => {
                    localStorage.clear()
                    window.location.reload()
                })
                return
            }
            let resBalance = await Mine.balance.query({
                customerid: customerId
            })
            let { prepayType, icmList, account } = resBalance.data.data
            let resHistory = await Mine.history.query({
                customerid: customerId,
                num: -1
            })
            // close toast
            Toast.hide()

            // process balance
            let balance = 0
            if (parseInt(prepayType) === 1) {
                balance = account.usablemoney
            } else {
                for (let { remain } of icmList) {
                    balance += remain
                }
            }
            // process history
            let history = []
            if (resHistory.data.errcode === 0) {
                let {
                    esamRechargeHistory,
                    icmRechargeHistory,
                    rechargeHistory
                } = resHistory.data.data

                switch (parseInt(prepayType)) {
                    case 2:
                        history = icmRechargeHistory.map(item => {
                            let { handler, addTime, buyMoney } = item
                            return { handler, money: buyMoney, time: addTime }
                        })
                        break
                    case 3:
                        history = esamRechargeHistory.map(item => {
                            let { handler, addTime, money } = item
                            return { handler, money, time: addTime }
                        })
                        break
                    case 1:
                    default:
                        history = rechargeHistory.map(item => {
                            let {
                                handler,
                                addtime,
                                payMoney,
                                actualMoney
                            } = item
                            return {
                                handler,
                                time: addtime,
                                money: actualMoney || payMoney
                            }
                        })
                        break
                }
            }

            this.setState({
                hm: customer.hm,
                user: customer.linkman,
                phone: customer.phone,
                type: parseInt(prepayType),
                balance,
                history
            })
        } catch (err) {
            Toast.fail('请求超时，请刷新页面')
            let reporter = new Reporter()
            reporter.setRequest(err)
            await Test.report.query(reporter.format('user/mount', '获取数据'))
        }
    }

    render() {
        let { hm, user, phone, balance, type, history } = this.state
        let list = history.map((item, idx) => (
            <li key={idx}>
                <div>
                    <p>{item.handler}</p>
                    <span>
                        {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                </div>
                <b>+ {item.money.toFixed(2)}</b>
            </li>
        ))
        list.push(
            history.length < 2 ? (
                <li key='more'>无更多记录</li>
            ) : (
                <li key='more' onClick={this.handleMoreClick}>
                    查看更多记录
                    <Icon
                        svg={require('../../static/img/right.svg').default}
                        className='icon'
                    />
                </li>
            )
        )
        return (
            <div className='page-user'>
                <div className='top'>
                    <h2 className='title'>{hm}</h2>
                    <ul>
                        <li>{user}</li>
                        <li>{phone}</li>
                    </ul>
                </div>
                <div className='content'>
                    <section>
                        <h3>
                            {type === 1
                                ? '账户余额'
                                : `剩余电${type === 2 ? '量' : '费'}`}
                        </h3>
                        <div className='balance'>
                            <b onClick={this.handleMeterListClick}>
                                {balance.toFixed(2)}
                                <span>{type === 2 ? '度' : '元'}</span>
                            </b>
                            <Button
                                inline
                                type='warning'
                                size='small'
                                className='charge-btn'
                                activeClassName='charge-btn-active'
                                onClick={this.handleChargeClick}
                            >
                                {type === 1 ? '充值' : '购电'}
                            </Button>
                        </div>
                    </section>
                    <section>
                        <h3>{type === 1 ? '充值记录' : '购电记录'}</h3>
                        <ul className='history'>{list}</ul>
                    </section>
                    <section>
                        <h3>其他</h3>
                        {!localStorage.relog ? null : (
                            <Button
                                className='op-btn'
                                onClick={this.handleRelog}
                            >
                                切换户号
                            </Button>
                        )}
                        <Button
                            type='warning'
                            className='op-btn'
                            onClick={this.handleSignOut}
                        >
                            退出登录
                        </Button>
                    </section>
                </div>
            </div>
        )
    }
}

const Render = () => (
    <Switch>
        <Route exact path='/user' component={User} />
        <Route path='/user/history' component={PageHistory} />
        <Route path='/user/meters' component={PageMeters} />
    </Switch>
)

export default Render
