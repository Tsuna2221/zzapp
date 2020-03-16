import React from 'react';
import Fade from 'react-reveal/Fade';

//Assets
import Confirm from '../../assets/confirm.png'

import Orcamento from '../pacotes'

const Check = ({updatePrice, config, sendRequest, state: { selectedType, selectedLevel, selectedDuration, selectedSets, selectedResult, hideCheck, date, hour }}) => {
    let active = (
        selectedType.value !== "" && 
        selectedLevel.value !== "" && 
        selectedDuration.value !== "" && 
        date.replace(/_/g, "").length === 10 && 
        hour.replace(/_/g, "").length === 5 && 
        selectedSets.length > 0
    )
    
    
    const format = (number) => "R$" + parseInt(number).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    let orc = new Orcamento(config)
    const getTotal = () => {
        let duracao = selectedDuration ? selectedDuration.value : 0
        let values = selectedSets.map(({value, type, qty}) => {
            if(type === "servico"){
                return Math.ceil((orc.valorServico(selectedLevel.value, value, duracao) * qty) * orc.constants.multiplicador/5)*5
            }else if(type === "evento"){
                return Math.ceil((orc.valorFreela(selectedLevel.value, selectedType.value, duracao) * qty) * orc.constants.multiplicador/5)*5
            }else{
                return Math.ceil((orc.valorOutros(value) * qty) * orc.constants.multiplicador/5)*5
            }
        })

        let includes = (duracao) => {
            let setsCopy = [...selectedSets]
            let setsValues = setsCopy.map(({value}) => value)
            let albums = setsCopy.filter(({album}) => album === true)
            let prices = []
            
            if(setsValues.includes("cinegrafistas")){
                prices.push(Math.ceil(orc.valorServico(selectedLevel.value, "video_edicao", duracao) * orc.constants.multiplicador/5)*5)
            }
            if(setsValues.includes("fotografos")){
                prices.push(Math.ceil(orc.valorServico(selectedLevel.value, "tratamento_fotos", duracao) * orc.constants.multiplicador/5)*5)
            }
            if(albums.length > 0){
                prices.push(Math.ceil(orc.valorServico(selectedLevel.value, "diagramação_album", duracao) * orc.constants.multiplicador/5)*5)
            }

            let reducer = prices.length > 0 ? prices : [0] 
            let total = reducer.reduce((total, num) => total + num)
            
            return total
        }

        let reducer = values.length > 0 ? values : [0]
        let total = reducer.reduce((total, num) => total + num)
        total += includes(duracao)
        total += selectedResult.value === "online" ? 0 : Math.ceil(orc.valorOutros(selectedResult.value) * orc.constants.multiplicador/5)*5

        const obj = {
            totalPrice: total,
            discountedPrice: total - (total * orc.constants.mar_desconto / 100),
            discount: orc.constants.mar_desconto,
            total: {
                outros: 0,
                servicos: 0,
                evento: 0
            }
        }
        
        return obj;
    }
    return (
        <div className={`check-container ${hideCheck ? "hide" : ""}`}>
            <Fade duration={150}>
                <div className={`check-total d-flex pad-h-30 a-vertical a-between  ${active ? "" : "d-none"}`}>
                    <div>
                        <p className="c-white f-roboto w-bold s-16">Subtotal: {format(getTotal().totalPrice)}</p>
                        <p className="c-white f-roboto w-bold s-16 mar-v-12">Desconto: {orc.constants.mar_desconto}%</p>
                        <p className="c-white f-roboto w-bold s-20">Total: {format(getTotal().discountedPrice)}</p>
                    </div>
                    <div onClick={() => sendRequest(getTotal())} className="confirm-request d-flex a-center br-circle clickable">
                        <img src={Confirm} alt=""/>
                    </div>
                </div>
            </Fade>
        </div>
    )
}

export default Check;