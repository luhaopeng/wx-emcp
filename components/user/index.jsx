import React from 'react'
import { Button } from 'antd-mobile'
import Icon from '../icon'
import './index.less'

class User extends React.Component {
    relog() {
        console.log('relog') // eslint-disable-line
    }

    render() {
        return (
            <div className={`page-user ${this.props.className || ''}`}>
                <div className='top'>
                    <h2 className='title'>张腾</h2>
                    <ul>
                        <li>张腾</li>
                        <li>18868823613</li>
                    </ul>
                </div>
                <div className='content'>
                    <section>
                        <h3>账户余额</h3>
                        <div className='balance'>
                            <b>
                                0.00 <span>元</span>
                            </b>
                            <button>充值</button>
                        </div>
                    </section>
                    <section>
                        <h3>充值记录</h3>
                        <ul className='history'>
                            <li>
                                <div>
                                    <p>微信支付</p>
                                    <span>2019-02-21 13:29:58</span>
                                </div>
                                <b>+ 0.01</b>
                            </li>
                            <li>
                                <div>
                                    <p>支付宝</p>
                                    <span>2019-02-21 13:29:52</span>
                                </div>
                                <b>+ 0.01</b>
                            </li>
                            <li>
                                查看更多记录
                                <Icon
                                    svg={
                                        require('../../static/img/right.svg')
                                            .default
                                    }
                                    className='icon'
                                />
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h3>其他</h3>
                        <Button className='op-btn' onClick={this.relog}>
                            切换户号
                        </Button>
                        <Button type='warning' className='op-btn'>
                            退出登录
                        </Button>
                    </section>
                </div>
            </div>
        )
    }
}

export default User
