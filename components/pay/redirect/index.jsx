import React from 'react'
import { Button, Toast } from 'antd-mobile'
import queryString from 'query-string'
import { isWeChat, isIOS } from '../../../util/constants'
import './index.less'
import android from '../../../static/img/tip_android.png'
import ios from '../../../static/img/tip_ios.png'
import { Pay, Test } from '../../../api/url'
import Reporter from '../../../util/reporter'

class Redirect extends React.Component {
  handleDoneClick = () => {
    let { search, href } = window.location
    let { type, id } = queryString.parse(search)
    let prefix = href.split('redirect')[0]
    window.location.href = `${prefix}#/pay/result?type=${type}&id=${id}`
  }

  async componentDidMount() {
    if (!isWeChat) {
      let { type, id } = queryString.parse(window.location.search)
      let api
      switch (type) {
        case 3:
          api = Pay.esamPay
          break
        case 2:
          api = Pay.icmPay
          break
        case 1:
        default:
          api = Pay.pay
          break
      }
      Toast.loading('请求支付...', 0)
      try {
        let { data } = await api.query({ rechargeid: id })
        Toast.hide()
        if (data.errcode !== 0) {
          Toast.fail(data.errmsg)
        } else {
          document.body.innerHTML = data.data.form
          let scripts = document.querySelectorAll('script')
          for (let i = 0; i < scripts.length; i++) {
            eval(scripts[i].innerHTML)
          }
        }
      } catch (err) {
        Toast.fail('请求超时')
        let reporter = new Reporter()
        reporter.setRequest(err)
        await Test.report.query(reporter.format('pay/redirect/mount', '支付'))
      }
    }
  }

  render() {
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
