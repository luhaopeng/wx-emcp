import React from 'react'
import './index.less'

class Item extends React.Component {
    static defaultProps = {
        money: 10.0,
        price: 1.0,
        discount: 1.0,
        unit: '元',
        onClick: function() {}
    }

    render() {
        let { money, price, discount, unit, onClick } = this.props
        return (
            <button
                className='hl-option'
                onClick={() => {
                    onClick(money)
                }}
            >
                {`${(money * discount * price).toFixed(2)} ${unit}`}
                <br />
                <span>{`售价 ${money.toFixed()} 元`}</span>
            </button>
        )
    }
}

class Option extends React.Component {
    render() {
        return <div className='hl-option-group'>{this.props.children}</div>
    }
}

Option.Item = Item

export default Option
