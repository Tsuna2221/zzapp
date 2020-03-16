import React, { useState, useContext, Fragment } from 'react';

//Components
import UserScroller from './UserScroller'
import AddUser from './AddUser';
import LoadingModal from './LoadingModal';
import About from './About';
import SetEventName from './SetEventName';
import SetPros from '../ViewRequest/SetPros';
import Request from '../Request';
import { MessageModal, activate } from '../etc/MessageModal'

//Assets
import Close from '../../assets/Close.png'
import Trash from '../../assets/Trash.png'

//Context
import { EventContext } from '../../contexts/EventContext'
import { ConfirmContext } from '../../contexts/ConfirmContext'
import { UserContext } from '../../contexts/UserContext'

//Partials
import { statString } from '../partials'

//Client
import { uploadData, deleteEvent, getUsersBy, updateEvent, updateRequest } from '../client'

const DetailsModal = (props) => {
    const { event, activate: { detailsActivated, activateDetails } } = props

    const { addMediaTo, removeEvent, updateStatus, updatePros } = useContext(EventContext)
    const { setConfig, active, activateModal } = useContext(ConfirmContext)
    const { user } = useContext(UserContext)

    const [userAddActivated, activateUser] = useState(false)
    const [userAddType, setUserType] = useState("client")
    const [loadingImages, setLoading] = useState({status: false, text: ""})
    const [status, setStatus] = useState(null)
    const [nameVisible, setNameVisible] = useState(false)
    const [prosVisible, setProsVisible] = useState(false)
    const [requestVisible, setRequestVisible] = useState(false)
    const [pendingEventName, setPendingName] = useState('')
    const [created, setCreated] = useState(false)

    const statefulStatus = status ? status : event ? event.current_status : "?????"
    const validUser = event ? user.account_type === "admin" || user.id === event.created_by : false 
    const validPro = event ? event.related.pros.map(({id}) => id).includes(user.id) : false

    const config = {
        label: "Deletar evento",
        text: "Tem certeza que deseja deletar este evento?",
        leftLabel: "Não",
        leftFunc: () => null,
        rightLabel: "Sim",
        rightFunc: () => {
            setLoading(true)

            deleteEvent(user.id, event.id)
            .then(() => {
                removeEvent(event.id)
                    .then(() => {
                        setLoading(false)
                        props.history.push('/')
                    })
            })
        },
    }

    const userConfig = {
        label: "Adicionar usuário",
        text: "Que tipo de usuário deseja adicionar?",
        leftLabel: "Cliente",
        leftFunc: () => {
            setUserType("client")
            return activateUser(true)
        },
        rightLabel: "Profissional",
        rightFunc: () => {
            if(!event.request){
                activate('invalid-pros')
            }else{
                setCreated(false)
                setUserType("pro")
                return setProsVisible(true)
            }
        },
    }

    const rejectConfig = {
        label: "Rejeitar solicitação",
        text: "Tem certeza que deseja rejeitar esta solicitação?",
        leftLabel: "Não",
        leftFunc: () => null,
        rightLabel: "Sim",
        rightFunc: () => {
            updateEvent(props.event.id, { status: "rejeitado" })
                .then(() => props.history.push('/'))
                .then(() => updateStatus(props.event.id, "rejeitado"))
                .then(() => updateRequest(user.id, props.event.request.id, "rejected"))
        },
    }

    const uploadMedia = ({target}) => {
        const { id } = props.event

        setLoading({status: true, text: "Carregando mídias..."})
        const bases = [...target.files].map((file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        }))

        const baseList = bases.map(async promise => await promise)

        Promise.all(baseList).then((values) => {
            const array = [...target.files].map(({name, size, type}, index) => {
                return {
                    base: values[index],
                    image: {
                        path: name,
                        mime: type,
                        size
                    }
                }
            })

            setLoading({status: true, text: "Enviando mídias..."})

            return uploadData("event", id, array)
                .then((data) => {
                    const { activateDetails, detailsActivated } = props.activate

                    addMediaTo(id, data).then(() => activateDetails(!detailsActivated))
                }).then(() => setLoading({status: false, text: ""}))
        });
    }

    const changeStatus = (status) => {
        const { id, images, request, related } = props.event
        const newState = status === "agendado" ? "fechado" : "portfolio"
        
        if(status === "pendente"){
            setNameVisible(true)
        }else if(newState === "portfolio" && images.length === 0){
            activate("invalid-portfolio")
        }else if(newState === "fechado" && !request){
            activate("invalid-upgrade")
        }else if(newState === 'fechado' && related.pros.length === 0){
            activate('invalid-pros-upgrade')
        }else{
            setLoading({status: true, text: ""})
            updateEvent(id, { status: newState })
                .then(() => setLoading({status: false, text: ""}))
                .then(() => activate("event-update"))
                .then(() => setStatus(newState))
                .then(() => updateStatus(id, newState))
                .then(() => updateRequest(user.id, props.event.request.id, "accepted"))
        }
    }

    return (
        <Fragment>
            <div className={`set-area overflow-y-scroll details-modal z-index-100 ${detailsActivated ? 'active' : 'inactive'}`}>
                <LoadingModal loading={loadingImages}/>
                <SetEventName setPendingName={setPendingName} activate={{ modalActivated: nameVisible, hideModal: () => setNameVisible(false), activateModal: () => {setNameVisible(false); setProsVisible(true)} }}/>
                <img onClick={() => activateDetails(!detailsActivated)} className="float-image-btn pos-absolute" src={Close} alt=""/>
                {
                    event ? 
                        <Fragment>
                            <Request currentRequest={event.request} eventId={event.id} visible={requestVisible}/>
                            {
                                prosVisible ?
                                    <SetPros updatePros={updatePros} proList={event.related.pros} created={created} eventId={event.id} hide={() => setProsVisible(false)} visible={prosVisible} name={pendingEventName} request={event.request}/>
                                :
                                    null
                            }
                            {
                                event.related.clients.length === 0 || userAddActivated ? 
                                    <AddUser setUserType={setUserType} awaitingClient={event.related.clients.length === 0} eventId={event.id} related={event.related} activate={{userAddActivated: true, activateUser}} type={userAddType}/>
                                :
                                    null
                            }
                            <div className="mar-t-50">
                                {
                                    event.related.pros.length > 0 ?
                                        <UserScroller userType={user.account_type} eventId={event.id} label="Profissionais" users={event.related.pros}/>
                                    :
                                        null
                                }
                                {
                                    event.related.clients.length > 0 ?
                                        <UserScroller userType={user.account_type} eventId={event.id} label="Clientes" users={event.related.clients}/>
                                    :
                                        null
                                }
                                <div className='UserScroller'>
                                    <span className="c-white s-20 f-roboto mar-l-20 w-medium">Estatísticas</span>
                                    <p className="c-white s-15 f-roboto mar-t-16 mar-l-20">{statString(event)}</p>
                                    <p className="c-white s-15 f-roboto mar-t-16 mar-l-20">Status: {statefulStatus === "agendado" ? "Confirmado" : statefulStatus === "fechado" ? "Fechado" : statefulStatus === "pendente" ? "Pendente" : 'Portfólio'}</p>
                                </div>
                                {
                                    event.request ?
                                        <About event={event} />
                                    :
                                        null
                                }
                            </div>
                        </Fragment>
                    :
                    null
                }
                <div className="add-container d-flex">
                    {
                        event ?
                            validUser ? 
                                <Fragment>
                                    {
                                        validUser && statefulStatus === "fechado" ?
                                            <div className="clickable no-select d-flex a-center f-lato s-12 c-white mar-h-4">+Mídia
                                                <input onChange={(e) => uploadMedia(e)} multiple className="clickable pad-0 ch-100 pos-absolute no-opacity no-outline" type="file" name="upload-media" id="upload-media" accept="image/png, image/jpeg, .mp4"/>
                                            </div>
                                        :
                                            null
                                    }
                                    {
                                        validUser && statefulStatus === "fechado" || statefulStatus === "agendado" ?
                                            <div onClick={() => {setConfig(userConfig); activateModal(!active)}} className="clickable no-select d-flex a-center f-lato s-12 c-white mar-h-4">+Membro</div>
                                        :
                                            null
                                    }
                                    {
                                        validUser && statefulStatus !== "portfolio" ? 
                                            <div onClick={() => {changeStatus(statefulStatus); setCreated(true)}} className="clickable no-select d-flex a-center f-lato s-12 c-white pad-h-14 mar-h-4">{statefulStatus === "pendente" ? "Aceitar solicitação" : `Marcar como ${statefulStatus === "agendado" ? "fechado" : statefulStatus === "fechado" ? "portfólio" : ""}`}</div>
                                        :
                                            null
                                    }
                                    {
                                        validUser && statefulStatus === "pendente" ? 
                                            <div onClick={() => {setConfig(rejectConfig); activateModal(!active)}} className="clickable no-select d-flex a-center f-lato s-12 c-white pad-h-14 mar-h-4">Recusar solicitação</div>
                                        :
                                            null
                                    }
                                    {
                                        validUser && statefulStatus === "agendado" ?
                                            <div onClick={() => setRequestVisible(true)} className="clickable no-select d-flex a-center f-lato s-12 c-white pad-h-14 mar-h-4">Atualizar Solicitação</div>
                                        :
                                            null
                                    }
                                </Fragment>
                            : 
                                null
                        :
                            null
                    }
                </div>
                {
                    user.account_type === "admin" ?
                        <div onClick={() => {setConfig(config); activateModal(!active)}} className="float-btn pos-fixed d-flex a-center br-circle z-index-20">
                            <img className="trash" src={Trash} alt=""/>
                        </div>
                    :
                        null
                }
            </div>
            <MessageModal status="error" name="invalid-portfolio" message="Adicione pelo menos uma mídia para marcar evento como portfólio"/>
            <MessageModal status="error" name="invalid-upgrade" message="Adicione uma solicitação para atualizar status"/>
            <MessageModal status="error" name="invalid-pros" message="Adicione uma solicitação para atualizar profissionais"/>
            <MessageModal status="error" name="invalid-pros-upgrade" message="Adicione profissionais para atualizar o evento"/>
            <MessageModal status="success" name="event-update" message={"Evento atualizado com sucesso"}/>
        </Fragment>
    )
}

export default DetailsModal;