import React from 'react'
import { List, Button } from 'antd-mobile'
import { Test } from '../../api/url'
import Reporter from '../../util/reporter'
import './index.less'

class ErrorCatcher extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    async componentDidCatch(error, errorInfo) {
        let reporter = new Reporter()
        reporter.setReact(error, errorInfo)
        await Test.report.query(reporter.format('全局', 'react 组件渲染错误'))
    }

    hUserCenter = () => {
        window.location.href = 'http://hl.energyman.cn/wxemcp/jsp/p.html'
    }

    hBalance = () => {
        window.location.href = 'http://hl.energyman.cn/wxemcp/jsp/b.html'
    }

    hBill = () => {
        window.location.href = 'http://hl.energyman.cn/wxemcp/jsp/m.html'
    }

    hUsage = () => {
        window.location.href = 'http://hl.energyman.cn/wxemcp/jsp/u.html'
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='error-catcher'>
                    <p>
                        您会看到这个页面，是因为发生了一点点意外，错误已经上报给后台，技术人员会尽快分析并努力解决这个问题。
                    </p>
                    <p>
                        为了避免这个意外耽误您原本的事务，您可以暂时访问下面这四个旧版链接：
                    </p>
                    <List>
                        <List.Item>
                            <Button
                                onClick={this.hUserCenter}
                                className='backup-btn'
                                type='primary'
                            >
                                个人中心
                            </Button>
                        </List.Item>
                        <List.Item>
                            <Button
                                onClick={this.hBalance}
                                className='backup-btn'
                                type='primary'
                            >
                                余额充值
                            </Button>
                        </List.Item>
                        <List.Item>
                            <Button
                                onClick={this.hBill}
                                className='backup-btn'
                                type='primary'
                            >
                                账单查询
                            </Button>
                        </List.Item>
                        <List.Item>
                            <Button
                                onClick={this.hUsage}
                                className='backup-btn'
                                type='primary'
                            >
                                用量分析
                            </Button>
                        </List.Item>
                    </List>
                    <p>
                        您可以在公众号中发送『旧链接』，公众号会将以上四个链接回复给您。
                    </p>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorCatcher
