import React from 'react'
import Icon from '../icon'
import svg from '../../static/img/empty.svg'
import './index.less'

class Empty extends React.Component {
    render() {
        return (
            <div className={`hl-empty ${this.props.className}`}>
                <Icon svg={svg} className='hl-empty-icon' />
                <p>暂无数据</p>
            </div>
        )
    }
}

export default Empty
