import React from 'react';

//Assets
import Confirm from '../../assets/confirm.png'
import Error from '../../assets/error.png'

export const MessageModal = ({name, message, status}) => (
    <div name={"mm" + name} className='message-modal'>
        <div className="modal-status mar-l-8 mar-r-10 br-circle d-flex a-center">
            <img src={status === "error" ? Error : Confirm} alt=""/>
        </div>
        <p className="c-white s-16 f-roboto w-medium mar-r-20">{message}</p>
    </div>
)

export const activate = async (name) => {
    const selector = document.querySelector(`[name=mm${name}]`)
    if(!selector.className.includes('enabled')){
        selector.classList.toggle('enabled')
        setTimeout(() => {
            selector.classList.toggle('enabled')
        }, 3000)
    }
}