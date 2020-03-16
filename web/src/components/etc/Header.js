import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom'

//Contexts
import { UserContext } from '../../contexts/UserContext'
import { EventContext } from '../../contexts/EventContext'

//Assets
import Placeholder from '../../assets/profile.png'
import Search from '../../assets/Search.png'

const Header = (props) => {
    const { fromEvent, visible } = props
    const { name, avatar_name, id } = useContext(UserContext).user
    const { path } = useContext(UserContext)
    const { setSearchFilter } = useContext(EventContext)

    return (
        <div className={`Header pos-fixed d-flex a-vertical a-between z-index-100 pad-h-26`}>
            <Link to={`/perfil/${id}`} className="d-flex a-vertical">
                <img className="header-avatar br-circle" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt="" />
                <span className="f-lato s-16 c-black mar-l-16">{name}</span>
            </Link>
            <div className="d-flex a-vertical">
                {
                    path === "/" ? 
                        <Fragment>
                            <img className="header-search mar-r-10" src={Search} alt=""/>
                            <input onBlur={(e) => e.target.value = ""} onChange={({target: { value }}) => setSearchFilter(value)} spellCheck={false} placeholder="Buscar" className="header-search-input no-outline f-lato s-16" type="text"/>
                        </Fragment>
                    :
                        null
                }
            </div>
        </div>
    )
}


export default Header;