import React from 'react'
import { List, Radio, Button, Toast } from 'antd-mobile'
import dayjs from 'dayjs'
import classNames from 'classnames'
import './index.less'
import { Mine, Haina, Test } from '../../../api/url'
import { isWeChat, isProd, isTest, isHaina } from '../../../util/constants'
import Reporter from '../../../util/reporter'

const DATE = 'YYYY-MM-DD HH:mm:ss'

class Guide extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
            records: []
        }
    }

    handleBindClick = async () => {
        let { selectedIndex, records } = this.state
        let { history, location } = this.props
        let selected = records[selectedIndex]
        let { id, ban } = selected
        localStorage.customerId = id
        localStorage.lastLogin = dayjs().format(DATE)
        sessionStorage.banned = ban

        // bind
        if (isWeChat) {
            if (isProd || isTest) {
                await Mine.bind.query({
                    openid: localStorage.openId,
                    msgOpenId: localStorage.msgOpenId,
                    customerid: id
                })
            } else if (isHaina) {
                await Haina.bind.query({
                    residentid: localStorage.residentId,
                    customerid: id
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
                let records = array.map(item => ({
                    id: item.customerid,
                    hm: item.hm,
                    company: item.ename,
                    ban: item.banMp
                }))
                this.setState({ records })
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
        let { records, selectedIndex } = this.state
        let list = records.map((val, idx) => (
            <Radio.RadioItem
                key={val.id}
                checked={selectedIndex === idx}
                onChange={() => {
                    this.setState({ selectedIndex: idx })
                }}
            >
                <div className='record-wrap'>
                    <div>{val.hm}</div>
                    <div>{val.company}</div>
                </div>
            </Radio.RadioItem>
        ))
        let banned = records.length > 0 && records[selectedIndex].ban === 1
        return (
            <div className='page-guide'>
                <header>
                    <p>匹配到多条记录</p>
                    <p>请在以下选择一条进行绑定：</p>
                </header>
                <List>{list}</List>
                <div
                    className={classNames('banned', {
                        show: banned
                    })}
                >
                    由于业务调整，此户号目前无法登录，详情请咨询物业
                </div>
                <Button
                    disabled={banned}
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
