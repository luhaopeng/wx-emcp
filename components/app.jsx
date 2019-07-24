import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import queryString from 'query-string'
import dayjs from 'dayjs'
import { isWeChat, isProd, isTest, isHaina, authUrl } from '../util/constants'
import { Wechat, Haina } from '../api/url'
import TabBar from './tabbar'
import PageUser from './user'
import PagePay from './pay'
import PageBill from './bill'
import PageUsage from './usage'
import PageLogin from './login'
import PageHistory from './user/history'
import PageMeters from './user/meterList'
import PagePaid from './pay/done'
import PageRedirect from './pay/redirect'
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
                <Link to={to} replace>
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

const TabWrap = () => (
    <TabBar>
        <TabItem
            to='/'
            label='个人中心'
            exact={true}
            icon={userO}
            selectedIcon={user}
        />
        <TabItem to='/pay' label='余额充值' icon={payO} selectedIcon={pay} />
        <TabItem to='/bill' label='账单查询' icon={billO} selectedIcon={bill} />
        <TabItem
            to='/usage'
            label='用量分析'
            icon={statO}
            selectedIcon={stat}
        />
    </TabBar>
)

const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                let { customerId, lastLogin } = localStorage
                if (
                    customerId &&
                    lastLogin &&
                    dayjs().diff(dayjs(lastLogin), 'day') < 7
                ) {
                    return <Component {...props} />
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: '/login',
                                search: props.location.search,
                                state: { from: props.location }
                            }}
                        />
                    )
                }
            }}
        />
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        if (isWeChat) {
            if ((isProd || isTest) && !localStorage.openId) {
                if (!localStorage.getting) {
                    localStorage.getting = true
                    window.location.href = authUrl
                } else {
                    let { code } = queryString.parse(window.location.search)
                    this.code = code
                    localStorage.removeItem('getting')
                }
            } else if (isHaina && !localStorage.residentId) {
                let { resident_code } = queryString.parse(
                    window.location.search
                )
                this.code = resident_code
            }
        }
    }

    async componentDidMount() {
        if (isWeChat && this.code) {
            if ((isProd || isTest) && !localStorage.openId) {
                try {
                    let { data } = await Wechat.auth.query({ code: this.code })
                    localStorage.openId = data.data.openId
                } catch (err) {
                    console.error(err)
                    localStorage.removeItem('openId')
                }
            } else if (isHaina && !localStorage.residentId) {
                try {
                    let { data } = await Haina.auth.query({ code: this.code })
                    localStorage.residentId = data.data.residentId
                } catch (err) {
                    console.error(err)
                    localStorage.removeItem('residentId')
                }
            }
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <AuthRoute exact path='/' component={PageUser} />
                    <AuthRoute path='/history' component={PageHistory} />
                    <AuthRoute path='/meters' component={PageMeters} />
                    <AuthRoute path='/pay' component={PagePay} />
                    <AuthRoute path='/bill' component={PageBill} />
                    <AuthRoute path='/usage' component={PageUsage} />
                    <Route path='/login' component={PageLogin} />
                    <Route path='/paid' component={PagePaid} />
                    <Route path='/redirect' component={PageRedirect} />
                </Switch>

                <Switch>
                    <Route exact path='/' component={TabWrap} />
                    <Route exact path='/pay' component={TabWrap} />
                    <Route exact path='/bill' component={TabWrap} />
                    <Route exact path='/usage' component={TabWrap} />
                </Switch>
            </div>
        )
    }
}

export default hot(App)
