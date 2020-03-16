import React, { useContext } from 'react';
import { Link } from 'react-router-dom'

//Assets
import Placeholder from '../../assets/profile.png'
import CloseFill from '../../assets/close-fill.png'

//Client
import { updateEvent } from '../client'

//Contexts
import { EventContext } from '../../contexts/EventContext'

const UserScroller = ({label, users, eventId, userType}) => {
    const { updateRelated } = useContext(EventContext)
    const removeUser = (id) => {
        const list = users.map(({id}) => id)
        const filtered = list.filter((user_id) => user_id !== id)

        updateEvent(eventId, {[label === "Profissionais" ? 'related_pros' : 'related_clients']: filtered})
            .then((userList) => updateRelated(eventId, label === "Profissionais" ? 'pro' : 'client', userList))
    }

    return (
        <div className='UserScroller'>
            <span className="c-white s-20 f-roboto mar-l-20 w-medium">{label}</span>
            <div className="d-flex fdir-row cw-100">
                {
                    users.map(({name, id, avatar_name}) => (
                        <div key={id} className="scroller-item-container pos-relative mar-t-22 mar-b-30 mar-h-8 clickable d-flex fdir-column a-center"> 
                            {
                                userType === "admin" ?
                                    <img onClick={() => removeUser(id)} className="remove pos-absolute clickable" src={CloseFill} alt=""/>
                                :
                                    null
                            }
                            <Link className="d-flex fdir-column a-center" to={`/perfil/${id}`}>
                                <img className="br-circle" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt=""/>
                                <p className="f-lato s-14 c-white mar-t-8">{name}</p>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default UserScroller;