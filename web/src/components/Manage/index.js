import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';

//Contexts
import { UserContext } from '../../contexts/UserContext'

//Assets
import Placeholder from '../../assets/profile.png'
import Arrow from '../../assets/arrow-right.png'

//Client
import { getUsersBy, deleteUser, updateUser } from  '../client'

//Assets
import Plus from '../../assets/black-plus.png'

//Partials
import { parsedDate } from  '../partials'

//Components
import Create from './Create'

class Manage extends Component {
    static contextType = UserContext;

    render() {    
        const { userList, modalActive } = this.state
        const { path } = this.props.match
        const getLabel = path.includes("clientes") ? "Clientes" : path.includes("profissionais") ? "Profissionais" : "Administradores"

        return (
            <Fragment>
                <Fade cascade collapse duration={500}>
                    <div className='set-area overflow-y-scroll'>
                        {
                            (this.context.user.account_type === "admin" || this.context.user.account_type === "mentor")  && !path.includes('clientes') ? 
                                <Create path={path} active={{active: modalActive, setActive: this.activateModal}}/>
                            :
                                null
                        }
                        <div>
                            <div className="mar-t-26 mar-b-18 mar-h-20 d-flex a-between">
                                {
                                    this.context.user.account_type !== 'client' ? 
                                        <Fragment>
                                            <p className="c-black s-20 f-roboto">Gerenciar {getLabel}</p>
                                        {
                                            (this.context.user.account_type === "admin" || this.context.user.account_type === "mentor")  && !path.includes('clientes') ? 
                                                <img onClick={this.activateModal} className="clickable edit-close" src={Plus} alt=""/>
                                            :
                                                null
                                        }
                                        </Fragment>
                                    :
                                        null
                                }
                            </div>
                            {
                                this.state.isLoading ? 
                                    <div className="cw-max-area d-flex a-center">
                                        <div className="spinner mini"></div>
                                    </div>
                                :
                                    userList.map(({name, id, avatar_name, created_at, account_type, status, mentor_id}, index) => {
                                        const { fullDate, hoursString } = parsedDate(created_at)
                                        return (
                                            <div className="user-list-cell d-flex a-vertical a-between mar-h-12" key={id}>
                                                <Link to={`/perfil/${id}`} className="user-details d-flex a-vertical">
                                                    <img className="mar-12 br-circle" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt=""/>
                                                    <div>
                                                        <p className="c-black s-16 f-roboto w-bold">{name}</p>
                                                        <p className="c-black s-14 f-roboto mar-t-6">Cadastro em {fullDate} às {hoursString}</p>
                                                    </div>
                                                </Link>
                                                <div className="right-details d-flex a-vertical mar-r-12">
                                                    <div className="d-flex mar-r-10 a-vertical">
                                                        {
                                                            account_type !== 'client' ?
                                                                <Fragment>
                                                                    {
                                                                        account_type === "pro" ?
                                                                            status === "pending" && (this.context.user.account_type === "admin" || this.context.user.id === mentor_id) ?
                                                                                <Fragment>
                                                                                    <div onClick={() => this.changeStatus(id, "approved", index)} className="user-btn">Aprovar</div>
                                                                                    <div onClick={() => this.changeStatus(id, "rejected", index)} className="user-btn red">Rejeitar</div>
                                                                                </Fragment>
                                                                            :
                                                                                status === "pending" ? 
                                                                                    null
                                                                                : 
                                                                                    <p className="c-black s-14 f-roboto mar-t-6 mar-r-10">Usuário {status === "rejected" ? "Rejeitado" : "Aprovado"}</p>
                                                                        :
                                                                        null
                                                                    }
                                                                    {
                                                                        (id !== this.context.user.id && mentor_id === this.context.user.id) || (id !== this.context.user.id && this.context.user.account_type === "admin") ?
                                                                            <div onClick={() => this.removeUser(id)} className="user-btn">Excluir</div>
                                                                        :
                                                                            null
                                                                    }
                                                                </Fragment>
                                                            :
                                                                null
                                                        }
                                                    </div>
                                                    <img src={Arrow} alt=""/>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                </Fade>
            </Fragment>
        );
    }

    state = {
        userList: [],
        modalActive: false,
        isLoading: true
    }

    activateModal = () => this.setState({...this.state, modalActive: !this.state.modalActive})

    componentDidMount = () => {
        const { setLocation } = this.context

        setLocation(this.props.location.pathname)
        
        this.props.history.listen((loc) => {
            setLocation(loc.pathname)
        })

        const { user } = this.context
        const { path } = this.props.match
        const getType = path.includes("clientes") ? "client" : path.includes("profissionais") ? "pro" : "admin"

        getUsersBy(user.id, getType)
            .then((users) => this.setState({...this.state, userList: users, isLoading: false}))
            .catch(err => this.setState({...this.state, isLoading: false}))
    }

    removeUser = (id) => {
        const { user } = this.context

        deleteUser(user.id, id)
            .then(() => {
                let listCopy = [...this.state.userList]
                let filteredCopy = listCopy.filter((users) => users.id !== id)

                this.setState({...this.state, userList: filteredCopy})
            })
    }

    changeStatus = (id, setStatus, index) => {
        updateUser(id, { status: setStatus })
            .then(() => {
                let listCopy = [...this.state.userList]
                listCopy[index].status = setStatus

                this.setState({...this.state, userList: listCopy})
            })
    }
}

export default Manage;