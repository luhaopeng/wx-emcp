import React from 'react'
import { SegmentedControl, List } from 'antd-mobile'
import dayjs from 'dayjs'
import './index.less'

class Bill extends React.Component {
    handleBillTypeChange = e => {
        let idx = e.nativeEvent.selectedSegmentIndex
        console.log('type change: %d', idx) // eslint-disable-line
    }

    handleListClick = time => {
        console.log(time) // eslint-disable-line
    }

    render() {
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
                            {`结算时间: ${dayjs(item.updatetime).format(
                                'YYYY-MM-DD HH:mm:ss'
                            )}`}
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
            <div className={`page-bill ${this.props.className || ''}`}>
                <SegmentedControl
                    className='segment-control'
                    values={['电费账单', '水费账单']}
                    onChange={this.handleBillTypeChange}
                />
                <div className='content'>
                    <section>
                        <header>
                            <h3>当月情况</h3>
                            <div>2019-04-09 10:16:25</div>
                        </header>
                        <div className='cur'>
                            <div>
                                <h3 className='usage'>50.22</h3>
                                <span>消耗电量 (度)</span>
                            </div>
                            <div>
                                <h3 className='price'>25.19</h3>
                                <span>预计电费 (元)</span>
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

export default Bill
