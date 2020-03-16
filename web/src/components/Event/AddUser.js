import React, { useContext, useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';

//Components
import { MessageModal, activate } from '../etc/MessageModal'

//Assets
import Close from '../../assets/Close-Black.png'
import Arrow from '../../assets/arrow-right.png'
import Placeholder from '../../assets/profile.png'

//Contexts
import { EventContext } from '../../contexts/EventContext'
import { UserContext } from '../../contexts/UserContext'

//Client
import { updateEvent, getUsersBy } from '../client'

const AddUser = ({eventId, setUserType, awaitingClient, type, related: { clients, pros }, activate: { userAddActivated, activateUser }}) => {
    const { updateRelated } = useContext(EventContext)
    const { user } = useContext(UserContext)
    const list = type === "pro" ? pros : clients
    const [users, setUsers] = useState([])
    const [update, setUpdate] = useState(false)

    let filteredView = users.filter(({id}) => !list.map(({id}) => id).includes(id))
    if(type === "pro") filteredView = filteredView.filter(({status, account_type}) => account_type === "pro" ? status === "approved" : true)

    useEffect(() => {
        if(!update){
            getUsersBy(user.id, type).then((res) => {setUsers(res); setUpdate(true)})
        }
    })

    const addUser = (id) => {
        const idArray = list.map(({id}) => id)
        idArray.push(id)

        updateEvent(eventId, {[type === "pro" ? 'related_pros' : 'related_clients']: [...new Set(idArray)]})
            .then((userList) => updateRelated(eventId, type, userList))
            .then(() => activateUser(!userAddActivated))
            .then(() => setUserType("client"))
    }

    const closeModal = () => {
        activateUser(false)
        setUserType("client")
    }

    return (
        <Fade duration={200}>
            <div className={`AddUser set-area z-index-100 ${userAddActivated ? "active" : "inactive"}`}>
                <div className="top d-flex a-vertical a-between pad-16">
                    <span className="c-black s-20 f-roboto">Adicionar {type === 'pro' ? "Profissional" : "Cliente"}</span>
                    <img className="clickable" onClick={() => awaitingClient ? activate("select-user") : closeModal()} src={Close} alt=""/>
                </div>
                <ul>
                    {
                        filteredView.length > 0 ?
                            filteredView.map(({name, avatar_name, id}) => {
                                return (
                                    <li onClick={() => addUser(id)} key={id} className="user-item d-flex a-center a-between clickable mar-h-10">
                                        <div className="cell d-flex a-vertical cw-100 pad-h-20">
                                            <img className="br-circle mar-v-10" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt=""/>
                                            <span className="c-black s-14 f-roboto mar-l-14">{name}</span>
                                        </div>
                                        <img src={Arrow} alt=""/>
                                    </li>
                                )
                            })
                        :
                            <div className="cw-100 d-flex a-center">
                                <span className="c-black f-roboto s-16 pad-v-30">Nenhum usuário disponível</span>
                            </div>
                    }
                </ul>
            <MessageModal status="error" name="select-user" message="Pelo menos um cliente deve ser adicionado ao evento"/>
            </div>
        </Fade>
    )
}

export default AddUser;