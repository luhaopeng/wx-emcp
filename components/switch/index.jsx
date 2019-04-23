import React from 'react'
import classNames from 'classnames'
import './index.less'

class Switch extends React.Component {
    render() {
        let { onLabel, offLabel, checked, className = '', onClick } = this.props
        let style = classNames('hl-switch', className, {
            'hl-switch-checked': checked
        })
        return (
            <button
                type='button'
                role='switch'
                className={style}
                onClick={onClick}
            >
                <span className='hl-switch-label'>
                    {checked ? onLabel : offLabel}
                </span>
            </button>
        )
    }
}

export default Switch
