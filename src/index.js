import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from '../components/app'
import { basename } from '../util/constants'

ReactDOM.render(
    <BrowserRouter basename={basename}>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
)
