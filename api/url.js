import axios from 'axios'
import { urlPrefix, prodUrl } from '../util/constants'

class Request {
  constructor(url, base) {
    this.url = url
    this.base = base
  }

  query(data = {}, option = {}) {
    let params = new URLSearchParams()
    for (let key in data) {
      params.append(key, data[key])
    }
    let setting = Object.assign(
      {
        baseURL: this.base || urlPrefix,
        method: 'post',
        url: this.url,
        timeout: 30000,
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      option,
    )
    return axios(setting)
  }
}

const Elec = {
  curBill: new Request('/elec/curMonthBill'),
  billList: new Request('/elec/monthBillList'),
  billDetail: new Request('/elec/billDetail'),
  usage: new Request('/elec/usage'),
}

const Mine = {
  able: new Request('/mine/checkAbility'),
  basic: new Request('/mine/basicInfo'),
  balance: new Request('/mine/balance'),
  history: new Request('/mine/rechargeHistory'),
  login: new Request('/mine/login'),
  autoLogin: new Request('/mine/autoLogin'),
  sms: new Request('/mine/sendSms'),
  bind: new Request('/mine/bind'),
  unbind: new Request('/mine/unbind'),
  wxArg: new Request('/mine/wxArg'),
}

const Pay = {
  able: new Request('/pay/canRecharge'),
  id: new Request('/pay/rechargeId'),
  icmId: new Request('/pay/icmRechargeId'),
  esamId: new Request('/pay/esamRechargeId'),
  pay: new Request('/pay/recharge'),
  icmPay: new Request('/pay/icmRecharge'),
  esamPay: new Request('/pay/esamRecharge'),
  result: new Request('/pay/rechargeResult'),
}

const Wechat = {
  auth: new Request('/wechat/authorize', prodUrl),
  config: new Request('/wechat/wxConfig', prodUrl),
}

const Haina = {
  auth: new Request('/haina/authorize'),
  bind: new Request('/haina/bind'),
}

const Test = {
  report: new Request('/test/report'),
}

export { Elec, Mine, Pay, Wechat, Haina, Test }
