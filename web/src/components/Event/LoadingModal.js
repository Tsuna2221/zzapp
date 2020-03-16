import React from 'react'

const LoadingModal = ({loading}) => (
    <div className={`loading-modal pos-fixed cw-max-view ch-max-view d-flex a-center ${loading.status ? "" : "no-events no-opacity"}`}>
        <div className="d-flex fdir-column a-center">
            <div className="spinner"></div>
            <p className="f-roboto mar-t-30 s-16 c-white w-medium">{loading.text}</p>
        </div>
    </div>
)

export default LoadingModal;