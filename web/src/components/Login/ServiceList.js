import React, { useState } from 'react';

//Assets
import Close from '../../assets/Close.png'

const list = [
    {label:"Cinegrafista", value: "cinegrafistas"},
    {label:"Fotógrafo", value: "fotografos"},
    {label:"Edição de Vídeo", value: "video_edicao"},
    {label:"Tratamento de Fotos", value: "tratamento_fotos"},
    {label:"Diagramação de Álbum", value: "diagramacao_album"},
]

const ServiceList = ({serviceActivated, closeModal, update}) => {
    const [checkList, setList] = useState([])
    const handleCheck = (name) => {
        let checked = [...checkList]

        if(checked.includes(name)){
            checked = checked.filter((item) => item !== name)
        }else{
            checked.push(name)
        }

        setList(checked)
    }
    return(
        <div className={`log-form-container mentor-select z-index-100 ${serviceActivated ? "" : "no-opacity no-events"}`}>
            <div className="d-flex a-between a-vertical cw-fill mar-t-30 mar-h-20">
                <p className="c-white s-18 w-medium f-roboto">Selecionar Serviços</p>
                <img onClick={closeModal} className="mentor-modal-close clickable" src={Close} alt=""/>
            </div>
            <form onChange={({target: { name }}) => handleCheck(name)} className="mentor-list-s full pad-h-20 mar-b-16 mar-t-20 overflow-y-scroll">
                {
                    list.map(({label, value}) => (
                        <div className="d-flex a-vertical cw-100 bb white pad-v-6">
                            <input className="ch-inherit" type="checkbox" name={value} id={value}/>
                            <label className="pad-h-8 c-white s-14 f-roboto cw-100" htmlFor={value}>{label}</label>
                        </div>
                    ))
                }
            </form>
            <div onClick={() => update(checkList)} className="d-flex confirm-container mar-14">
                <div className="confirm w-medium no-select cw-fit s-12 c-orange clickable">Confirmar</div>
            </div>
        </div>
    )
}

export default ServiceList;