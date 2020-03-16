import React, { useContext, useEffect, useState, Fragment } from 'react';
import Fade from 'react-reveal/Fade';

//Context
import { EventContext } from '../../contexts/EventContext'

//Components
import ImageModal from './ImageModal'
import DetailsModal from './DetailsModal'

//Assets
import Edit from '../../assets/Edit.png'
import Play from '../../assets/play.png'

const EventDetails = (props) => {
    const [eventId] = useState(parseInt(props.match.params.id))
    const { getEvent } = useContext(EventContext), event = getEvent(eventId)
    const [containerWidth, setContWidth] = useState()
    const [currentEvent, setEvent] = useState(getEvent(eventId))
    const [selectedImage, setSelected] = useState({id: 0, name: "", type: "", index: 0})
    const [modalActivated, activateModal] = useState(false)
    const [detailsActivated, activateDetails] = useState(false)
    const updateWidth = (main, item) => setContWidth(item * Math.trunc((main/ item)))

    const navImage = (dir) => {
        if(dir === "left"){
            let {id, name, type} = currentEvent.images[selectedImage.index - 1]

            setSelected({id, name, type, index: selectedImage.index - 1})
        }else{
            let {id, name, type} = currentEvent.images[selectedImage.index + 1]

            setSelected({id, name, type, index: selectedImage.index + 1})
        }
    }


    useEffect(() => {
        window.onresize = () => updateWidth()

        const mainWidth = document.querySelector('.main-container')
        const itemWidth = document.querySelector('.event-grid-item')

        setEvent(getEvent(eventId))

        if (mainWidth && itemWidth){
            updateWidth(mainWidth.offsetWidth, itemWidth.offsetWidth + 4)
        }
    });

    return (
        <div className='main-container d-flex fdir-column a-vertical'>
            <Fade cascade collapse duration={500}>
                <div style={{width: `${containerWidth}px`}} className='event-img-container d-flex fdir-row a-vertical mar-h-26'>
                    {
                        currentEvent ? 
                            currentEvent.images.length > 0 ?
                                currentEvent.images.sort((a, b) => b.id - a.id).map(({name, id, type}, index) => (
                                    <div onClick={() => {setSelected({id, name, type, index}); activateModal(!modalActivated)}} className="mar-2 clickable event-grid-item" key={id}>
                                        {
                                            type.includes('video') ? 
                                                <div className="d-flex a-center cw-100 ch-100">
                                                    <img className="pos-absolute play-img no-events" src={Play} alt=""/>
                                                    <img className="cover" src={`http://18.228.199.251:5000/static/thumb-${name}.jpg`} alt=""/>
                                                </div>
                                            :
                                                <img className="cover" src={`http://18.228.199.251:5000/static/thumb-${name}`} alt=""/>
                                        }
                                    </div>
                                ))
                            :
                                <div className="cw-100 d-flex a-center">
                                    <span className="c-black f-roboto s-16 pad-v-30">Nenhuma mídia encontrada</span>
                                </div>
                        :
                            null
                    }
                </div>
            </Fade>
            <ImageModal navImage={navImage} list={currentEvent ? currentEvent.images : []} event={currentEvent} active={{modalActivated, activateModal}} image={selectedImage}/>
            {
                currentEvent ? 
                    currentEvent.current_status !== "portfolio" ?
                        <Fragment>
                            <div onClick={() => activateDetails(!detailsActivated)} className={`float-btn pos-fixed d-flex a-center br-circle z-index-200 ${modalActivated ? "no-opacity" : ""} ${detailsActivated ? 'no-events no-opacity': ''}`}>
                                <img className="edit" src={Edit} alt=""/>
                            </div>
                            <DetailsModal history={props.history} activate={{detailsActivated, activateDetails}} event={currentEvent}/>
                        </Fragment>
                    :
                        null
                :
                    null
            }
        </div>
    )
}

export default EventDetails;