import React from 'react'
import { Result } from 'antd-mobile'
import Icon from '../../icon'
import './index.less'

const ResultEnum = {
    regular: {
        unknown: {
            title: '充值尚未到账',
            message: () => (
                <div>
                    预计10分钟内到账
                    <br />
                    请稍后前往个人中心查询充值记录
                </div>
            )
        },
        success: {
            title: '充值成功',
            message: remain => (
                <div>
                    当前余额为 <b>{remain.toFixed(2)}</b> 元
                </div>
            )
        },
        error: {
            title: '交易失败或关闭',
            message: () => <div>交易超时, 请重新发起交易</div>
        }
    },
    icm: {
        unknown: {
            title: '支付尚未到账',
            message: () => <div>请稍后关注公众号推送消息</div>
        },
        processing: {
            title: '电量下发中',
            message: () => <div>请稍后关注公众号推送消息</div>
        },
        success: {
            title: '购电成功',
            message: () => <div>请稍后关注卡表电量</div>
        },
        error: {
            title: '交易失败或关闭',
            message: () => <div>交易超时, 请重新发起交易</div>
        },
        refund: {
            title: '购电失败',
            message: () => (
                <div>
                    已退款
                    <br />
                    请稍后关注您的余额信息
                </div>
            )
        },
        warning: {
            title: '购电超时',
            message: () => (
                <div>
                    请到物业处人工处理
                    <br />
                    本次购电金额无需重复缴纳
                </div>
            )
        }
    }
}

function categorize({ type, recharge, operate }) {
    let cat, status
    if (type === 2 || type === 3) {
        // icm
        cat = 'icm'
        switch (recharge) {
            case 0:
                status = 'unknown'
                break
            case 1:
                switch (operate) {
                    case 0:
                        status = 'processing'
                        break
                    case 1:
                        status = 'success'
                        break
                    case 2:
                        status = 'error'
                        break
                    case 3:
                        status = 'warning'
                        break
                    default:
                        break
                }
                break
            case 2:
                status = 'error'
                break
            case 3:
                status = 'refund'
                break
            default:
                break
        }
    } else {
        // regular
        cat = 'regular'
        switch (recharge) {
            case 0:
                status = 'unknown'
                break
            case 1:
                status = 'success'
                break
            case 2:
                status = 'error'
                break
        }
    }
    return { cat, status }
}

class PayResult extends React.Component {
    handleRedirectClick = () => {
        this.props.history.push('/')
    }

    render() {
        let type = 1
        let recharge = 2
        let operate = 1
        let { cat, status } = categorize({ type, recharge, operate })
        let { title, message } = ResultEnum[cat][status]
        return (
            <div className='page-result'>
                <Result
                    className='result-section'
                    img={
                        <Icon
                            className='result-icon'
                            svg={
                                require(`../../../static/img/result/${status}.svg`)
                                    .default
                            }
                        />
                    }
                    title={title}
                    message={message(120)}
                    buttonText='个人中心'
                    buttonType='primary'
                    onButtonClick={this.handleRedirectClick}
                />
            </div>
        )
    }
}

export default PayResult
