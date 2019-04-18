import React from 'react'
import { List } from 'antd-mobile'
import './index.less'
import { Mine } from '../../../api/url'

class MeterList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            meters: [],
            type: 1
        }
    }

    async componentDidMount() {
        let { data } = await Mine.balance.query({
            customerid: localStorage.customerId
        })
        let { prepayType, icmList } = data.data
        let meters = icmList.map(meter => ({
            name: meter.pointname,
            remain: meter.remain
        }))
        this.setState({ meters, type: parseInt(prepayType) })
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
