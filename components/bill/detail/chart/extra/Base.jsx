import React from 'react'
import { Icon } from 'antd-mobile'

class Base extends React.Component {
    constructor(props) {
        super(props)
        this.state = { collapse: true }
    }

    handleCollapse = () => {
        let { collapse } = this.state
        this.setState({ collapse: !collapse })
    }

    componentDidMount() {
        this.style = {
            height: `${this.refs.content.scrollHeight}px`,
            opacity: 1
        }
    }

    render() {
        let { collapse } = this.state
        let { type, label, value, price, cost } = this.props.data
        return (
            <React.Fragment>
                <div className='panel-label' onClick={this.handleCollapse}>
                    <p>基本电费合计（元）</p>
                    <p>{(cost * 1).toFixed(2)}</p>
                    <Icon
                        type={collapse ? 'down' : 'up'}
                        size='xs'
                        color='#999'
                    />
                </div>
                <section
                    className='collapsible'
                    style={collapse ? null : this.style}
                    ref='content'
                >
                    <table>
                        <thead>
                            <tr>
                                <th>计算方式</th>
                                <th>{label}</th>
                                <th>电价（元/度）</th>
                                <th>电费（元）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{type}</th>
                                <td>{value}</td>
                                <td>{(price * 1).toFixed(2)}</td>
                                <td>{(cost * 1).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </React.Fragment>
        )
    }
}

export default Base
