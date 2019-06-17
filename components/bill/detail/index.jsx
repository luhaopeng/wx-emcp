import React from 'react'
import { Modal, Toast } from 'antd-mobile'
import dayjs from 'dayjs'
import { Elec } from '../../../api/url'
import './index.less'
import { buildTop, buildTable } from './chart'

class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            total: null,
            detail: [],
            checked: true,
            error: false,
            errmsg: ''
        }
    }

    async componentDidMount() {
        let { location } = this.props
        let { time, billType, type } = location.state
        let api = type > 1 ? Elec.icmBillDetail : Elec.billDetail
        let pType = type > 1 ? type : billType + 1
        Toast.loading('加载中...', 0)
        let { data } = await api.query({
            customerid: localStorage.customerId,
            date: dayjs(time).format('YYYY-MM'),
            type: pType
        })
        Toast.hide()
        if (data.errcode !== 0) {
            this.setState({ error: true, errmsg: data.errmsg })
        } else {
            let detail
            switch (type) {
                case 3:
                    detail = data.data.esamDetailList
                    break
                case 2:
                    detail = data.data.icmDetailList
                    break
                case 1:
                default:
                    detail = data.data.detailList
                    this.setState({ checked: data.data.checked })
                    break
            }
            this.setState({ detail, total: data.data.total })
        }
    }

    render() {
        let { location, history } = this.props
        let { current, billType, type } = location.state
        let { total, detail, checked } = this.state
        return (
            <div className='usage-detail'>
                <Modal
                    title='操作失败'
                    visible={this.state.error}
                    maskClosable={false}
                    transparent
                    footer={[{ text: '返回', onPress: history.goBack }]}
                >
                    {this.state.errmsg}
                </Modal>
                {buildTop({
                    obj: total,
                    billType,
                    type,
                    current,
                    checked,
                    detail
                })}
                {detail.map(item => {
                    return buildTable({ type, obj: item })
                })}
            </div>
        )
    }
}

export default Detail
