import React from 'react'
import classNames from 'classnames'
import 'antd-mobile/lib/icon/style/index.less'
import './index.less'

const Icon = ({ svg, className = '', size = 'md', ...restProps }) => (
  <svg
    className={classNames('am-icon', `am-icon-${size}`, className)}
    {...restProps}
  >
    <use xlinkHref={`#${svg.id}`} />
  </svg>
)

export default Icon
