import React from 'react'
import MobileDetect from 'mobile-detect'
import { Button } from 'antd-mobile'
import './index.less'
import android from '../../../static/img/tip_android.png'
import ios from '../../../static/img/tip_ios.png'

const detect = new MobileDetect(window.navigator.userAgent)

class Redirect extends React.Component {
    handleDoneClick = () => {
        this.props.history.push('/pay/result')
    }

    componentDidMount() {
        let isWeChat = detect.match(/micromessenger/i)
        if (!isWeChat) {
            console.log('执行alipay') // eslint-disable-line
        }
    }

    render() {
        let isIOS = detect.match(/iphone|ipad|ipod/i)
        let img = isIOS ? ios : android
        return (
            <div className='page-redirect'>
                <img src={img} alt='tip' />
                <p>请点击右上角“在{isIOS ? 'Safari' : '浏览器'}中打开”</p>
                <p>在浏览器中完成支付</p>
                <footer>
                    <h2>是否已完成付款</h2>
                    <p>
                        请确认完成支付后, 点击&nbsp;
                        <Button
                            inline
                            type='primary'
                            size='small'
                            onClick={this.handleDoneClick}
                        >
                            完成付款
                        </Button>
                    </p>
                </footer>
            </div>
        )
    }
}

export default Redirect
