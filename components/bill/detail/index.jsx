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
            top: null,
            detail: [],
            changeList: [],
            prepayType: 1, // 1 regular; 2 icm; 3 esam
            checked: true,
            error: false,
            errmsg: ''
        }
    }

    async componentDidMount() {
        let { time, billType } = sessionStorage
        billType = parseInt(billType)
        Toast.loading('加载中...', 0)
        let { data } = await Elec.billDetail.query({
            customerid: localStorage.customerId,
            date: dayjs(time).format('YYYY-MM'),
            type: billType + 1
        })
        Toast.hide()
        if (data.errcode !== 0) {
            this.setState({ error: true, errmsg: data.errmsg })
        } else {
            let { top, list, checked, prepayType, changeList } = data.data
            this.setState({
                prepayType,
                checked,
                top,
                detail: list,
                changeList
            })
        }
    }

    render() {
        let { history } = this.props
        let { billType } = sessionStorage
        billType = parseInt(billType)
        let { top, detail, checked, prepayType, changeList } = this.state
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
                    obj: top,
                    changeList,
                    billType,
                    type: prepayType,
                    checked,
                    detail
                })}
                {detail.map(item => {
                    return buildTable({ obj: item, type: prepayType, billType })
                })}
            </div>
        )
    }
}

export default Detail
