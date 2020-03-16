import React, { useContext } from 'react'

import { UserContext } from '../../contexts/UserContext'

const About = ({event}) => {
    const format = (number) => "R$" + parseInt(number).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    const { client_email, client_name, client_phone, discount, duration, level, set, total, type, status, id, date, hour, result } = event.request 
    const { account_type } = useContext(UserContext).user

    return (
        <div className='UserScroller mar-b-85'>            
            <div className="mar-v-26">
                <span className="c-white s-16 f-roboto mar-l-20 w-medium">Sobre o evento</span>
                <p className="c-white s-15 f-roboto mar-t-16 mar-l-20">Nome do evento: <span className="mar-l-2 w-regular">{event.name || "(Sem Nome)"}</span></p>
                <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">Tipo de evento: <span className="mar-l-2 w-regular">{type}</span></p>
                <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">Nível: <span className="mar-l-2 w-regular">{level}</span></p>
                <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">Duração: <span className="mar-l-2 w-regular">{duration} {duration === 1 ? "hora" : "horas"}</span></p>
                <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">Data do evento: <span className="mar-l-2 w-regular">{date}, ás {hour}</span></p>
            </div>

            <div className="mar-v-20">
                <span className="c-white s-16 f-roboto mar-l-20 w-medium">Cliente</span>
                <p className="c-white s-15 f-roboto mar-t-16 mar-l-20">Por: <span className="mar-l-2 w-regular">{client_name}</span></p>
                <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">E-mail: <span className="mar-l-2 w-regular">{client_email}</span></p>
                {
                    account_type === "admin" ?
                        <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">Telefone: <span className="mar-l-2 w-regular">{`(${client_phone.substr(0,2)}) ${client_phone.substr(2,5)}-${client_phone.substr(7)}`}</span></p>
                    :
                        null
                }
            </div>

            {
                set.length > 0 ?
                    <div className="mar-v-20">
                        <span className="c-white s-16 f-roboto mar-l-20 w-medium">Serviços e Produtos</span>
                        <p className="c-white s-15 f-roboto mar-t-16 mar-l-20">Resultado: <span className="mar-l-2 w-regular">{result}</span></p>
                        {
                            set.map(({label, qty, obs}) => (
                                <div key={label} className="mar-v-20">
                                    <p className="c-white s-15 f-roboto mar-t-16 mar-l-20">Pacote: <span className="mar-l-2 w-regular">{label}</span></p>
                                    <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">Quantidade: <span className="mar-l-2 w-regular">{qty}</span></p>
                                    <p className="c-white s-15 f-roboto mar-t-12 mar-l-20">Observação: <span className="mar-l-2 w-regular">{obs ? obs : "Nenhuma observação"}</span></p>
                                </div>
                            ))
                        }
                    </div>
                :
                    null
            }
        </div>
    )
}

export default About