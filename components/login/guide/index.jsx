import React from 'react'
import { List, Radio, Button } from 'antd-mobile'
import './index.less'

class Guide extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0
        }
    }

    handleBindClick = () => {
        localStorage.customerId = 68
        let { history, location } = this.props
        let { from } = location.state || { from: { pathname: '/' } }
        history.replace(from)
    }

    render() {
        const records = [
            {
                hm: '张腾',
                company: '华立科技股份有限公司'
            },
            {
                hm: '张腾2',
                company: '华立测试'
            },
            {
                hm: 'test',
                company: '华立演示专用'
            },
            {
                hm: '1234',
                company: '滨城物业'
            }
        ]
        let { selectedIndex } = this.state
        let list = records.map((val, idx) => (
            <Radio.RadioItem
                key={idx}
                checked={selectedIndex === idx}
                onChange={() => {
                    this.setState({ selectedIndex: idx })
                }}
            >
                <div className='record-wrap'>
                    <div>{val.hm}</div>
                    <div>{val.company}</div>
                </div>
            </Radio.RadioItem>
        ))
        return (
            <div className='page-guide'>
                <header>
                    <p>匹配到多条记录</p>
                    <p>请在以下选择一条进行绑定：</p>
                </header>
                <List>{list}</List>
                <Button
                    type='primary'
                    className='bind-btn'
                    onClick={this.handleBindClick}
                >
                    绑定
                </Button>
            </div>
        )
    }
}

export default Guide
