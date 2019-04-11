import React from 'react'
import { List, InputItem, Button } from 'antd-mobile'
import './index.less'
import Avatar from '../../static/img/login.jpg'

class Login extends React.Component {
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
                            <Button type='primary' size='small' inline>
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

export default Login
