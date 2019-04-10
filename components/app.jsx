import React from 'react'
import { hot } from 'react-hot-loader/root'
import { TabBar } from 'antd-mobile'
import PageUser from './user'
import PagePay from './pay'
import PageBill from './bill'
import PageUsage from './usage'
import Icon from './icon'
import billO from '../static/img/tabbar/bill-o.svg'
import bill from '../static/img/tabbar/bill.svg'
import payO from '../static/img/tabbar/pay-o.svg'
import pay from '../static/img/tabbar/pay.svg'
import statO from '../static/img/tabbar/stat-o.svg'
import stat from '../static/img/tabbar/stat.svg'
import userO from '../static/img/tabbar/user-o.svg'
import user from '../static/img/tabbar/user.svg'
import './app.less'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'user'
        }
    }
    render() {
        return (
            <div className='tab-bar'>
                <TabBar
                    unselectedTintColor='#949494'
                    tintColor='#33A3F4'
                    barTintColor='white'
                    hidden={this.state.hidden}
                >
                    <TabBar.Item
                        title='个人中心'
                        key='user'
                        icon={<Icon svg={userO} className='inactive' />}
                        selectedIcon={<Icon svg={user} className='active' />}
                        selected={this.state.selectedTab === 'user'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'user'
                            })
                        }}
                    >
                        <PageUser className='tab-page' />
                    </TabBar.Item>
                    <TabBar.Item
                        title='余额充值'
                        key='pay'
                        icon={<Icon svg={payO} className='inactive' />}
                        selectedIcon={<Icon svg={pay} className='active' />}
                        selected={this.state.selectedTab === 'pay'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'pay'
                            })
                        }}
                    >
                        <PagePay className='tab-page' />
                    </TabBar.Item>
                    <TabBar.Item
                        title='账单查询'
                        key='bill'
                        icon={<Icon svg={billO} className='inactive' />}
                        selectedIcon={<Icon svg={bill} className='active' />}
                        selected={this.state.selectedTab === 'bill'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'bill'
                            })
                        }}
                    >
                        <PageBill className='tab-page' />
                    </TabBar.Item>
                    <TabBar.Item
                        title='用量分析'
                        key='usage'
                        icon={<Icon svg={statO} className='inactive' />}
                        selectedIcon={<Icon svg={stat} className='active' />}
                        selected={this.state.selectedTab === 'usage'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'usage'
                            })
                        }}
                    >
                        <PageUsage className='tab-page' />
                    </TabBar.Item>
                </TabBar>
            </div>
        )
    }
}

export default hot(App)
