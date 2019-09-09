import React from 'react'
import { List, Toast } from 'antd-mobile'
import './index.less'
import { Mine, Test } from '../../../api/url'
import Reporter from '../../../util/reporter'

class MeterList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            meters: [],
            type: 1
        }
    }

    async componentDidMount() {
        Toast.loading('加载中...', 0)
        try {
            let { data } = await Mine.balance.query({
                customerid: localStorage.customerId
            })
            Toast.hide()
            let { prepayType, icmList } = data.data
            let meters = icmList.map(meter => ({
                name: meter.pointname,
                remain: meter.remain
            }))
            this.setState({ meters, type: parseInt(prepayType) })
        } catch (err) {
            Toast.fail('请求超时，请刷新页面')
            let reporter = new Reporter()
            reporter.setRequest(err)
            await Test.report.query(
                reporter.format('user/meter/mount', '获取数据')
            )
        }
    }

    render() {
        let { meters, type } = this.state
        let list = meters.map((meter, idx) => (
            <List.Item key={idx}>
                <div className='meter-row'>
                    <div>{meter.name}</div>
                    <span>
                        {meter.remain.toFixed(2)} {type === 2 ? '度' : '元'}
                    </span>
                </div>
            </List.Item>
        ))
        return (
            <div className='page-meter-list'>
                <List>{list}</List>
            </div>
        )
    }
}

export default MeterList
