import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { List, InputItem, Button, Toast } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import Guide from './guide'
import './index.less'
import Avatar from '../../static/img/login.jpg'
import { Mine, Test } from '../../api/url'
import { isWeChat, isProd, isTest } from '../../util/constants'
import LoginTypeSelector from './login-type-selector'
import Reporter from '../../util/reporter'

const DATE = 'YYYY-MM-DD HH:mm:ss'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      phone: '',
      account: '',
      password: '',
      error: false,
      errMsg: '',
      sent: false,
      sentBtnLabel: '获取验证码',
      loading: false,
      loginType: 0,
    }
  }

  handleSendCode = async () => {
    this.setState({ error: false })
    let { phone } = this.state
    phone = phone.replace(/\s/g, '')
    try {
      let { data } = await Mine.sms.query({ phone })
      if (data.errcode !== 0) {
        this.setState({ error: true, errMsg: data.errmsg })
      } else {
        this.second = 60
        this.setState({
          sent: true,
          sentBtnLabel: `重新发送(${this.second}秒)`,
        })
        this.timer = setInterval(() => {
          if (--this.second <= 0) {
            clearInterval(this.timer)
            this.second = 60
            this.setState({
              sent: false,
              sentBtnLabel: '获取验证码',
            })
          } else {
            this.setState({
              sentBtnLabel: `重新发送(${this.second}秒)`,
            })
          }
        }, 1000)
      }
    } catch (err) {
      Toast.fail('请求超时，请重试')
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('login/sendCode', '发送短信'))
    }
  }

  loginWithPhone = async () => {
    this.setState({ error: false, loading: true })
    let { phone, code } = this.state
    phone = phone.replace(/\s/g, '')
    if (!phone || !code) {
      this.setState({ error: true, errMsg: '请填写完整', loading: false })
      return
    }
    try {
      let { data } = await Mine.login.query({ phone, code })
      if (data.errcode !== 0) {
        this.setState({
          error: true,
          errMsg: data.errmsg,
          loading: false,
        })
      } else {
        this.setState({ loading: false })
        let customers = data.data.customerEnts
        if (customers.length === 1) {
          let id = customers[0].customerid
          localStorage.customerId = id
          localStorage.lastLogin = dayjs().format(DATE)

          if (isWeChat) {
            if (isProd || isTest) {
              await Mine.bind.query({
                openid: localStorage.openId,
                msgOpenId: localStorage.msgOpenId,
                customerid: id,
              })
            }
          }

          let { history, location } = this.props
          let { from } = location.state || { from: { pathname: '/' } }
          history.replace(from)
        } else {
          localStorage.relog = true
          localStorage.phone = phone
          let { history, location } = this.props
          let to = {
            pathname: '/login/guide',
            state: location.state || { from: { pathname: '/' } },
          }
          history.replace(to)
        }
      }
    } catch (err) {
      this.setState({ error: true, errMsg: '请求超时', loading: false })
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('login/login', '登录'))
    }
  }

  loginWithAccount = async () => {
    this.setState({ error: false, loading: true })
    let { account, password } = this.state
    account = account.replace(/\s/g, '')
    if (!account || !password) {
      this.setState({ error: true, errMsg: '请填写完整', loading: false })
      return
    }
    try {
      let { data } = await Mine.loginHH.query({ hh: account, password })
      if (data.errcode !== 0) {
        this.setState({
          error: true,
          errMsg: data.errmsg,
          loading: false,
        })
      } else {
        this.setState({ loading: false })
        const { customerid, shouldChangePwd } = data.data
        localStorage.customerId = customerid
        localStorage.lastLogin = dayjs().format(DATE)
        localStorage.shouldChangePwd = shouldChangePwd

        if (isWeChat) {
          await Mine.bind.query({
            openid: localStorage.openId,
            msgOpenId: localStorage.msgOpenId,
            customerid: customerid,
          })
        }

        let { history, location } = this.props
        let { from } = location.state || { from: { pathname: '/' } }
        history.replace(from)
      }
    } catch (err) {
      this.setState({ error: true, errMsg: '请求超时', loading: false })
      let reporter = new Reporter()
      reporter.setRequest(err)
      await Test.report.query(reporter.format('login/loginHH', '登录'))
    }
  }

  handleLogin = () => {
    const { loginType } = this.state
    if (loginType) {
      this.loginWithAccount()
    } else {
      this.loginWithPhone()
    }
  }

  handlePhoneChange = phone => this.setState({ phone })

  handleCodeChange = code => this.setState({ code })

  handleAccountChange = account => this.setState({ account })

  handlePasswordChange = password => this.setState({ password })

  handleLoginTypeChange = idx => this.setState({ loginType: idx, error: false })

  async componentDidMount() {
    let { openId } = localStorage
    if (openId) {
      Toast.loading('尝试自动登录...', 0)
      try {
        let { data } = await Mine.autoLogin.query({ openid: openId })
        Toast.hide()
        let { customerid, multiple, phone } = data.data
        if (customerid) {
          localStorage.customerId = customerid
          localStorage.relog = multiple
          localStorage.phone = phone
          localStorage.lastLogin = dayjs().format(DATE)
          let { history, location } = this.props
          let { from } = location.state || { from: { pathname: '/' } }
          history.replace(from)
        }
      } catch (err) {
        Toast.fail('请求超时')
        let reporter = new Reporter()
        reporter.setRequest(err)
        await Test.report.query(reporter.format('login/mount', '自动登录'))
      }
    }
  }

  render() {
    return (
      <div className='page-login'>
        <img className='login-avatar' src={Avatar} />
        {this.state.loginType ? (
          <List>
            <InputItem
              value={this.state.account}
              placeholder='填写户号'
              onChange={this.handleAccountChange}
              clear
            >
              户号
            </InputItem>
            <InputItem
              value={this.state.password}
              type='password'
              placeholder='填写密码'
              onChange={this.handlePasswordChange}
            >
              密码
            </InputItem>
          </List>
        ) : (
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
        )}
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
            show: this.state.error,
          })}
        >
          {this.state.errMsg}
        </p>
        <LoginTypeSelector onChange={this.handleLoginTypeChange} />
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
