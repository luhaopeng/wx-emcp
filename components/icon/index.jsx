import React from 'react'
import 'antd-mobile/lib/icon/style/index.less'
import './index.less'

const Icon = ({ svg, className = '', size = 'md', ...restProps }) => (
    <svg className={`am-icon am-icon-${size} ${className}`} {...restProps}>
        <use xlinkHref={`#${svg.id}`} />
    </svg>
)

export default Icon
