import React, { useState } from 'react';

//Assets
import Close from '../../assets/Close.png'

const AddObs = ({index, active, updateObs}) => {
    const [input, setInput] = useState()
    return (
        <div className={`create-event-modal pos-fixed pad-20 ${active.active ? "" : "no-opacity no-events"}`}>
            <div className="d-flex a-between a-vertical">
                <span className="f-roboto s-18 c-white w-black">Adicionar observação</span>
                <img onClick={active.setActive} className="float-image-btn no-pad pos-absolute" src={Close} alt=""/>
            </div>
    
            <div className="input-area d-flex fdir-column mar-h-14 mar-t-30 mar-b-20">
                <label className="f-roboto s-18 c-white">Insira a observação</label>
                <input onChange={({target: { value }}) => setInput(value)} className="c-black no-outline mar-t-10 pad-14" type="text"/>
            </div>
    
            <div className="d-flex cw-100 confirm-container mar-t-30">
                <div onClick={() => updateObs(input)} className="confirm no-select w-medium cw-fit s-12 c-orange clickable">Salvar</div>
            </div>
        </div>
    )
}

export default AddObs;