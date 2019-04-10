import React from 'react'
import './index.less'

class TabBar extends React.Component {
    render() {
        return <div className='hl-tab-bar'>{this.props.children}</div>
    }
}

class Item extends React.Component {
    static defaultProps = {
        tintColor: '#33A3F4',
        unselectedColor: '#949494'
    }

    render() {
        let { icon, label, selected, tintColor, unselectedColor } = this.props
        let color = selected ? tintColor : unselectedColor
        return (
            <div className='hl-tab-item'>
                <div style={{ color: color }}>{icon}</div>
                <p className='hl-tab-item-label' style={{ color: color }}>
                    {label}
                </p>
            </div>
        )
    }
}

TabBar.Item = Item

export default TabBar
