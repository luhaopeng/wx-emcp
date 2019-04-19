import React from 'react'
import { SegmentedControl, List } from 'antd-mobile'
import { Switch, Route } from 'react-router-dom'
import dayjs from 'dayjs'
import Detail from './detail'
import './index.less'
import { Elec } from '../../api/url'

const full = 'YYYY-MM-DD HH:mm:ss'

class Bill extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            billType: 0, // 0 电；1 水,
            single: true,
            type: 1, // 1 regular; 2 icm; 3 esam
            curElec: null,
            curWater: null,
            done: false,
            pastElec: [],
            pastWater: []
        }
        this.num = 0
    }

    handleBillTypeChange = e => {
        let idx = e.nativeEvent.selectedSegmentIndex
        this.setState({ billType: idx })
    }

    handleListClick = time => {
        this.props.history.push(`/bill/detail/${this.state.billType}/${time}`)
    }

    queryCurrent = async () => {
        let { data } = await Elec.curBill.query({
            customerid: localStorage.customerId
        })

        if (data.errcode === 0) {
            let { prepayType, curMonth, curMonthWater } = data.data
            this.setState({
                billType: !curMonth && curMonthWater ? 1 : 0,
                single: !(curMonth && curMonthWater),
                type: prepayType,
                curElec: curMonth,
                curWater: curMonthWater
            })
        }
    }

    queryPast = async () => {
        if (this.state.done) {
            return
        }
        let { data } = await Elec.billList.query({
            customerid: localStorage.customerId,
            num: this.num++
        })
        if (data.errcode !== 0) {
            this.setState({ done: true })
        } else {
            let {
                prepayType,
                briefList: elec,
                briefWaterList: water
            } = data.data
            if (this.num > 1) {
                let { pastElec, pastWater } = this.state
                this.setState({
                    pastElec: pastElec.concat(elec),
                    pastWater: pastWater.concat(water)
                })
            } else {
                this.setState({
                    billType: elec.length === 0 && water.length > 0 ? 1 : 0,
                    single: !(elec.length > 0 && water.length > 0),
                    type: prepayType,
                    pastElec: elec,
                    pastWater: water
                })
            }
        }
    }

    componentDidMount() {
        this.queryCurrent()
        this.queryPast()
    }

    render() {
        let {
            type,
            single,
            billType,
            curElec,
            curWater,
            pastElec,
            pastWater,
            done
        } = this.state
        let cur = billType === 1 ? curWater : curElec
        let past = billType === 1 ? pastWater : pastElec
        let list = past.map(item => {
            let { datatime, energyzong: usage, fee, updatetime } = item
            return (
                <List.Item
                    key={datatime}
                    arrow='horizontal'
                    onClick={() => {
                        this.handleListClick(datatime)
                    }}
                >
                    <div className='list-row'>
                        <div className='list-col'>
                            <span>{dayjs(datatime).format('YYYY年MM月')}</span>
                            <span className='brief'>
                                结算时间: {dayjs(updatetime).format(full)}
                            </span>
                        </div>
                        <div className='list-col right'>
                            {type === 3 ? null : (
                                <span className='usage'>
                                    {usage.toFixed(2)}
                                    {billType === 2 ? '吨' : '度'}
                                </span>
                            )}
                            <span className='price'>
                                {fee ? fee.toFixed(2) : '0.00'} 元
                            </span>
                        </div>
                    </div>
                </List.Item>
            )
        })
        list.push(
            <List.Item key='more'>
                <div className='more' onClick={this.queryPast}>
                    {done ? '没有更多了' : '加载更多'}
                </div>
            </List.Item>
        )
        return (
            <div className='page-bill'>
                <SegmentedControl
                    selectedIndex={this.state.billType}
                    className={`segment-control ${single ? 'hide' : ''}`}
                    values={['电费账单', '水费账单']}
                    onChange={this.handleBillTypeChange}
                />
                <div className='content'>
                    <section>
                        <header>
                            <h3>当月情况</h3>
                            <div>
                                {!cur
                                    ? '暂无当月信息'
                                    : dayjs(cur.updatetime).format(full)}
                            </div>
                        </header>
                        <div
                            className='cur'
                            onClick={() => {
                                if (cur) {
                                    this.handleListClick(cur.updatetime)
                                }
                            }}
                        >
                            <div>
                                <h3 className='usage'>
                                    {!cur ? '-.--' : cur.energyzong.toFixed(2)}
                                </h3>
                                <span>
                                    {billType === 1
                                        ? '消耗水量 (吨)'
                                        : type === 3
                                            ? '购电金额 (元)'
                                            : '消耗电量 (度)'}
                                </span>
                            </div>
                            <div>
                                <h3 className='price'>
                                    {!cur ? '-.--' : cur.fee.toFixed(2)}
                                </h3>
                                <span>
                                    预计{billType === 1 ? '水' : '电'}费 (元)
                                </span>
                            </div>
                        </div>
                    </section>
                    <section>
                        <header>
                            <h3>往月账单</h3>
                        </header>
                        <List>{list}</List>
                    </section>
                </div>
            </div>
        )
    }
}

const Render = () => (
    <Switch>
        <Route path='/bill' exact component={Bill} />
        <Route path='/bill/detail/:type/:date' component={Detail} />
    </Switch>
)

export default Render
