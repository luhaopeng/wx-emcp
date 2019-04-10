import React from 'react'
import './index.less'

class Item extends React.Component {
    constructor(props) {
        super(props)
        let price = parseFloat(props.price)
        let discount = parseFloat(props.discount)
        let amount = price * discount
        this.state = {
            price: price.toFixed(),
            amount: amount.toFixed(2)
        }
    }

    static defaultProps = {
        price: 10.0,
        discount: 1.0,
        unit: '元',
        onClick: function() {}
    }

    render() {
        return (
            <button
                className='hl-option'
                onClick={() => {
                    this.props.onClick(this.props.price)
                }}
            >
                {`${this.state.amount} ${this.props.unit}`}
                <br />
                <span>{`售价 ${this.state.price} ${this.props.unit}`}</span>
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
