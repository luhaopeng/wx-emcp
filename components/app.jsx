import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import queryString from 'query-string'
import dayjs from 'dayjs'
import { isWeChat, isProd, isTest, isHaina, authUrl } from '../util/constants'
import { Wechat, Haina, Test } from '../api/url'
import TabBar from './tabbar'
import PageUser from './user'
import PagePay from './pay'
import PageBill from './bill'
import PageDetail from './bill/detail'
import PageUsage from './usage'
import PageLogin from './login'
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
import ErrorCatcher from './error-catcher'
import Reporter from '../util/reporter'

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
            label='账单查询'
            exact={true}
            icon={billO}
            selectedIcon={bill}
        />
        <TabItem
            to='/usage'
            label='用量分析'
            icon={statO}
            selectedIcon={stat}
        />
        <TabItem to='/pay' label='余额充值' icon={payO} selectedIcon={pay} />
        <TabItem to='/user' label='个人中心' icon={userO} selectedIcon={user} />
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
                    Toast.loading('请稍等', 0)
                    let { data } = await Wechat.auth.query({ code: this.code })
                    Toast.hide()
                    localStorage.openId = data.data.openId
                    window.location.href = window.location.href.replace(/\?.*#/, '#') // prettier-ignore
                } catch (err) {
                    Toast.hide()
                    localStorage.removeItem('openId')
                    let reporter = new Reporter()
                    reporter.setRequest(err)
                    await Test.report.query(
                        reporter.format('app/mount', '微信授权')
                    )
                }
            } else if (isHaina && !localStorage.residentId) {
                try {
                    Toast.loading('请稍等', 0)
                    let { data } = await Haina.auth.query({ code: this.code })
                    Toast.hide()
                    localStorage.residentId = data.data.residentId
                    window.location.href = window.location.href.replace(/\?.*#/, '#') // prettier-ignore
                } catch (err) {
                    Toast.hide()
                    localStorage.removeItem('residentId')
                    let reporter = new Reporter()
                    reporter.setRequest(err)
                    await Test.report.query(
                        reporter.format('app/mount', '海纳授权')
                    )
                }
            }
        }
    }

    render() {
        return (
            <ErrorCatcher>
                <div>
                    <Switch>
                        <AuthRoute exact path='/' component={PageBill} />
                        <AuthRoute path='/detail' component={PageDetail} />
                        <AuthRoute path='/usage' component={PageUsage} />
                        <AuthRoute path='/pay' component={PagePay} />
                        <AuthRoute path='/user' component={PageUser} />
                        <Route path='/login' component={PageLogin} />
                        <Route path='/paid' component={PagePaid} />
                        <Route path='/redirect' component={PageRedirect} />
                        <AuthRoute component={PageBill} />
                    </Switch>

                    <Switch>
                        <Route exact path='/' component={TabWrap} />
                        <Route exact path='/usage' component={TabWrap} />
                        <Route exact path='/pay' component={TabWrap} />
                        <Route exact path='/user' component={TabWrap} />
                    </Switch>
                </div>
            </ErrorCatcher>
        )
    }
}

export default hot(App)
