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
            type: 1,
            curElec: null,
            curWater: null
        }
    }

    handleBillTypeChange = e => {
        let idx = e.nativeEvent.selectedSegmentIndex
        this.setState({ billType: idx })
    }

    handleListClick = time => {
        console.log(time) // eslint-disable-line
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

    queryPast = async () => {}

    componentDidMount() {
        this.queryCurrent()
    }

    render() {
        let { type, billType, curElec, curWater, single } = this.state
        let cur = billType === 1 ? curWater : curElec
        const billList = [
            {
                datatime: '2019-03-01 00:00:00',
                updatetime: '2019-04-01 02:51:53',
                energyzong: 454.31,
                fee: 681.47
            },
            {
                datatime: '2019-02-01 00:00:00',
                updatetime: '2019-04-01 02:51:53',
                energyzong: 454.31,
                fee: 681.47
            },
            {
                datatime: '2019-01-01 00:00:00',
                updatetime: '2019-04-01 02:51:53',
                energyzong: 454.31,
                fee: 681.47
            },
            {
                datatime: '2018-12-01 00:00:00',
                updatetime: '2019-04-01 02:51:53',
                energyzong: 454.31,
                fee: 681.47
            },
            {
                datatime: '2018-11-01 00:00:00',
                updatetime: '2019-04-01 02:51:53',
                energyzong: 454.31,
                fee: 681.47
            },
            {
                datatime: '2018-10-01 00:00:00',
                updatetime: '2019-04-01 02:51:53',
                energyzong: 454.31,
                fee: 681.47
            }
        ]
        let list = billList.map(item => {
            return (
                <List.Item
                    key={item.datatime}
                    arrow='horizontal'
                    onClick={() => {
                        this.handleListClick(item.datatime)
                    }}
                >
                    <div className='list-row'>
                        <span>{dayjs(item.datatime).format('YYYY年MM月')}</span>
                        <span className='usage'>{`${item.energyzong.toFixed(
                            2
                        )} 度`}</span>
                    </div>
                    <div className='list-row'>
                        <span className='brief'>
                            {`结算时间: ${dayjs(item.updatetime).format(full)}`}
                        </span>
                        <span className='price'>{`${item.fee.toFixed(
                            2
                        )} 元`}</span>
                    </div>
                </List.Item>
            )
        })
        list.push(
            <List.Item key='more'>
                <div className='more'>加载更多</div>
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
                        <div className='cur'>
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
        <Route path='/bill/detail/:date' component={Detail} />
    </Switch>
)

export default Render
