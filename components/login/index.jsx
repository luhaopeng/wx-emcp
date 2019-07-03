import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { List, InputItem, Button, Toast } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import Guide from './guide'
import './index.less'
import Avatar from '../../static/img/login.jpg'
import { Mine, Haina } from '../../api/url'
import { isWeChat, isProd, isTest, isHaina } from '../../util/constants'

const DATE = 'YYYY-MM-DD HH:mm:ss'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '',
            phone: '',
            error: false,
            errMsg: '',
            sent: false,
            sentBtnLabel: '获取验证码',
            loading: false
        }
    }

    handleSendCode = async () => {
        // hide error msg
        this.setState({ error: false })
        // get phone
        let { phone } = this.state
        phone = phone.replace(/\s/g, '')
        // send
        let { data } = await Mine.sms.query({ phone })
        if (data.errcode !== 0) {
            this.setState({ error: true, errMsg: data.errmsg })
        } else {
            this.second = 60
            this.setState({
                sent: true,
                sentBtnLabel: `重新发送(${this.second}秒)`
            })
            this.timer = setInterval(() => {
                if (--this.second <= 0) {
                    clearInterval(this.timer)
                    this.second = 60
                    this.setState({ sent: false, sentBtnLabel: '获取验证码' })
                } else {
                    this.setState({
                        sentBtnLabel: `重新发送(${this.second}秒)`
                    })
                }
            }, 1000)
        }
    }

    handleLogin = async () => {
        // hide error msg
        this.setState({ error: false, loading: true })
        // get params
        let { phone, code } = this.state
        phone = phone.replace(/\s/g, '')
        // empty check
        if (!phone || !code) {
            this.setState({ error: true, errMsg: '请填写完整', loading: false })
            return
        }
        // login
        let { data } = await Mine.login.query({ phone, code })
        if (data.errcode !== 0) {
            this.setState({ error: true, errMsg: data.errmsg, loading: false })
        } else {
            this.setState({ loading: false })
            // success
            let customers = data.data.customerEnts
            if (customers.length === 1) {
                let id = customers[0].customerid
                localStorage.customerId = id
                localStorage.lastLogin = dayjs().format(DATE)

                // bind
                if (isWeChat) {
                    if (isProd || isTest) {
                        await Mine.bind.query({
                            openid: localStorage.openId,
                            customerid: id
                        })
                    } else if (isHaina) {
                        await Haina.bind.query({
                            residentid: localStorage.residentId,
                            customerid: id
                        })
                    }
                }

                // redirect
                let { history, location } = this.props
                let { from } = location.state || { from: { pathname: '/' } }
                history.replace(from)
            } else {
                // >1
                localStorage.relog = true
                localStorage.phone = phone
                // redirect
                let { history, location } = this.props
                let to = {
                    pathname: '/login/guide',
                    state: location.state || { from: { pathname: '/' } }
                }
                history.replace(to)
            }
        }
    }

    handlePhoneChange = phone => {
        this.setState({ phone })
    }

    handleCodeChange = code => {
        this.setState({ code })
    }

    async componentDidMount() {
        let { openId } = localStorage
        if (openId) {
            Toast.loading('尝试自动登录...', 0)
            let { data } = await Mine.autoLogin.query({ openid: openId })
            Toast.hide()
            let { customerid, multiple, phone } = data.data
            if (customerid) {
                localStorage.customerId = customerid
                localStorage.relog = multiple
                localStorage.phone = phone
                localStorage.lastLogin = dayjs().format(DATE)
                // redirect
                let { history, location } = this.props
                let { from } = location.state || { from: { pathname: '/' } }
                history.replace(from)
            }
        }
    }

    render() {
        return (
            <div className='page-login'>
                <img className='login-avatar' src={Avatar} />
                <List>
                    <InputItem
                        value={this.state.phone}
                        type='phone'
                        placeholder='填写手机号码'
                        onChange={this.handlePhoneChange}
                    >
                        手机号码
                    </InputItem>
                    <InputItem
                        value={this.state.code}
                        type='tel'
                        placeholder='填写验证码'
                        onChange={this.handleCodeChange}
                        maxLength='6'
                        extra={
                            <Button
                                disabled={this.state.sent}
                                type='primary'
                                size='small'
                                inline
                                onClick={this.handleSendCode}
                            >
                                {this.state.sentBtnLabel}
                            </Button>
                        }
                    >
                        验证码
                    </InputItem>
                </List>
                <Button
                    loading={this.state.loading}
                    className='login-btn'
                    type='primary'
                    onClick={this.handleLogin}
                >
                    登录
                </Button>
                <p
                    className={classNames('error', {
                        show: this.state.error
                    })}
                >
                    {this.state.errMsg}
                </p>
            </div>
        )
    }
}

const Render = () => (
    <Switch>
        <Route path='/login' exact component={Login} />
        <Route path='/login/guide' component={Guide} />
    </Switch>
)

export default Render
