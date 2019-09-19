import React from 'react'
import { List, Radio, Button, Toast } from 'antd-mobile'
import dayjs from 'dayjs'
import './index.less'
import { Mine, Haina, Test } from '../../../api/url'
import { isWeChat, isProd, isTest, isHaina } from '../../../util/constants'
import Reporter from '../../../util/reporter'

const DATE = 'YYYY-MM-DD HH:mm:ss'

class Guide extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedId: 0,
            records: []
        }
    }

    handleBindClick = async () => {
        let { selectedId } = this.state
        let { history, location } = this.props
        localStorage.customerId = selectedId
        localStorage.lastLogin = dayjs().format(DATE)

        // bind
        if (isWeChat) {
            if (isProd || isTest) {
                await Mine.bind.query({
                    openid: localStorage.openId,
                    msgOpenId: localStorage.msgOpenId,
                    customerid: selectedId
                })
            } else if (isHaina) {
                await Haina.bind.query({
                    residentid: localStorage.residentId,
                    customerid: selectedId
                })
            }
        }

        let { from } = location.state || { from: { pathname: '/' } }
        history.replace(from)
    }

    async componentDidMount() {
        let { relog, phone } = localStorage
        Toast.loading('获取列表...', 0)
        try {
            let { data } = await Mine.login.query({ relog, phone })
            Toast.hide()
            if (data.errcode === 0) {
                let array = data.data.customerEnts
                let records = array.map(item => {
                    return {
                        id: item.customerid,
                        hm: item.hm,
                        company: item.ename
                    }
                })
                this.setState({ selectedId: records[0].id, records })
            }
        } catch (err) {
            Toast.fail('请求超时')
            let reporter = new Reporter()
            reporter.setRequest(err)
            await Test.report.query(
                reporter.format('login/guide/mount', '多户名列表')
            )
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
