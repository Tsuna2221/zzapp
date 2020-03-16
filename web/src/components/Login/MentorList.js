import React, { useState } from 'react';

//Assets
import Close from '../../assets/Close.png'

//Assets
import Placeholder from '../../assets/profile.png'

const MentorList = ({mentorActivated, getMentorList, mentorList, updateInput}) => {
    const [input, setInput] = useState("")
    const list = mentorList.filter(({name}) => name.toLowerCase().includes(input.toLowerCase()))
    return (
        <div className={`log-form-container ch-75 mentor-select z-index-100 ${mentorActivated ? "" : "no-opacity no-events"}`}>
            <div className="d-flex a-between a-vertical cw-fill mar-t-30 mar-h-20">
                <p className="c-white s-18 w-medium f-roboto">Buscar usuário</p>
                <img onClick={getMentorList} className="mentor-modal-close clickable" src={Close} alt=""/>
            </div>
            <input value={input} onChange={({target: { value }}) => setInput(value)} className="c-black no-outline mar-t-12 mar-h-20 pad-14 cw-fill" type="text"/>
            <div className="mentor-list-s mar-t-20 overflow-y-scroll ch-inherit">
                {
                    list.map(({name, avatar_name, id}) => (
                         <div onClick={() => updateInput('mentor_id', id, true)} className="clickable d-flex bb white pad-v-6 mar-h-16">
                            <img className="mentor-avatar br-circle" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt=""/>
                            <p className="pad-v-20 mar-h-14 c-white s-14 f-roboto">{name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default MentorList;