import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Button, List, Radio } from 'antd-mobile'
import Icon from '../icon'
import './index.less'
import { Wechat } from '../../api/url'
import { isDev, isTest, isWeChat } from '../../util/constants'
import OptionGroup from './option'
import Result from './result'
import Redirect from './redirect'

const Option = OptionGroup.Item

class Pay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            payType: 1
        }
    }

    handleOptionClick = () => {
        if (this.state.payType === 1) {
            this.props.history.push('/pay/result')
        } else {
            this.props.history.push('/pay/redirect')
        }
    }

    handleNextClick = () => {
        this.props.history.push('/paid')
    }

    async componentDidMount() {
        if (!isDev && isWeChat) {
            // config wechat jsapi
            let { data } = await Wechat.config.query({
                url: window.location.href
            })
            // eslint-disable-next-line no-undef
            wx.config({
                debug: isDev || isTest,
                appId: data.data.wxConfig.appId,
                timestamp: data.data.wxConfig.timestamp,
                nonceStr: data.data.wxConfig.nonceStr,
                signature: data.data.wxConfig.signature,
                jsApiList: ['chooseWXPay']
            })
        }
    }

    render() {
        return (
            <div className='page-pay'>
                <div className='top'>
                    <p>账户余额 (元)</p>
                    <h1>1925.71</h1>
                </div>
                <div className='content'>
                    <section>
                        <h3>支付方式</h3>
                        <List>
                            <Radio.RadioItem
                                thumb={
                                    <Icon
                                        size='sm'
                                        svg={
                                            require('../../static/img/wechat.svg')
                                                .default
                                        }
                                    />
                                }
                                checked={this.state.payType === 1}
                                onChange={() => {
                                    this.setState({ payType: 1 })
                                }}
                            >
                                微信支付
                            </Radio.RadioItem>
                            <Radio.RadioItem
                                thumb={
                                    <Icon
                                        size='sm'
                                        svg={
                                            require('../../static/img/alipay.svg')
                                                .default
                                        }
                                    />
                                }
                                checked={this.state.payType === 2}
                                onChange={() => {
                                    this.setState({ payType: 2 })
                                }}
                            >
                                支付宝
                            </Radio.RadioItem>
                        </List>
                    </section>
                    <section>
                        <h3>充值金额</h3>
                        <OptionGroup>
                            {[10, 50, 100, 500, 1000, 5000].map(val => {
                                return (
                                    <Option
                                        key={val}
                                        price={val}
                                        onClick={this.handleOptionClick}
                                    />
                                )
                            })}
                        </OptionGroup>
                        <div className='fee'>
                            <Icon
                                size='xs'
                                svg={
                                    require('../../static/img/yuan.svg').default
                                }
                            />
                            <input type='number' placeholder='其他金额' />
                        </div>
                    </section>
                    <section>
                        <Button
                            type='primary'
                            className='next-btn'
                            activeClassName='active'
                            onClick={this.handleNextClick}
                        >
                            下一步
                        </Button>
                    </section>
                </div>
            </div>
        )
    }
}

const Render = () => (
    <Switch>
        <Route exact path='/pay' component={Pay} />
        <Route path='/pay/result' component={Result} />
        <Route path='/pay/redirect' component={Redirect} />
    </Switch>
)

export default Render
