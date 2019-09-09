class Reporter {
    constructor() {
        const { customerId, customerid, openId, openid } = localStorage
        this.UserInfo = {
            customerId: customerId || customerid,
            openId: openId || openid
        }

        this.Hardware = {
            userAgent: window.navigator.userAgent
        }
    }

    setRequest(axiosErr) {
        let errorReport = {
            url: axiosErr.config.url,
            param: axiosErr.config.data,
            errMsg: axiosErr.message
        }
        if (axiosErr.response) {
            let extra = {
                retData: axiosErr.response.data,
                status: axiosErr.response.status,
                statusText: axiosErr.response.statusText
            }
            Object.assign(errorReport, {
                extra: JSON.stringify(extra)
            })
        }
        this.Request = errorReport
    }

    setReact(error, errorInfo) {
        this.React = {
            error: JSON.stringify(error),
            errorInfo: JSON.stringify(errorInfo)
        }
    }

    format(position, message) {
        return {
            position,
            message,
            ...this.UserInfo,
            ...this.Hardware,
            ...this.Request,
            ...this.React
        }
    }
}

export default Reporter
