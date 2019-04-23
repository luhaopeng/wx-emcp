import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { List, InputItem, Button } from 'antd-mobile'
import classNames from 'classnames'
import queryString from 'query-string'
import Guide from './guide'
import './index.less'
import Avatar from '../../static/img/login.jpg'
import { Mine, Wechat } from '../../api/url'
import { isWeChat, isDev, authUrl } from '../../util/constants'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '',
            phone: '',
            error: false,
            errMsg: '',
            sent: false,
            sentBtnLabel: '获取验证码'
        }
        let { code } = queryString(props.location.search)
        if (!isDev && isWeChat && !localStorage.openId) {
            if (!code) {
                window.location.href = authUrl
            } else {
                this.code = code
            }
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
        this.setState({ error: false })
        // get params
        let { phone, code } = this.state
        phone = phone.replace(/\s/g, '')
        // login
        let { data } = await Mine.login.query({ phone, code })
        if (data.errcode !== 0) {
            this.setState({ error: true, errMsg: data.errmsg })
        } else {
            // success
            let customers = data.data.customerEnts
            if (customers.length === 1) {
                localStorage.customerId = customers[0].customerid
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
                    state: { from: location.state.from || { pathname: '/' } }
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
        if (!isDev && isWeChat && !localStorage.openId && this.code) {
            let { data } = await Wechat.auth.query({ code: this.code })
            localStorage.openId = data.data.openId
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
