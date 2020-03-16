import React, { Fragment, useState, useContext } from 'react';

//Client
import { updateRequest } from  '../client'

//Assets
import Close from '../../assets/Close-Black.png'

//Contexts
import { UserContext } from  '../../contexts/UserContext'

//Components
import CreateEventModal from '../Event/CreateEventModal'
import SetPros from './SetPros'

const Details = ({route, request, active: { setActive, isActive }, update}) => {
    const { client_email, client_name, client_phone, discount, duration, level, set, total, type, status, id, date, hour, result } = request
    const format = (number) => "R$" + parseInt(number).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    const [currentStatus, setStatus] = useState(null)
    const [modalActivated, activateModal] = useState(false)
    const [setProsVisible, setVisible] = useState(false)
    const [eventName, setEventName] = useState("")
    const { user } = useContext(UserContext)

    const updateStatus = (status) =>{
        if(status === "accepted"){
            activateModal(true)
            setStatus(status)
        }else{
            updateRequest(user.id, id, "rejected").then(() => update(status))
        }
    }


    return (
        (
            <div className={`set-area overflow-y-scroll request-details z-index-50 ${isActive ? "" : "no-events no-opacity"}`}>
                <CreateEventModal eventName={eventName} setEventName={setEventName} fnc={async () => setVisible(true)} related={id} activate={{modalActivated, activateModal }}/>
                {
                    client_email ? 
                        <div className="mar-h-20">
                            {
                                setProsVisible ?
                                    <SetPros name={eventName} request={request}/>
                                :
                                    null
                            }
                            <div className="d-flex a-between a-vertical">
                                <p className="f-roboto c-black s-20 w-black mar-t-26 mar-b-18">Detalhes</p>
                                <div className="d-flex a-vertical">
                                    {/* {
                                        status === "pending" ?
                                            <Fragment>
                                                <div onClick={() => updateStatus("accepted")} className="user-btn">Aprovar</div>
                                                <div onClick={() => updateStatus("rejected")} className="user-btn red mar-l-14 mar-r-18">Rejeitar</div>
                                            </Fragment>
                                        :
                                            <p className="c-black s-14 f-roboto mar-t-6 mar-r-10">Solicitação {`${status === "accepted" ? "aceita" : "rejeitada"}`}</p>
                                    } */}
                                    <img onClick={setActive} className="edit-close clickable" src={Close} alt=""/>
                                </div>
                            </div>
                            <div>
                                <div className="bb">
                                    <span className="c-black w-medium s-16 mar-v-6 f-roboto d-flex mar-b-14">Sobre o evento</span>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Tipo de evento: <span className="mar-l-4 w-regular">{type}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Nível: <span className="mar-l-4 w-regular">{level}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Duração: <span className="mar-l-4 w-regular">{duration} {duration === 1 ? "hora" : "horas"}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Data do evento: <span className="mar-l-4 w-regular">{date}, ás {hour}</span></p>
                                </div>
                                <div className="bb">
                                    <span className="c-black w-medium s-16 mar-v-6 f-roboto d-flex mar-b-14">Cliente</span>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Por: <span className="mar-l-4 w-regular">{client_name}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">E-mail: <span className="mar-l-4 w-regular">{client_email}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Telefone: <span className="mar-l-4 w-regular">{`(${client_phone.substr(0,2)}) ${client_phone.substr(2,5)}-${client_phone.substr(6)}`}</span></p>
                                </div>
                                {
                                    set.length > 0 ?
                                        <div className="bb">
                                            <span className="c-black w-medium s-16 mar-t-6 f-roboto d-flex mar-b-14">Serviços e Produtos</span>
                                            <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Resultado: <span className="mar-l-4 w-regular">{result}</span></p>
                                            {
                                                set.map(({label, qty, obs}) => (
                                                    <div key={label} className="mar-v-16">
                                                        <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Pacote: <span className="mar-l-4 w-regular">{label}</span></p>
                                                        <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Quantidade: <span className="mar-l-4 w-regular">{qty}</span></p>
                                                        <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Observação: <span className="mar-l-4 w-regular">{obs ? obs : "Nenhuma Observação"}</span></p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    :
                                        null
                                }
                                <div className="bb">
                                    <span className="c-black w-medium s-16 mar-v-6 f-roboto d-flex mar-b-14">Orçamento</span>
                                    {/* <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Serviços (Total): <span className="mar-l-4 w-regular">{format(total.servicos)}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Eventos (Total): <span className="mar-l-4 w-regular">{format(total.eventos)}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Outros (Total): <span className="mar-l-4 w-regular">{format(total.outros)}</span></p> */}
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Sub-Total: <span className="mar-l-4 w-regular">{format(total.sub)}</span></p>
                                    <p className="c-black w-medium s-14 mar-v-6 f-roboto d-flex lh-medium">Total (-{discount}%): <span className="mar-l-4 w-regular">{format(total.sub - (total.sub * discount / 100))}</span></p>
                                </div>
                            </div>
                        </div>
                    :
                        null
                }
            </div>
        )
    )
}

export default Details;