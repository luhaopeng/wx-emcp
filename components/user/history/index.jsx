import React from 'react'
import { List } from 'antd-mobile'
import dayjs from 'dayjs'
import './index.less'

class History extends React.Component {
    render() {
        const data = [
            {
                handle: '微信支付',
                addTime: '2019-04-12T10:55:45',
                money: 0.01
            },
            {
                handle: '支付宝',
                addTime: '2019-04-11T10:55:45',
                money: 0.01
            },
            {
                handle: '支付宝',
                addTime: '2019-04-10T10:55:45',
                money: 0.01
            },
            {
                handle: '微信支付',
                addTime: '2019-04-12T10:55:45',
                money: 0.01
            },
            {
                handle: '微信支付',
                addTime: '2019-04-09T10:55:45',
                money: 0.01
            },
            {
                handle: '支付宝',
                addTime: '2019-04-08T10:55:45',
                money: 0.01
            }
        ]
        let list = data.map((val, idx) => (
            <List.Item key={idx}>
                <div className='history-row'>
                    <div className='history-item-left'>
                        <h4>{val.handle}</h4>
                        <span>
                            {dayjs(val.addTime).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                    </div>
                    <div className='history-item'>+ {val.money.toFixed(2)}</div>
                </div>
            </List.Item>
        ))
        list.push(
            <List.Item key='more'>
                <div className='more'>加载更多</div>
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
