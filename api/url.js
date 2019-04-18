import axios from 'axios'
const isDev = process.env.NODE_ENV === 'development'
const devUrl = 'http://localhost:8080/wxemcp/'
const prodUrl = 'http://hl.energyman.cn/wxemcp/'

const urlPrefix = isDev ? devUrl : prodUrl

class Request {
    constructor(url) {
        this.url = url
    }

    query(data = {}, option = {}) {
        let params = new URLSearchParams()
        for (let key in data) {
            params.append(key, data[key])
        }
        let setting = Object.assign(
            {
                baseURL: urlPrefix,
                method: 'post',
                url: this.url,
                timeout: 30000,
                data: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },
            option
        )
        return axios(setting)
    }
}

const Elec = {
    curBill: new Request('/elec_curMonthBill.action'),
    billList: new Request('/elec_monthBillList.action'),
    billDetail: new Request('/elec_billDetail.action'),
    icmBillDetail: new Request('/elec_icmBillDetail.action'),
    usage: new Request('/elec_usage.action')
}

const Mine = {
    basic: new Request('/mine_basicInfo.action'),
    balance: new Request('/mine_balance.action'),
    history: new Request('/mine_rechargeHistory.action'),
    login: new Request('/mine_login.action'),
    sms: new Request('/mine_sendSms.action')
}

const Pay = {
    able: new Request('/pay_canRecharge.action'),
    id: new Request('/pay_rechargeId.action'),
    icmId: new Request('/pay_icmRechargeId.action'),
    esamId: new Request('/pay_esamRechargeId.action'),
    pay: new Request('/pay_recharge.action'),
    icmPay: new Request('/pay_icmRecharge.action'),
    esamPay: new Request('/pay_esamRecharge.action'),
    result: new Request('/pay_rechargeResult.action')
}

const Test = {
    empty: new Request('/test_nullMethod.action')
}

const Wechat = {
    auth: new Request('/wechat_authorize.action'),
    config: new Request('/wechat_wxConfig.action')
}

export { Elec, Mine, Pay, Test, Wechat }
