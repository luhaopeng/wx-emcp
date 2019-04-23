import React from 'react'
import Icon from '../icon'
import svg from '../../static/img/empty.svg'
import classNames from 'classnames'
import './index.less'

class Empty extends React.Component {
    render() {
        let { style, className } = this.props
        return (
            <div style={style} className={classNames('hl-empty', className)}>
                <Icon svg={svg} className='hl-empty-icon' />
                <p>暂无数据</p>
            </div>
        )
    }
}

export default Empty
