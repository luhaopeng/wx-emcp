import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { List, InputItem, Button } from 'antd-mobile'
import Guide from './guide'
import './index.less'
import Avatar from '../../static/img/login.jpg'

class Login extends React.Component {
    handleCodeClick = () => {
        let { history, location } = this.props
        let to = {
            pathname: '/login/guide',
            state: { from: location.state.from || { pathname: '/' } }
        }
        history.push(to)
    }

    handleLogin = () => {
        localStorage.customerId = 65
        let { history, location } = this.props
        let { from } = location.state || { from: { pathname: '/' } }
        history.replace(from)
    }

    render() {
        return (
            <div className='page-login'>
                <img className='login-avatar' src={Avatar} />
                <List>
                    <InputItem type='phone' placeholder='填写手机号码'>
                        手机号码
                    </InputItem>
                    <InputItem
                        type='tel'
                        placeholder='填写验证码'
                        maxLength='6'
                        extra={
                            <Button
                                type='primary'
                                size='small'
                                inline
                                onClick={this.handleCodeClick}
                            >
                                获取验证码
                            </Button>
                        }
                    >
                        验证码
                    </InputItem>
                    <Button
                        className='login-btn'
                        type='primary'
                        onClick={this.handleLogin}
                    >
                        登录
                    </Button>
                </List>
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
