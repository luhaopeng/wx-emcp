import React from 'react'
import { Icon } from 'antd-mobile'

class Power extends React.Component {
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
        let { standard, current, adjust, cost } = this.props.data
        return (
            <React.Fragment>
                <div className='panel-label' onClick={this.handleCollapse}>
                    <p>力率电费合计（元）</p>
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
                                <th>功率因数标准</th>
                                <th>实际功率因数</th>
                                <th>调整比例（%）</th>
                                <th>电费（元）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{standard}</th>
                                <td>{current}</td>
                                <td>{adjust}</td>
                                <td>{(cost * 1).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </React.Fragment>
        )
    }
}

export default Power
