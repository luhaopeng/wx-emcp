import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from '../components/app'

const isDev = process.env.NODE_ENV === 'development'

ReactDOM.render(
    <BrowserRouter basename={isDev ? '/' : '/wxemcp/jsp'}>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
)
