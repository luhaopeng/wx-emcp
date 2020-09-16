import React from 'react'
import classNames from 'classnames'
import { InputItem, List, Button, Toast } from 'antd-mobile'
import { Mine } from '../../../api/url'
import './index.less'

class ChangePwd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
      error: false,
      errMsg: '',
    }
  }

  handleOldPwdChange = oldPwd => this.setState({ oldPwd })

  handleNewPwdChange = newPwd => this.setState({ newPwd })

  handleConfirmPwdChange = confirmPwd => this.setState({ confirmPwd })

  handleSave = async () => {
    this.setState({ error: false, loading: true })

    const { oldPwd, newPwd, confirmPwd } = this.state

    if (!oldPwd || !newPwd || !confirmPwd) {
      this.setState({ error: true, errMsg: '请填写完整', loading: false })
      return
    }
    if (newPwd !== confirmPwd) {
      this.setState({
        error: true,
        errMsg: '两次输入的新密码不相同',
        loading: false,
      })
      return
    }
    if (oldPwd === newPwd) {
      this.setState({
        error: true,
        errMsg: '新密码不能与原密码相同',
        loading: false,
      })
      return
    }

    const { data } = await Mine.changePwd.query({
      customerid: localStorage.customerId,
      oldPwd,
      newPwd,
    })
    if (data.errcode !== 0) {
      this.setState({
        error: true,
        errMsg: data.errmsg,
        loading: false,
      })
    } else {
      this.setState({ loading: false })
      Toast.success('修改成功，即将重新登录...', 3, async () => {
        await Mine.unbind.query({ openid: localStorage.openId })

        localStorage.removeItem('customerId')
        localStorage.removeItem('shouldChangePwd')
        this.props.history.replace('/')
      })
    }
  }

  render() {
    return (
      <div className='page-change-pwd'>
        <List>
          <InputItem
            value={this.state.oldPwd}
            type='password'
            placeholder='填写原密码'
            onChange={this.handleOldPwdChange}
          >
            原密码
          </InputItem>
          <InputItem
            value={this.state.newPwd}
            type='password'
            placeholder='填写新密码'
            onChange={this.handleNewPwdChange}
          >
            新密码
          </InputItem>
          <InputItem
            value={this.state.confirmPwd}
            type='password'
            placeholder='再次填写新密码'
            onChange={this.handleConfirmPwdChange}
          >
            确认新密码
          </InputItem>
        </List>
        <Button
          loading={this.state.loading}
          className='save-btn'
          type='primary'
          onClick={this.handleSave}
        >
          保存
        </Button>
        <p
          className={classNames('error', {
            show: this.state.error,
          })}
        >
          {this.state.errMsg}
        </p>
      </div>
    )
  }
}

export default ChangePwd
