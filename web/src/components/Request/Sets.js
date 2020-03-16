import React, { Fragment } from 'react';

//Assets
import MMinus from '../../assets/mini-minus.png'
import MPlus from '../../assets/mini-plus.png'

import Orcamento from '../pacotes'

const Sets = ({state, changeQty, setClickedObs, config}) => {
    const format = (number) => "R$" + parseInt(number).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

    return (
        <Fragment>
            {
                state.selectedSets.length > 0 ?
                    state.selectedSets.map(({qty, label, value, obs, type}, index) => {
                        const { selectedDuration, selectedType, selectedLevel } = state
                        const duracao = selectedDuration ? selectedDuration.value : 0
                        const orc = new Orcamento(config)
                        const getPrice = () => {
                            const baseEvento = type === "evento" ?          
                                Math.ceil((orc.valorFreela(selectedLevel.value, selectedType.value, duracao) * qty) * orc.constants.multiplicador/5)*5
                            :
                                type === "servico" ?
                                    Math.ceil((orc.valorServico(selectedLevel.value, value, duracao) * qty) * orc.constants.multiplicador/5)*5
                                :
                                    Math.ceil((orc.valorOutros(value) * qty) * orc.constants.multiplicador/5)*5

                            return baseEvento;
                        }
                        
                        return (
                            <div key={value} className="mar-t-20 mar-b-30 mar-l-40">
                                <div className="d-flex a-vertical">
                                    <span className="c-black w-medium s-18 f-roboto">{label}</span>
                                    <div className="d-flex a-vertical mar-l-14">
                                        <img onClick={() => changeQty("sub", index)} className="mini-btn clickable" src={MMinus} alt=""/>
                                        <img onClick={() => changeQty("add", index)} className="mini-btn clickable mar-l-8" src={MPlus} alt=""/>
                                    </div>
                                </div>
                                <div className="mar-t-10">
                                    <span className="c-black w-light s-14 f-roboto">Quantidade: {qty}</span>
                                    <span className={`c-black w-light s-14 f-roboto mar-h-16`}>Observação: <span onClick={() => !obs ? setClickedObs(index) : null } className={`${obs ? "" : "clickable dec"}`}>{obs ? obs : "Adicionar observação"}</span></span>
                                    <span className="c-black w-light s-14 f-roboto">Valor: {format(getPrice())}</span>
                                </div>
                            </div>
                        )
                    })
                :
                    <div className="cw-100 d-flex a-center">
                        <span className="c-black f-roboto s-16 pad-v-30">Nenhum serviço ou produto selecionado</span>
                    </div>
            }
        </Fragment>
    )
}

export default Sets;