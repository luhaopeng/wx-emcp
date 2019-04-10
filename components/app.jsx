import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Switch, Route, Link } from 'react-router-dom'
import TabBar from './tabbar'
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

const TabItem = ({ label, to, exact, icon, selectedIcon }) => {
    return (
        <Route
            path={to}
            exact={exact}
            children={({ match }) => (
                <Link to={to}>
                    <TabBar.Item
                        label={label}
                        icon={<Icon svg={icon} />}
                        selectedIcon={<Icon svg={selectedIcon} />}
                        selected={match}
                    />
                </Link>
            )}
        />
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'user'
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={PageUser} />
                    <Route path='/pay' component={PagePay} />
                    <Route path='/bill' component={PageBill} />
                    <Route path='/usage' component={PageUsage} />
                </Switch>

                <div className='tab-bar'>
                    <TabBar>
                        <TabItem
                            to='/'
                            label='个人中心'
                            exact={true}
                            icon={userO}
                            selectedIcon={user}
                        />
                        <TabItem
                            to='/pay'
                            label='余额充值'
                            icon={payO}
                            selectedIcon={pay}
                        />
                        <TabItem
                            to='/bill'
                            label='账单查询'
                            icon={billO}
                            selectedIcon={bill}
                        />
                        <TabItem
                            to='/usage'
                            label='用量分析'
                            icon={statO}
                            selectedIcon={stat}
                        />
                    </TabBar>
                </div>
            </div>
        )
    }
}

export default hot(App)
