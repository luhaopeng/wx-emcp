import React from 'react'
import { List, SegmentedControl } from 'antd-mobile'
import dayjs from 'dayjs'
import './index.less'
import Chart from './chart'

class Usage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            usageList: [
                {
                    datatime: '2019-04-09 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-08 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-07 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-06 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-05 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-04 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-03 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-02 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                },
                {
                    datatime: '2019-04-01 00:00:00',
                    zong: 16.21,
                    jian: 3,
                    feng: 2,
                    ping: 4,
                    gu: 1
                }
            ]
        }
    }

    handleUsageTypeChange = e => {
        let idx = e.nativeEvent.selectedSegmentIndex
        console.log('type change: %d', idx) // eslint-disable-line
    }

    componentDidMount() {
        let root = document.getElementById('usage-chart')
        let timePeriod = 7
        let dayList = [],
            dataList = []
        let elecList = this.state.usageList

        for (let i = 0; i < elecList.length; i++) {
            dayList.unshift(elecList[i].datatime.substr(5, 5))
            dataList.unshift(elecList[i].zong)
        }
        // 不足7天/24小时，在前部填充空值
        if (elecList.length < timePeriod) {
            let addNum = timePeriod - elecList.length
            for (let j = 0; j < addNum; j++) {
                dayList.unshift('')
                dataList.unshift('')
            }
        }

        let option = {
            title: {
                text: '最近30天用电量(度)',
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 12
                }
            },
            tooltip: {
                show: false
            },
            xAxis: {
                type: 'category',
                data: dayList
            },
            yAxis: [
                {
                    type: 'value'
                }
            ],
            grid: {
                top: '18%',
                bottom: '18%',
                left: '5%',
                right: '6%',
                containLabel: true
            },
            animationDurationUpdate: 500,
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    startValue: dayList[dayList.length - timePeriod],
                    endValue: dayList[dayList.length - 1],
                    handleSize: 2
                },
                {
                    type: 'inside',
                    startValue: dayList[dayList.length - timePeriod],
                    endValue: dayList[dayList.length - 1]
                }
            ],
            series: [
                {
                    type: 'bar',
                    data: dataList,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: 'orange',
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false,
                                length: 10
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: 'orange',
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    }
                }
            ]
        }
        Chart.buildChart(root, option)
    }

    render() {
        let list = this.state.usageList.map(function build(item) {
            return (
                <List.Item key={item.datatime}>
                    <div className='list-row'>
                        <div>{dayjs(item.datatime).format('MM-DD')}</div>
                        <div>{item.zong.toFixed(2)}</div>
                        <div>{item.jian.toFixed(2)}</div>
                        <div>{item.feng.toFixed(2)}</div>
                        <div>{item.ping.toFixed(2)}</div>
                        <div>{item.gu.toFixed(2)}</div>
                    </div>
                </List.Item>
            )
        })
        return (
            <div className='page-usage'>
                <SegmentedControl
                    className='segment-control'
                    values={['用电分析', '用水分析']}
                    onChange={this.handleUsageTypeChange}
                />
                <div id='usage-chart' className='chart-root' />
                <div className='list-header'>
                    <h3>日期</h3>
                    <h3>总</h3>
                    <h3>尖</h3>
                    <h3>峰</h3>
                    <h3>平</h3>
                    <h3>谷</h3>
                </div>
                <List>{list}</List>
            </div>
        )
    }
}

export default Usage
