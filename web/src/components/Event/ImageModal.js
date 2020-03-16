import React, { useContext } from 'react'

//Assets
import Close from '../../assets/Close.png'
import Trash from '../../assets/Trash-Red.png'

//Client
import { deleteEventData } from '../client'

//Contexts
import { UserContext } from '../../contexts/UserContext'
import { EventContext } from '../../contexts/EventContext'

const ImageModal = ({image: {id, name, type}, image, navImage, list, event, active: {modalActivated, activateModal}}) => {
    const { user } = useContext(UserContext)
    const { removeMediaFrom } = useContext(EventContext)

    const removeMedia = () => deleteEventData(user.id, id).then(() => {
        return removeMediaFrom(event.id, id).then(() => activateModal(!modalActivated))
    })
    
    return (
        <div className={`image-modal d-flex pos-fixed cw-100 z-index-203 ch-100 a-center ${modalActivated ? "active" : "inactive"}`}>
            {
                image.index !== 0 ?
                    <span onClick={() => navImage('left')} className={`mdi mdi-chevron-left z-index-204 c-white s-36 pad-10 clickable arrow left`}></span>
                :
                    null
            }
            {
                image.index !== list.length - 1 ?
                    <span onClick={() => navImage('right')} className={`mdi mdi-chevron-right z-index-204 c-white s-36 pad-10 clickable arrow right`}></span>
                :
                    null
            }

            <img onClick={() => activateModal(!modalActivated)} className="float-image-btn pos-absolute" src={Close} alt=""/>
            <img onClick={removeMedia} className="float-image-btn trash pos-absolute" src={Trash} alt=""/>
            {
                id !== 0 ?
                    type.includes('video') ?
                        <video loop autoPlay controls className="image no-outline" src={`${modalActivated ? `http://18.228.199.251:5000/static/${name}` : null}`} alt=""/>
                    :
                        <img className="image" src={`${modalActivated ? `http://18.228.199.251:5000/static/${name}` : null}`} alt=""/>
                :
                    null
            }
        </div>
    )
}

export default ImageModal;