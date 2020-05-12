import React from 'react'
import dayjs from 'dayjs'
import { Icon } from 'antd-mobile'
import { Base, Power, Fund, Other } from '../extra'

const DATE = 'YYYY-MM-DD'

class Singlet extends React.Component {
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
      opacity: 1,
    }
    this.setState({ collapse: false })
  }

  render() {
    let { collapse } = this.state
    let { obj, billType } = this.props
    let type = billType ? '水' : '电'
    let unit = billType ? '吨' : '度'
    let { pricerule, pointname, time, data, extra } = obj
    let { start, end, rate, energy, percent, cost, total } = data
    let { base, power, fund, fundList, other } = extra
    return (
      <div className='detail-wrapper'>
        <div className='table-title'>
          <p>计量点：{pointname}</p>
          <p>抄表日期：{dayjs(time).format(DATE)}</p>
        </div>
        <div className='panel-label' onClick={this.handleCollapse}>
          <p>{billType ? '水费' : '电度电费'}合计（元）</p>
          <p>{(cost * 1).toFixed(2)}</p>
          <Icon type={collapse ? 'down' : 'up'} size='xs' color='#999' />
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
                  (元/{unit})
                </th>
                <th>
                  {type}量<br />({unit})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>总</th>
                <td>{(start * 1).toFixed(2)}</td>
                <td>{(end * 1).toFixed(2)}</td>
                <td>{rate}</td>
                <td>{pricerule.value1}</td>
                <td>{(energy * 1).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </section>
        {base ? <Base data={base} /> : null}
        {power ? <Power data={power} /> : null}
        {fundList ? <Fund fund={fund} list={fundList} /> : null}
        {other ? <Other data={other} /> : null}
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

export default Singlet
