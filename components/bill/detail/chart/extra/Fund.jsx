import React from 'react'
import { Icon } from 'antd-mobile'

class Fund extends React.Component {
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
        let { fund, list } = this.props
        return (
            <React.Fragment>
                <div className='panel-label' onClick={this.handleCollapse}>
                    <p>基金电费合计（元）</p>
                    <p>{(fund * 1).toFixed(2)}</p>
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
                                <th>项目</th>
                                <th>电量（kWh）</th>
                                <th>电价（元/度）</th>
                                <th>电费（元）</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, idx) => (
                                <tr key={idx}>
                                    <th>{item.label}</th>
                                    <td>{item.energy}</td>
                                    <td>{item.price}</td>
                                    <td>{(item.cost * 1).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </React.Fragment>
        )
    }
}

export default Fund
