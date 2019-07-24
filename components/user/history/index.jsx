import React from 'react'
import { List, Toast } from 'antd-mobile'
import dayjs from 'dayjs'
import './index.less'
import { Mine } from '../../../api/url'

class History extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [],
            done: false,
            type: 1
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
        // open toast
        Toast.loading('加载中...', 0)
        // query data
        let { customerId } = localStorage
        try {
            let { data } = await Mine.history.query({
                customerid: customerId,
                num: this.num++
            })
            // close toast
            Toast.hide()
            if (data.errcode !== 0) {
                this.setState({ done: true })
            } else {
                let {
                    prepayType,
                    esamRechargeHistory,
                    icmRechargeHistory,
                    rechargeHistory
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
                                name: pointName
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
                                name: pointName
                            }
                        })
                        break
                    case 1:
                    default:
                        historySup = rechargeHistory.map(item => {
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
                let { history } = this.state
                this.setState({
                    type: parseInt(prepayType),
                    history: history.concat(historySup)
                })
            }
        } catch (err) {
            console.error(err)
            Toast.fail('请求超时')
        }
    }

    render() {
        let { history, type } = this.state
        let list = history.map((val, idx) => (
            <List.Item key={idx}>
                <div className='history-row'>
                    <div className='history-item'>
                        <h4>{val.handler}</h4>
                        <span>
                            {dayjs(val.time).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                    </div>
                    <div className='history-item'>
                        <h4>+ {val.money.toFixed(2)}</h4>
                        {type > 1 ? <span>{val.name}</span> : null}
                    </div>
                </div>
            </List.Item>
        ))
        list.push(
            <List.Item key='more'>
                <div className='more' onClick={this.queryData}>
                    {this.state.done ? '没有更多了' : '加载更多'}
                </div>
            </List.Item>
        )
        return (
            <div className='page-history'>
                <List>{list}</List>
            </div>
        )
    }
}

export default History
