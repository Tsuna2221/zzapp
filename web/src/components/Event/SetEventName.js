import React, { useContext, useState, Fragment } from 'react';

import { MessageModal, activate } from '../etc/MessageModal'

//Contexts
import { UserContext } from '../../contexts/UserContext'
import { EventContext } from '../../contexts/EventContext'

//Assets
import Close from '../../assets/Close.png'

//Client
import { createEvent } from  '../client'

const SetEventName = ({activate: { modalActivated, activateModal, hideModal }, setPendingName}) => {
    const [name, setName] = useState("")

    return (
        <Fragment>
            <div className={`create-event-modal pos-fixed pad-20 ${modalActivated ? "" : "no-events no-opacity"}`}>
                <div className="d-flex a-between a-vertical">
                    <span className="f-roboto s-18 c-white w-black">Nome do Evento</span>
                    <img onClick={hideModal} className="float-image-btn no-pad pos-absolute" src={Close} alt=""/>
                </div>

                <div className="input-area d-flex fdir-column mar-h-14 mar-t-30 mar-b-20">
                    <label className="f-roboto s-18 c-white">Informe o nome do evento</label>
                    <input onChange={({target: { value }}) => setPendingName(value)} className="c-black no-outline mar-t-10 pad-14" type="text"/>
                </div>

                <div className="d-flex cw-100 confirm-container mar-t-30">
                    <div onClick={() => {activateModal(!modalActivated); setName("")}} className="confirm w-medium no-select cw-fit s-12 c-orange clickable">Atualizar Evento</div>
                </div>
            </div>
        </Fragment>
    )
}

export default SetEventName;