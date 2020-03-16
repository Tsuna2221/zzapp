import React, { Fragment, useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade';

//Assets
import Plus from '../../assets/Plus.png'

//Context
import { EventContext } from '../../contexts/EventContext'
import { UserContext } from '../../contexts/UserContext'

//Components
import CreateEventModal from './CreateEventModal'

const Event = (props) => {
    const { events, searchFilter, setSearchFilter } = useContext(EventContext)
    const { account_type } = useContext(UserContext).user
    const [modalActivated, activateModal] = useState(false)
    const { user, setLocation } = useContext(UserContext)
    const [status, setSortStatus] = useState(user.account_type === "admin" ? "pendente" : "agendado")
    const eventsCopy = [...events]

    const filter = () => {
        let { account_type } = user

        if(account_type === "admin"){
            return eventsCopy.filter(({current_status}) => current_status === status)
        }else{
            return eventsCopy.filter(({current_status, related, equivalent}) => {          
                let relatedUsers = related[account_type === "mentor" ? "pros" : account_type === "pro" ? "pros" : 'clients'].map(({id}) => id === user.id)

                if(status === "portfolio"){
                    return current_status === status && (!relatedUsers.includes(true) || equivalent)
                }else if(status === "agendado"){
                    return current_status === status && (relatedUsers.includes(true) || equivalent)
                }else if(status === "fechado"){
                    return current_status === status && (relatedUsers.includes(true) || equivalent)
                }else if(status === "finalizados"){
                    return current_status === "portfolio" && (relatedUsers.includes(true) || equivalent)
                }else if(status === "pendente"){
                    return current_status === status && (relatedUsers.includes(true) || equivalent)
                }
            })
        }
    }

    setLocation(props.location.pathname)
    
    props.history.listen((loc) => {
        setLocation(loc.pathname)
        setSearchFilter('')
    })

    return (
        <Fragment>
            <Fade duration={300}>
                <div className="set-area overflow-y-scroll d-flex main-container fdir-column a-vertical">
                    <div className="sort-bar cw-100 d-flex a-between ch-fit">
                        {
                            user.account_type === "admin" ?
                                <span onClick={() => setSortStatus("pendente")} className={`mar-t-6 ch-fit c-black f-roboto s-14 pad-14 clickable ${status === "pendente" ? "bball medium red c-red" : "bball transparent"}`}>Pendentes</span>
                            :
                                null
                        }
                        <span onClick={() => setSortStatus("agendado")} className={`mar-t-6 ch-fit c-black f-roboto s-14 pad-14 clickable ${status === "agendado" ? "bball medium blue c-blue" : "bball transparent"}`}>Confirmados</span>
                        <span onClick={() => setSortStatus("fechado")} className={`mar-t-6 ch-fit c-black f-roboto s-14 pad-14 clickable ${status === "fechado" ? "bball medium sorange c-sorange" : "bball transparent"}`}>Realizados</span>
                        <span onClick={() => setSortStatus(user.account_type === "admin" ? "portfolio" : "finalizados")} className={`mar-t-6 ch-fit c-black f-roboto s-14 pad-14 clickable ${status === "finalizados" || status === "portfolio"? "bball medium green c-green" : "bball transparent"}`}>Finalizados</span>
                    </div>
                    <div style={{width: "95%"}}>
                        {
                            filter().length > 0 ?
                                filter().filter(({name}) => {let event_name = name ? name : ""; return event_name.toLowerCase().includes(searchFilter.toLowerCase()) }).sort((a, b) => b.id - a.id).map(({ name, request, images, id, current_status }) => {
                                    let validImages = images.sort((a, b) => b.id - a.id).filter((data, index) => index < 5)

                                    return (
                                        <Link to={{pathname: `/evento/${id}`}} className='EventContainer mar-b-18'>
                                            <div className="d-flex a-between">
                                                <p className={`f-roboto s-20 w-black mar-t-26 mar-b-18 ${!name ? "c-gray w-medium" : "c-black"} `}>{name ? name : "(Sem Nome)"}</p>
                                                <p className={`f-roboto s-16 c-black w-regular mar-t-26 mar-b-18`}>{current_status === "agendado" ? `Confirmado${request ? ` (${request.date})` : ""}` : current_status === "fechado" ? "Realizado" : current_status === "pendente" ? "Pendente" : 'Finalizado'}</p>
                                            </div>
                                            <div style={{maxWidth: validImages.length > 0 ? "min-content" : null}} className="d-flex">
                                                {
                                                    validImages.length > 0 ?
                                                        validImages.map(({id, name, type}, index) => (
                                                            <Fragment key={id}>
                                                                <Fade duration={500}>
                                                                    {
                                                                        index === 4 ?
                                                                            <div className="event-cell">
                                                                                <div className="last-overlay d-flex a-center f-roboto w-black c-white s-22">+{images.length - 4}</div>
                                                                                <img className="cover" src={`http://18.228.199.251:5000/static/${type.includes("video") ? `thumb-${name}.jpg` : name}`} alt=""/>
                                                                            </div>
                                                                        :
                                                                            <div className="event-cell mar-r-10">
                                                                                <img className="cover" src={`http://18.228.199.251:5000/static/${type.includes("video") ? `thumb-${name}.jpg` : name}`} alt=""/>
                                                                            </div>
                                                                    }
                                                                </Fade>
                                                            </Fragment>
                                                        ))
                                                    :
                                                        <div className="cw-100 d-flex a-center">
                                                            <span className="c-black f-roboto s-16 pad-v-30">Nenhuma imagem encontrada</span>
                                                        </div>
                                                }
                                            </div>
                                        </Link>
                                    )
                                })
                            :
                                <div className="cw-100 d-flex a-center">
                                    <span className="c-black f-roboto s-16 pad-v-30">Nenhum evento encontrado</span>
                                </div>
                        }
                    </div>
                    {
                        account_type === "admin" || account_type === "mentor" ? 
                            <div onClick={() => activateModal(!modalActivated)} className="float-btn pos-fixed d-flex a-center br-circle">
                                <img className="plus" src={Plus} alt=""/>
                            </div>
                        :
                            null
                    }
                </div>
            </Fade>
            <CreateEventModal activate={{modalActivated, activateModal}}/>
        </Fragment>
    );
}

export default Event;