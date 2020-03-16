import React, { useContext } from 'react';

//Contexts
import { ConfirmContext } from '../../contexts/ConfirmContext'

//Assets
import Close from '../../assets/Close.png'

const ConfirmModal = () => {
    const { config, active, activateModal } = useContext(ConfirmContext)
    const { label, text, leftLabel, leftFunc, rightLabel, rightFunc } = config

    return (
        <div className={`confirm-modal pos-fixed ${active ? "active" : "no-events no-opacity"}`}>
            <div>
                <div className="top-modal d-flex a-between a-vertical mar-b-12">
                    <span className="f-roboto s-18 c-white w-black mar-r-16">{label}</span>
                    <img onClick={() => activateModal(!active)} className="clickable" src={Close} alt=""/>
                </div>

                <span className="f-roboto s-18 c-white mar-r-40">{text}</span>

                <div className="bottom-modal cw-100 d-flex a-between">
                    <div onClick={() => {activateModal(!active); leftFunc()}} className="d-flex confirm-container mar-t-30 mar-r-10">
                        <div className="confirm cw-fit s-12 c-orange w-medium clickable">{leftLabel}</div>
                    </div>
                    <div onClick={() => {activateModal(!active); rightFunc()}} className="d-flex confirm-container mar-t-30">
                        <div className="confirm cw-fit s-12 c-orange w-medium clickable">{rightLabel}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal;