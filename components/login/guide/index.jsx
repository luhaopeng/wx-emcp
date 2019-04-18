import React from 'react'
import { List, Radio, Button } from 'antd-mobile'
import './index.less'
import { Mine } from '../../../api/url'

class Guide extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedId: 0,
            records: []
        }
    }

    handleBindClick = () => {
        localStorage.customerId = this.state.selectedId
        let { history, location } = this.props
        let { from } = location.state || { from: { pathname: '/' } }
        history.replace(from)
    }

    async componentDidMount() {
        let { relog, phone } = localStorage
        let { data } = await Mine.login.query({ relog, phone })
        if (data.errcode === 0) {
            let array = data.data.customerEnts
            let records = array.map(item => {
                return { id: item.customerid, hm: item.hm, company: item.ename }
            })
            this.setState({ selectedId: records[0].id, records })
        }
    }

    render() {
        let { records } = this.state
        let { selectedId } = this.state
        let list = records.map(val => (
            <Radio.RadioItem
                key={val.id}
                checked={selectedId === val.id}
                onChange={() => {
                    this.setState({ selectedId: val.id })
                }}
            >
                <div className='record-wrap'>
                    <div>{val.hm}</div>
                    <div>{val.company}</div>
                </div>
            </Radio.RadioItem>
        ))
        return (
            <div className='page-guide'>
                <header>
                    <p>匹配到多条记录</p>
                    <p>请在以下选择一条进行绑定：</p>
                </header>
                <List>{list}</List>
                <Button
                    type='primary'
                    className='bind-btn'
                    onClick={this.handleBindClick}
                >
                    绑定
                </Button>
            </div>
        )
    }
}

export default Guide
