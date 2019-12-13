import React from 'react'
import dayjs from 'dayjs'
import { Icon } from 'antd-mobile'
import { Base, Power, Fund } from '../extra'

const DATE = 'YYYY-MM-DD'

class Rating extends React.Component {
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
        this.setState({ collapse: false })
    }

    render() {
        let { collapse } = this.state
        let { obj } = this.props
        let { pricerule, pointname, time, data, extra } = obj
        let { base, power, fund, fundList } = extra
        let { start, end, rate, energy, percent, cost, total } = data
        let { start_jian, start_feng, start_ping, start_gu } = data
        let { end_jian, end_feng, end_ping, end_gu } = data
        let { energy_jian, energy_feng, energy_ping, energy_gu } = data
        return (
            <div className='detail-wrapper'>
                <div className='table-title'>
                    <p>计量点：{pointname}</p>
                    <p>抄表日期：{dayjs(time).format(DATE)}</p>
                </div>
                <div className='panel-label' onClick={this.handleCollapse}>
                    <p>电度电费合计（元）</p>
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
                                <th>费率</th>
                                <th>上期示数</th>
                                <th>本期示数</th>
                                <th>倍率</th>
                                <th>
                                    单价
                                    <br />
                                    (元/度)
                                </th>
                                <th>
                                    电量
                                    <br />
                                    (度)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>总</th>
                                <td>{(start * 1).toFixed(2)}</td>
                                <td>{(end * 1).toFixed(2)}</td>
                                <td rowSpan='5'>{rate}</td>
                                <td>/</td>
                                <td>{(energy * 1).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>尖</th>
                                <td>{(start_jian * 1).toFixed(2)}</td>
                                <td>{(end_jian * 1).toFixed(2)}</td>
                                <td>{pricerule.value1}</td>
                                <td>{(energy_jian * 1).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>峰</th>
                                <td>{(start_feng * 1).toFixed(2)}</td>
                                <td>{(end_feng * 1).toFixed(2)}</td>
                                <td>{pricerule.value2}</td>
                                <td>{(energy_feng * 1).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>平</th>
                                <td>{(start_ping * 1).toFixed(2)}</td>
                                <td>{(end_ping * 1).toFixed(2)}</td>
                                <td>{pricerule.value3}</td>
                                <td>{(energy_ping * 1).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>谷</th>
                                <td>{(start_gu * 1).toFixed(2)}</td>
                                <td>{(end_gu * 1).toFixed(2)}</td>
                                <td>{pricerule.value4}</td>
                                <td>{(energy_gu * 1).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                {base ? <Base data={base} /> : null}
                {power ? <Power data={power} /> : null}
                {fundList ? <Fund fund={fund} list={fundList} /> : null}
                <table className='total'>
                    <tbody>
                        <tr>
                            <th>
                                总金额
                                <br />
                                (元)
                            </th>
                            <td>{(total * 1).toFixed(2)}</td>
                            <th>分摊</th>
                            <td>{percent}%</td>
                            <th>
                                金额
                                <br />
                                (元)
                            </th>
                            <td>{((total * percent) / 100).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Rating
