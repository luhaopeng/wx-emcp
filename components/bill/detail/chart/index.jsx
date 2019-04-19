import React from 'react'
import dayjs from 'dayjs'

const DATE = 'YYYY-MM-DD'
const MONTH = 'YYYY-MM'

function regularTop({ obj, detail, billType, current, checked }) {
    if (!obj) {
        return null
    }
    let titleSub = current ? '(预结)' : !checked ? '(未核算)' : ''
    let date = dayjs(obj.datatime)
    return (
        <React.Fragment>
            <h3>{date.format(`YYYY年MM月账单${titleSub}`)}</h3>
            <div className='table-title'>
                <p>户名：{obj.hm}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>计费月份</th>
                        <th>{billType === 1 ? '水' : '电'}表数量</th>
                        <th>{billType === 1 ? '水' : '电'}费</th>
                        <th>{current ? '总余额' : '追退费用'}</th>
                        <th>{current ? '冻结余额' : '应付金额'}</th>
                        <th>{current ? '可用余额' : '账户余额'}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{date.format(MONTH)}</td>
                        <td>{detail.length}</td>
                        <td>{(obj.energy * 1).toFixed(2)}</td>
                        <td>
                            {(current ? obj.total * 1 : obj.change * 1).toFixed(
                                2
                            )}
                        </td>
                        <td>
                            {(current
                                ? obj.freeze * 1
                                : obj.should * 1
                            ).toFixed(2)}
                        </td>
                        <td>
                            {(current
                                ? obj.usable * 1
                                : obj.balance * 1
                            ).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function singlet({ obj, billType }) {
    let type = billType === 1 ? '水' : '电'
    let unit = billType === 1 ? '吨' : '度'
    return (
        <React.Fragment key={obj.pointid}>
            <div className='table-title'>
                <p>计量点：{obj.pointname}</p>
                <p>抄表日期：{dayjs(obj.endtime).format(DATE)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>费率</th>
                        <th>上期视数</th>
                        <th>本期视数</th>
                        <th>倍率</th>
                        <th>
                            单价
                            <br />
                            (元/{type})
                        </th>
                        <th>
                            {type}量<br />({unit})
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>总</th>
                        <td>{(obj.startbmzongzy * 1).toFixed(2)}</td>
                        <td>{(obj.endbmzongzy * 1).toFixed(2)}</td>
                        <td>{obj.rate}</td>
                        <td>{(obj.pricerule.value1 * 1).toFixed(2)}</td>
                        <td>{(obj.energyzong * 1).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>
                            总金额
                            <br />
                            (元)
                        </th>
                        <td>{(obj.actualfee * 1).toFixed(2)}</td>
                        <th>分摊</th>
                        <td>{obj.percent}%</td>
                        <th>
                            金额
                            <br />
                            (元)
                        </th>
                        <td>
                            {((obj.actualfee * obj.percent) / 100).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function rating({ obj }) {
    return (
        <React.Fragment key={obj.pointid}>
            <div className='table-title'>
                <p>计量点：{obj.pointname}</p>
                <p>抄表日期：{dayjs(obj.endtime).format(DATE)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>费率</th>
                        <th>上期视数</th>
                        <th>本期视数</th>
                        <th>倍率</th>
                        <th>
                            单价
                            <br />
                            (元/度)
                        </th>
                        <th>
                            电量
                            <br />
                            (度)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>总</th>
                        <td>{(obj.startbmzongzy * 1).toFixed(2)}</td>
                        <td>{(obj.endbmzongzy * 1).toFixed(2)}</td>
                        <td rowSpan='5'>{obj.rate}</td>
                        <td>/</td>
                        <td>{(obj.energyzong * 1).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>尖</th>
                        <td>{(obj.startbmjianzy * 1).toFixed(2)}</td>
                        <td>{(obj.endbmjianzy * 1).toFixed(2)}</td>
                        <td>{(obj.pricerule.value1 * 1).toFixed(2)}</td>
                        <td>{(obj.energyjian * 1).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>峰</th>
                        <td>{(obj.startbmfengzy * 1).toFixed(2)}</td>
                        <td>{(obj.endbmfengzy * 1).toFixed(2)}</td>
                        <td>{(obj.pricerule.value2 * 1).toFixed(2)}</td>
                        <td>{(obj.energyfeng * 1).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>平</th>
                        <td>{(obj.startbmpingzy * 1).toFixed(2)}</td>
                        <td>{(obj.endbmpingzy * 1).toFixed(2)}</td>
                        <td>{(obj.pricerule.value3 * 1).toFixed(2)}</td>
                        <td>{(obj.energyping * 1).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>谷</th>
                        <td>{(obj.startbmguzy * 1).toFixed(2)}</td>
                        <td>{(obj.endbmguzy * 1).toFixed(2)}</td>
                        <td>{(obj.pricerule.value4 * 1).toFixed(2)}</td>
                        <td>{(obj.energygu * 1).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>
                            总金额
                            <br />
                            (元)
                        </th>
                        <td>{(obj.actualfee * 1).toFixed(2)}</td>
                        <th>分摊</th>
                        <td>{obj.percent}%</td>
                        <th>
                            金额
                            <br />
                            (元)
                        </th>
                        <td>
                            {((obj.actualfee * obj.percent) / 100).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function stair({ obj, billType }) {
    let type = billType === 1 ? '水' : '电'
    let unit = billType === 1 ? '吨' : '度'
    let {
        energy1,
        energy2,
        energy3,
        energy4,
        energy5,
        value1,
        value2,
        value3,
        value4,
        value5
    } = obj.pricerule
    let energyList = [energy1, energy2, energy3, energy4, energy5]
    let priceList = [value1, value2, value3, value4, value5]
    let chineseNum = ['一', '二', '三', '四', '五']
    let list = priceList.map((price, idx) => {
        if (!price) {
            return null
        }
        if (idx === 4 || !priceList[idx + 1]) {
            // 最后一条
            let usage = obj.energyzong - energyList[idx]
            return (
                <p key={idx}>
                    第{chineseNum[idx]}阶梯{type}价{price.toFixed(2)}元/{unit},
                    已用{(usage > 0 ? usage : 0).toFixed(2)}
                </p>
            )
        } else {
            let usage
            let base = energyList[idx + 1] - energyList[idx]
            if (obj.energyzong > energyList[idx + 1]) {
                usage = base
            } else if (obj.energyzong > energyList[idx]) {
                usage = obj.energyzong - energyList[idx]
            } else {
                usage = 0
            }
            return (
                <p key={idx}>
                    第{chineseNum[idx]}阶梯{type}价{price.toFixed(2)}元/{unit},
                    基数{base.toFixed(2)}, 已用{usage.toFixed(2)}
                </p>
            )
        }
    })

    return (
        <React.Fragment key={obj.pointid}>
            <div className='table-title'>
                <p>计量点：{obj.pointname}</p>
                <p>抄表日期：{dayjs(obj.endtime).format(DATE)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>费率</th>
                        <th>上期视数</th>
                        <th>本期视数</th>
                        <th>倍率</th>
                        <th>
                            单价
                            <br />
                            (元/{unit})
                        </th>
                        <th>
                            {type}量<br />({unit})
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>总</th>
                        <td>{(obj.startbmzongzy * 1).toFixed(2)}</td>
                        <td>{(obj.endbmzongzy * 1).toFixed(2)}</td>
                        <td>{obj.rate}</td>
                        <td>见备注</td>
                        <td>{(obj.energyzong * 1).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>
                            总金额
                            <br />
                            (元)
                        </th>
                        <td>{(obj.actualfee * 1).toFixed(2)}</td>
                        <th>分摊</th>
                        <td>{obj.percent}%</td>
                        <th>
                            金额
                            <br />
                            (元)
                        </th>
                        <td>
                            {((obj.actualfee * obj.percent) / 100).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <th rowSpan='2'>备注</th>
                        <td rowSpan='2' colSpan='5'>
                            {list}
                        </td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function regularTable({ obj, ...rest }) {
    let { type } = obj.pricerule
    switch (type) {
        case 1:
            return singlet({ obj, ...rest })
        case 2:
            return rating({ obj, ...rest })
        case 3:
            return stair({ obj, ...rest })
        default:
            return null
    }
}

function icmTop({ obj, detail }) {
    if (!obj) {
        return null
    }
    let tBuy = 0,
        tDraw = 0,
        tElec = 0,
        tMoney = 0
    for (let { buyenergy, withdraw, useenergy, usemoney } of detail) {
        tBuy += buyenergy
        tDraw += withdraw
        tElec += useenergy
        tMoney += usemoney
    }
    let date = dayjs(obj.datatime)
    return (
        <React.Fragment>
            <h3>{date.format('YYYY年MM月账单')}</h3>
            <div className='table-title'>
                <p>户名：{obj.hm}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>计费月份</th>
                        <th>电表数量</th>
                        <th>总购电量</th>
                        <th>清除电量</th>
                        <th>总用电量</th>
                        <th>总用电费</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{date.format(MONTH)}</td>
                        <td>{detail.length}</td>
                        <td>{tBuy.toFixed(2)}</td>
                        <td>{tDraw.toFixed(2)}</td>
                        <td>{tElec.toFixed(2)}</td>
                        <td>{tMoney.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function icmTable({ obj }) {
    return (
        <React.Fragment key={obj.pointid}>
            <div className='table-title'>
                <p>计量点：{obj.name}</p>
                <p>抄表日期：{dayjs(obj.updatetime).format(DATE)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>购电电量</th>
                        <th>清除电量</th>
                        <th>用电电量</th>
                        <th>剩余电量</th>
                        <th>用电电费</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{(obj.buyenergy * 1).toFixed(2)}</td>
                        <td>{(obj.withdraw * 1).toFixed(2)}</td>
                        <td>{(obj.useenergy * 1).toFixed(2)}</td>
                        <td>{(obj.remain * 1).toFixed(2)}</td>
                        <td>{(obj.usemoney * 1).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function esamTop({ obj, detail }) {
    if (!obj) {
        return null
    }
    let tBuy = 0,
        tDraw = 0,
        tMoney = 0
    for (let { buymoney, withdraw, usemoney } of detail) {
        tBuy += buymoney
        tDraw += withdraw
        tMoney += usemoney
    }
    let date = dayjs(obj.datatime)
    return (
        <React.Fragment>
            <h3>{date.format('YYYY年MM月账单')}</h3>
            <div className='table-title'>
                <p>户名：{obj.hm}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>计费月份</th>
                        <th>电表数量</th>
                        <th>总购电金额</th>
                        <th>用电电费</th>
                        <th>退还金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{date.format(MONTH)}</td>
                        <td>{detail.length}</td>
                        <td>{tBuy.toFixed(2)}</td>
                        <td>{tMoney.toFixed(2)}</td>
                        <td>{tDraw.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function esamTable({ obj }) {
    return (
        <React.Fragment key={obj.pointid}>
            <div className='table-title'>
                <p>计量点：{obj.name}</p>
                <p>抄表日期：{dayjs(obj.updatetime).format(DATE)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>购电金额</th>
                        <th>剩余金额</th>
                        <th>用电金额</th>
                        <th>退还金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{(obj.buymoney * 1).toFixed(2)}</td>
                        <td>{(obj.remain * 1).toFixed(2)}</td>
                        <td>{(obj.usemoney * 1).toFixed(2)}</td>
                        <td>{(obj.withdraw * 1).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

function buildTop({ type, ...rest }) {
    switch (type) {
        case 3:
            return esamTop(rest)
        case 2:
            return icmTop(rest)
        case 1:
            return regularTop(rest)
        default:
            return null
    }
}

function buildTable({ type, ...rest }) {
    switch (type) {
        case 3:
            return esamTable(rest)
        case 2:
            return icmTable(rest)
        case 1:
            return regularTable(rest)
        default:
            return null
    }
}

export { buildTop, buildTable }
