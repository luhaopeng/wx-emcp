import React from 'react'
import classNames from 'classnames'
import './index.less'

class LoginTypeSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      leftActive: true,
    }
  }

  onSelect(isLeft = false) {
    const { leftActive } = this.state
    const { onChange } = this.props
    if (leftActive !== isLeft) {
      this.setState({ leftActive: !leftActive })
      if (typeof onChange === 'function') {
        onChange(Boolean(!isLeft))
      }
    }
  }

  render() {
    return (
      <section className='login-type-selector'>
        <div className='option option-left'>
          <a
            className={classNames('link', { active: this.state.leftActive })}
            onClick={() => this.onSelect(true)}
          >
            手机验证码登录
          </a>
        </div>
        <span className='divider'>|</span>
        <div className='option'>
          <a
            className={classNames('link', { active: !this.state.leftActive })}
            onClick={() => this.onSelect()}
          >
            户号登录
          </a>
        </div>
      </section>
    )
  }
}

export default LoginTypeSelector
