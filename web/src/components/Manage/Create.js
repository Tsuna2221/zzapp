import React, { Component } from 'react';
import MaskedInput from 'react-text-mask'

//Client
import { createUser } from  '../client'

//Assets
import Close from '../../assets/Close-Black.png'

//Contexts
import { UserContext } from '../../contexts/UserContext'

//Components 
import { MessageModal, activate } from '../etc/MessageModal'

class Create extends Component {
    static contextType = UserContext;

    render() {
        const {  active: { active, setActive }, path } = this.props
        const getLabel = path.includes("clientes") ? "Clientes" : path.includes("profissionais") ? "Profissional" : "Administrador"
        
        return (
            <div className={`set-area edit-modal z-index-150 ${active ? "" : "no-events no-opacity"}`}>
                <div onClick={this.saveChanges} className="user-btn pos-absolute edit-save-btn">Salvar</div>
                <div className="mar-t-26 mar-b-18 mar-h-50 d-flex a-between">
                    <p className="c-black s-20 f-roboto">Criar {getLabel}</p>
                    <img onClick={setActive} className="clickable edit-close" src={Close} alt=""/>
                </div>
                <form className="d-flex a-evenly mar-h-20 ch-inherit">
                    <div className="ch-100 d-flex a-vertical">
                        <div>
                            <div>
                                <div>
                                    <label className="c-black s-16 f-roboto mar-v-10">Nome</label>
                                </div>
                                <input onChange={this.handleInput} className="edit-input mar-b-18" name="name" type="text"/>
                            </div>
                            <div>
                                <div>
                                    <label className="c-black s-16 f-roboto mar-v-10">E-mail</label>
                                </div>
                                <input onChange={this.handleInput} className="edit-input mar-b-18" name="email" type="email"/>
                            </div>
                            <div>
                                <div>
                                    <label className="c-black s-16 f-roboto mar-v-10">Telefone</label>
                                </div>
                                <MaskedInput onChange={this.handleInput} mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} name="phone_number" className="edit-input mar-b-18" type="text"/>
                            </div>
                            <div>
                                <div>
                                    <label className="c-black s-16 f-roboto mar-v-10">Senha</label>
                                </div>
                                <input onChange={this.handleInput} className="edit-input mar-b-18" name="password" type="password"/>
                            </div>
                            <div>
                                <div>
                                    <label className="c-black s-16 f-roboto mar-v-10">Confirmar senha</label>
                                </div>
                                <input onChange={this.handleInput} className="edit-input mar-b-18" name="confirm_password" type="password"/>
                            </div>
                            {
                                path.includes("profissionais") ? 
                                    <div className="mentor-switch d-flex a-between a-vertical">
                                        <span className="c-black s-16 f-roboto mar-v-10">Este profissional é um mentor?</span>
                                        <div onClick={this.setMentor} className={`switch clickable d-flex br-circle ${this.state.isMentor ? "active" : "inactive"}`}>
                                            <div className="ball cw-50 br-circle"></div>
                                        </div>
                                    </div>
                                :
                                    null
                            }
                        </div>
                    </div>
                </form>
                <MessageModal status="error" name="create" message={this.state.modalText}/>
            </div>
        );
    }

    state = {
        modalText: "",
        isMentor: false
    }

    setMentor = () => this.setState({...this.state, isMentor: !this.state.isMentor})

    handleInput = ({target: { name, value }}) => {
        if(name === "phone_number"){
            this.setState({...this.state, [name]: value.replace(/[.()-\s_]/g, "")})
        }
        else{
            this.setState({...this.state, [name]: value})
        }
    }

    saveChanges = () => {
        const { name, email, password, confirm_password, phone_number, isMentor } = this.state
        const { path } = this.props
        const { id } = this.context.user
        const type = path.includes("clientes") ? "Clientes" : path.includes("profissionais") ? "mentor" : "admin"
        const getLabel = path.includes("clientes") ? "Clientes" : path.includes("profissionais") ? "profissionais" : "administradores"
        const checkAdmin = type === "admin" ? null : isMentor

        createUser(name, email, password, confirm_password, type, phone_number, null, null, null, null, id, checkAdmin )
            .then(() => window.location.href = `/gerenciar/${getLabel}`)
            .catch(({response: {data: {data: { msg }}}}) => {
                this.setState({...this.state, modalText: msg})
                activate('create')
            })
    }
}

export default Create;