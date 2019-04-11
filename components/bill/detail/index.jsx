import React from 'react'
import './index.less'

class Detail extends React.Component {
    render() {
        return (
            <div className='usage-detail'>
                <h3>2017年11月账单</h3>
                <div className='table-title'>
                    <p>户名：华立园区厚达自动化</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>计费月份</th>
                            <th>电表数量</th>
                            <th>电费</th>
                            <th>追退费用</th>
                            <th>应付金额</th>
                            <th>账户余额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2017-11</td>
                            <td>3</td>
                            <td>36782.85</td>
                            <td>0.00</td>
                            <td>36782.85</td>
                            <td>883399.14</td>
                        </tr>
                    </tbody>
                </table>
                <div className='table-title'>
                    <p>计量点：补焊区</p>
                    <p>抄表日期：2017-12-01</p>
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
                            <td>10154.54</td>
                            <td>10629.94</td>
                            <td>50</td>
                            <td>1.50</td>
                            <td>23770.00</td>
                        </tr>
                        <tr>
                            <th>
                                总金额
                                <br />
                                (元)
                            </th>
                            <td>35655.00</td>
                            <th>分摊</th>
                            <td>100%</td>
                            <th>
                                金额
                                <br />
                                (元)
                            </th>
                            <td>35655.00</td>
                        </tr>
                    </tbody>
                </table>
                <div className='table-title'>
                    <p>计量点：单相装配3北区动力</p>
                    <p>抄表日期：2017-12-01</p>
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
                            <td>792.19</td>
                            <td>823.71</td>
                            <td>40</td>
                            <td>见备注</td>
                            <td>1260.80</td>
                        </tr>
                        <tr>
                            <th>
                                总金额
                                <br />
                                (元)
                            </th>
                            <td>760.80</td>
                            <th>分摊</th>
                            <td>100%</td>
                            <th>
                                金额
                                <br />
                                (元)
                            </th>
                            <td>760.80</td>
                        </tr>
                        <tr>
                            <th rowSpan='2'>备注</th>
                            <td rowSpan='2' colSpan='5'>
                                <p>
                                    第一阶梯电价0.50元/度, 基数1000.00,
                                    已用1000.00
                                </p>
                                <p>
                                    第二阶梯电价1.00元/度, 基数1000.00,
                                    已用260.80
                                </p>
                                <p>第三阶梯电价1.50元/度, 已用0</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='table-title'>
                    <p>计量点：B3海外厂房仓库照明</p>
                    <p>抄表日期：2017-12-01</p>
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
                            <td>413.91</td>
                            <td>424.60</td>
                            <td rowSpan='5'>30</td>
                            <td>/</td>
                            <td>320.70</td>
                        </tr>
                        <tr>
                            <th>尖</th>
                            <td>0.00</td>
                            <td>0.00</td>
                            <td>2.00</td>
                            <td>0.00</td>
                        </tr>
                        <tr>
                            <th>峰</th>
                            <td>163.39</td>
                            <td>167.79</td>
                            <td>1.50</td>
                            <td>132.00</td>
                        </tr>
                        <tr>
                            <th>平</th>
                            <td>159.65</td>
                            <td>164.63</td>
                            <td>1.00</td>
                            <td>149.40</td>
                        </tr>
                        <tr>
                            <th>谷</th>
                            <td>90.87</td>
                            <td>92.18</td>
                            <td>0.50</td>
                            <td>39.30</td>
                        </tr>
                        <tr>
                            <th>
                                总金额
                                <br />
                                (元)
                            </th>
                            <td>367.05</td>
                            <th>分摊</th>
                            <td>100%</td>
                            <th>
                                金额
                                <br />
                                (元)
                            </th>
                            <td>367.05</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Detail
