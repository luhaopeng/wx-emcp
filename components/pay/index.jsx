import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
    Button,
    List,
    Radio,
    Modal,
    Checkbox,
    Picker,
    Toast
} from 'antd-mobile'
import Icon from '../icon'
import classNames from 'classnames'
import './index.less'
import { Pay as PayApi, Wechat, Mine } from '../../api/url'
import { isDev, isTest, isWeChat } from '../../util/constants'
import OptionGroup from './option'
import Result from './result'

const Option = OptionGroup.Item

class Pay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            channel: 1, // 1 regular; 2 icbc; 3 cmbc; 4 haina
            payType: 1,
            forbidden: false,
            aliDiscount: 1,
            wxDiscount: 1,
            protocol: false,
            agreed: false,
            type: 1, // 1 regular; 2 icm; 3 esam
            account: null,
            meters: [],
            selectedMeter: null,
            customInput: ''
        }
    }

    handleOptionClick = money => {
        this.queryOrderId(money)
    }

    handleNextClick = () => {
        this.queryOrderId(this.state.customInput)
    }

    handleAgreeChange = e => {
        this.setState({ agreed: e.target.checked })
    }

    handleProtocolChange = () => {
        if (this.state.agreed) {
            this.setState({ protocol: false })
            localStorage.protocol = true
        }
    }

    hanldeCustomInput = e => {
        let value = e.target.value.replace(/^\.$/, '0.')
        if (!value || /^(0|[1-9]\d*)(\.\d{0,2})?$/.test(value)) {
            this.setState({ customInput: value })
        }
    }

    configWechatJsApi = async () => {
        let { data } = await Wechat.config.query({
            url: window.location.href.split('#')[0]
        })
        // eslint-disable-next-line no-undef
        wx.config({
            debug: isDev || isTest,
            appId: data.data.wxConfig.appId,
            timestamp: data.data.wxConfig.timestamp,
            nonceStr: data.data.wxConfig.nonceStr,
            signature: data.data.wxConfig.signature,
            jsApiList: ['chooseWXPay']
        })
    }

    checkAbility = async () => {
        let { data } = await PayApi.able.query({
            customerid: localStorage.customerId
        })
        let { canOnlineRecharge, entPay } = data.data
        if (canOnlineRecharge) {
            // 0 able; 1 forbidden
            this.setState({ forbidden: !!canOnlineRecharge })
            return false
        }
        let newState = {}
        if (entPay.useDiscount) {
            newState = Object.assign(newState, {
                aliDiscount: entPay.alipayDiscount,
                wxDiscount: entPay.wechatDiscount
            })
            if (!localStorage.protocol) {
                newState = Object.assign(newState, { protocol: true })
            }
        }
        newState = Object.assign(newState, { channel: entPay.payChannel })
        if (entPay.payChannel > 1) {
            newState = Object.assign(newState, { payType: 1 })
        }
        this.setState(newState)
        return true
    }

    queryBalance = async () => {
        Toast.loading('加载中...', 0)
        let { data } = await Mine.balance.query({
            customerid: localStorage.customerId
        })
        Toast.hide()
        let { prepayType, account, icmList } = data.data
        this.setState({
            type: prepayType,
            account,
            meters: icmList,
            selectedMeter: icmList && icmList[0]
        })
    }

    queryOrderId = async money => {
        let { type, payType, selectedMeter } = this.state
        let api
        switch (type) {
            case 3:
                api = PayApi.esamId
                break
            case 2:
                api = PayApi.icmId
                break
            case 1:
            default:
                api = PayApi.id
                break
        }
        Toast.loading('请求支付...', 0)
        let { data } = await api.query(
            {
                customerid: localStorage.customerId,
                amount: money,
                tool: payType,
                icmid: selectedMeter && selectedMeter.pointid
            },
            { timeout: 90000 }
        )
        if (data.errcode !== 0) {
            Toast.fail(data.errmsg)
        } else {
            this.queryPay(data.data.rechargeId)
        }
    }

    queryPay = async id => {
        let { type, payType } = this.state
        let { history } = this.props
        if (payType - 1) {
            Toast.hide()
            let prefix = window.location.href.split('#')[0]
            window.location.href = `${prefix}redirect.html?type=${type}&id=${id}`
            return
        }

        let api
        switch (type) {
            case 3:
                api = PayApi.esamPay
                break
            case 2:
                api = PayApi.icmPay
                break
            case 1:
            default:
                api = PayApi.pay
                break
        }

        let { data } = await api.query({
            rechargeid: id,
            openid: localStorage.openId
        })
        Toast.hide()
        if (data.errcode !== 0) {
            Toast.fail(data.errmsg)
        } else {
            // wechat or icbc-aggregate
            let { form, wxData } = data.data
            if (form) {
                // icbc-aggregate form
                document.body.innerHTML = form
                let scripts = document.querySelectorAll('script')
                for (let i = 0; i < scripts.length; i++) {
                    eval(scripts[i].innerHTML)
                }
            } else if (wxData.result_code === 'SUCCESS') {
                // eslint-disable-next-line no-undef
                wx.chooseWXPay({
                    appId: wxData.appid,
                    timestamp: wxData.timeStamp,
                    nonceStr: wxData.nonce_str,
                    package: wxData.packageStr,
                    signType: wxData.signType,
                    paySign: wxData.sign,
                    success: () => {
                        // redirect to result
                        let to = {
                            pathname: '/pay/result',
                            state: { type, id }
                        }
                        history.push(to)
                    }
                })
            } else {
                Toast.fail(wxData.return_msg)
            }
        }
    }

    buildPickerList = (list, type) => {
        let data = list.map((item, idx) => {
            let end = type > 2 ? '元' : `度 - ${item.price.toFixed(2)}元/度`
            let label = `${item.pointname} - ${item.remain.toFixed(2)}${end}`
            return { label, value: idx }
        })
        return [data]
    }

    buildPayMethod = () => {
        let { channel, payType, aliDiscount, wxDiscount } = this.state
        let wxTip = `(需收取${((1 - wxDiscount) * 100).toFixed(1)}%手续费)`
        let aliTip = `(需收取${((1 - aliDiscount) * 100).toFixed(1)}%手续费)`
        if (channel > 1) {
            return (
                <section>
                    <h3>支付方式</h3>
                    <List>
                        <Radio.RadioItem
                            disabled={!isWeChat}
                            thumb={
                                <Icon
                                    size='sm'
                                    svg={
                                        require('../../static/img/wechat.svg')
                                            .default
                                    }
                                />
                            }
                            checked={payType === 1}
                            onChange={() => {
                                this.setState({ payType: 1 })
                            }}
                        >
                            微信支付 {wxDiscount < 1 ? wxTip : null}
                        </Radio.RadioItem>
                    </List>
                </section>
            )
        } else {
            return (
                <section>
                    <h3>支付方式</h3>
                    <List>
                        <Radio.RadioItem
                            disabled={!isWeChat}
                            thumb={
                                <Icon
                                    size='sm'
                                    svg={
                                        require('../../static/img/wechat.svg')
                                            .default
                                    }
                                />
                            }
                            checked={payType === 1}
                            onChange={() => {
                                this.setState({ payType: 1 })
                            }}
                        >
                            微信支付 {wxDiscount < 1 ? wxTip : null}
                        </Radio.RadioItem>
                        <Radio.RadioItem
                            thumb={
                                <Icon
                                    size='sm'
                                    svg={
                                        require('../../static/img/alipay.svg')
                                            .default
                                    }
                                />
                            }
                            checked={payType === 2}
                            onChange={() => {
                                this.setState({ payType: 2 })
                            }}
                        >
                            支付宝 {aliDiscount < 1 ? aliTip : null}
                        </Radio.RadioItem>
                    </List>
                </section>
            )
        }
    }

    componentDidMount() {
        // wechat pay detect
        if (!isWeChat) {
            Toast.fail('您不在微信浏览器中，无法使用微信支付')
            this.setState({ payType: 2 })
        }
        // config wechat jsapi
        if (!isDev && isWeChat) {
            this.configWechatJsApi()
        }
        // check ability & get balance
        this.checkAbility() && this.queryBalance()
    }

    render() {
        let {
            payType,
            forbidden,
            protocol,
            agreed,
            aliDiscount,
            wxDiscount,
            type,
            meters,
            selectedMeter,
            account,
            customInput
        } = this.state

        let curPrice = type === 2 ? selectedMeter.price : 1.0
        let curDis = payType - 1 ? aliDiscount : wxDiscount
        let income
        if (type === 2) {
            income = Math.floor((customInput * curDis) / curPrice) + ' 度'
        } else {
            let calc = Math.floor(customInput * curDis * 100) / 100
            if (parseFloat(customInput) > 0 && calc === 0) {
                income = '0.01 元'
            } else {
                income = calc + ' 元'
            }
        }
        return (
            <div className='page-pay'>
                <Modal
                    visible={forbidden}
                    maskClosable={false}
                    transparent
                    wrapClassName='pay-modal-wrap'
                >
                    当前状态下无法在线充值
                    <br />
                    请到物业核实后人工充值
                </Modal>
                <Modal
                    visible={protocol}
                    maskClosable={false}
                    transparent
                    wrapClassName='pay-modal-wrap'
                    className='pay-modal-body'
                    footer={[
                        {
                            text: '确定',
                            onPress: this.handleProtocolChange
                        }
                    ]}
                >
                    <p>您好，即日起您需自行承担在线充值的手续费，请知悉！</p>
                    <span>手续费由微信/支付宝平台收取</span>
                    <Checkbox.AgreeItem
                        checked={agreed}
                        onChange={this.handleAgreeChange}
                    >
                        我已了解，继续使用
                    </Checkbox.AgreeItem>
                </Modal>
                <div className='top'>
                    <p>{type > 1 ? '购电电表' : '账户余额 (元)'}</p>
                    {type > 1 ? (
                        <Picker
                            data={this.buildPickerList(meters, type)}
                            title='选择电表'
                            cols={1}
                            cascade={false}
                            onOk={val => {
                                this.setState({ selectedMeter: meters[val[0]] })
                            }}
                        >
                            <div className='picker-selected'>
                                <h3>{selectedMeter.pointname}</h3>
                                <h3>—</h3>
                                <h3>
                                    {selectedMeter.remain.toFixed(2)}
                                    {type === 2 ? '度' : '元'}
                                </h3>
                                {type === 2 ? (
                                    <React.Fragment>
                                        <h3>—</h3>
                                        <h3>
                                            {selectedMeter.price.toFixed(2)}
                                            元/度
                                        </h3>
                                    </React.Fragment>
                                ) : null}
                            </div>
                        </Picker>
                    ) : (
                        <h1>{account && account.usablemoney.toFixed(2)}</h1>
                    )}
                </div>
                <div className='content'>
                    {this.buildPayMethod()}
                    <section>
                        <h3>充值金额</h3>
                        <OptionGroup>
                            {[10, 50, 100, 500, 1000, 5000].map(val => {
                                return (
                                    <Option
                                        key={val}
                                        money={val}
                                        price={curPrice}
                                        discount={curDis}
                                        onClick={this.handleOptionClick}
                                    />
                                )
                            })}
                        </OptionGroup>
                        <div className='fee'>
                            <Icon
                                size='xs'
                                svg={
                                    require('../../static/img/yuan.svg').default
                                }
                            />
                            <input
                                type='text'
                                value={customInput}
                                placeholder='其他金额'
                                onChange={this.hanldeCustomInput}
                                onBlur={() => {
                                    window.scroll(0, 0)
                                }}
                            />
                        </div>
                        <p
                            className={classNames('custom-amount', {
                                hide: !customInput
                            })}
                        >
                            可得{income}
                        </p>
                    </section>
                    <section>
                        <Button
                            disabled={!customInput || !parseFloat(customInput)}
                            type='primary'
                            className='next-btn'
                            activeClassName='active'
                            onClick={this.handleNextClick}
                        >
                            {payType - 1 ? '下一步' : '支付'}
                        </Button>
                    </section>
                </div>
            </div>
        )
    }
}

const Render = () => (
    <Switch>
        <Route exact path='/pay' component={Pay} />
        <Route path='/pay/result' component={Result} />
    </Switch>
)

export default Render
