import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

//Context
import { UserContext } from '../../contexts/UserContext'

//Assets
import Logo from '../../assets/Logo.png'
import Arrow from '../../assets/Arrow.png'

const Sidebar = ({type}) => {
    const { path } = useContext(UserContext)

    return (
        <div className='Sidebar ch-fill'>
            <div className="side-container ch-fill pos-fixed">
                <div className="a-horizontal d-flex">
                    <img className="mar-v-40" src={Logo} alt=""/>
                </div>
    
                <Link name="gerenciamento" className={`category f-lato s-16 tc-orange`}>
                    Eventos
                </Link>
                <div className="dropdown-items">
                    <ul>
                        <Link to="/"><li className={`f-lato s-14 c-light2 ${path ? path === "/" ? "c-orange" : "tc-orange" : "tc-orange" } mar-v-14`}>Eventos</li></Link>
                        <Link to="/portfolio"><li className={`f-lato s-14 c-light2 ${path ? path === "/portfolio" ? "c-orange" : "tc-orange" : "tc-orange" } mar-v-14`}>Portfólios</li></Link>
                    </ul>
                </div>

                {
                    type === "admin" || type === "mentor" ?
                        <Link name="gerenciamento" className={`category f-lato s-16 tc-orange`}>
                            Gerenciamento
                        </Link>
                    :
                        null
                }
                {
                    type === "admin" || type === "mentor" ? 
                        <div className="dropdown-items">
                            <ul>
                                    <Fragment>
                                        <Link to="/gerenciar/valores"><li className={`f-lato s-14 c-light2 tc-orange mar-v-14`}>Constantes</li></Link>
                                        <Link to="/gerenciar/clientes"><li className={`f-lato s-14 c-light2 tc-orange mar-v-14`}>Clientes</li></Link>
                                        <Link to="/gerenciar/profissionais"><li className={`f-lato s-14 c-light2 tc-orange mar-v-14`}>Profissionais</li></Link>
                                    </Fragment>
                                {
                                    type === "admin" ? 
                                        <Fragment>
                                            <Link to="/gerenciar/administradores"><li className={`f-lato s-14 c-light2 tc-orange mar-v-14`}>Administradores</li></Link>
                                        </Fragment>
                                    :
                                        null
                                }
                            </ul>
                        </div>
                    :
                        null
                }

                {
                    type === 'client' ? 
                        <Link to="/orcamento" name="solicitacao" className={`category no-bottom f-lato s-16 tc-orange`}>{type === "client" ? "Solicitar cobertura de evento" : "Solicitações"}</Link>
                    :
                        null
                }
                <a onClick={() => Cookies.remove('token')} href="/login" name="gerenciamento" className={`category f-lato s-16 tc-orange`}>
                    Sair
                </a>
            </div>
        </div>
    )
}

export default Sidebar;