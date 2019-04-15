import React from 'react'
import Icon from '../../icon'
import success from '../../../static/img/result/success.svg'
import './index.less'

class Paid extends React.Component {
    render() {
        return (
            <div className='page-paid'>
                <Icon svg={success} className='paid-icon' />
                <h2>支付完成</h2>
                <p>请回到微信公众号页面</p>
                <p>点击 <b>完成付款</b></p>
            </div>
        )
    }
}

export default Paid
