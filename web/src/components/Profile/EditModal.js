import React, { Component, Fragment } from 'react';
import MaskedInput from 'react-text-mask'

//Client
import { updateUser } from  '../client'

//Assets
import Close from '../../assets/Close-Black.png'

//Contexts
import { UserContext } from '../../contexts/UserContext'

//Components 
import { MessageModal, activate } from '../etc/MessageModal'

class EditModal extends Component {
    static contextType = UserContext;

    render() {
        const { active } = this.props.active
        const { account_type, id, status, mentor_id } = this.state.user
        const list = [
            {label:"Cinegrafista", value: "cinegrafistas"},
            {label:"Fotógrafo", value: "fotografos"},
            {label:"Edição de Vídeo", value: "video_edicao"},
            {label:"Tratamento de Fotos", value: "tratamento_fotos"},
            {label:"Diagramação de Álbum", value: "diagramacao_album"},
        ]

        return (
            <div className={`set-area overflow-y-scroll edit-modal z-index-150 ${active ? "" : "no-events no-opacity"}`}>
                <div onClick={() => this.saveChanges()} className="user-btn pos-fixed edit-save-btn">Salvar</div>
                <div className="mar-t-26 mar-b-18 mar-h-50 d-flex a-between">
                    <p className="c-black s-20 f-roboto">Editar Perfil</p>
                    <img onClick={this.props.active.setActive} className="clickable edit-close" src={Close} alt=""/>
                </div>
                <form className="d-flex a-evenly mar-h-20 ch-inherit">
                    <div className="ch-100 d-flex a-vertical">
                        <div>
                            {this.drawInput('Nome', 'name')}
                            {this.drawInput('E-mail', 'email')}
                            {
                                id === this.context.user.id && account_type !== "client" ?
                                    <Fragment>
                                        {this.drawInput('Telefone', 'phone_number')}
                                        {this.drawInput('Link do seu portfolio', 'portfolio')}
                                        {this.drawInput('CPF', 'cpf')}
                                        {this.drawInput('RG', 'rg')}
                                    </Fragment>
                                :
                                    null
                            }
                            {
                                (this.context.user.account_type === "admin" || this.context.user.id === id || this.context.user.id === mentor_id) && (account_type === "pro" || account_type === "mentor") ? 
                                    <div className="mar-b-20">
                                        <span className="c-black s-16 f-roboto mar-v-10">Serviços</span>
                                        <div>
                                            {
                                                list.map(({label, value}, index) => (
                                                    <div onClick={() => this.handleCheck(value)}>
                                                        <p className={`s-14 c-black pad-12 f-roboto clickable service-border ${this.state.list.includes(value) ? "selected" : ""} ${index === list.length - 1 ? "last" : ""}`}>{label}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                :
                                    null
                            }
                            {
                                this.context.user.account_type === "admin" && (account_type === "pro" || account_type === "mentor") ? 
                                    status === "approved" ? 
                                        <div className="mentor-switch mar-b-20 d-flex a-between a-vertical">
                                            <span className="c-black s-16 f-roboto mar-v-10">Mentor</span>
                                            <div onClick={this.setMentor} className={`switch clickable d-flex br-circle ${this.state.user.account_type === "mentor" ? "active" : "inactive"}`}>
                                                <div className="ball cw-50 br-circle"></div>
                                            </div>
                                        </div>
                                    :
                                        null
                                :
                                    null
                            }
                        </div>
                    </div>
                    {
                        account_type !== "client" ?
                            <div className="pad-b-20">
                                {this.drawSelection()}
                            </div>
                        :
                            null
                    }
                </form>
                <MessageModal status='error' name="edit" message={this.state.modalText}/>
            </div>
        );
    }

    state = {
        user: this.props.user,
        modalText: "",
        list: JSON.parse(this.props.user.services || "[]")
    }

    handleCheck = (name) => {
        let checked = [...this.state.list]

        if(checked.includes(name)){
            checked = checked.filter((item) => item !== name)
        }else{
            checked.push(name)
        }

        this.setState({...this.state, list: checked})
    }

    setMentor = () => {
        const copy = {...this.state.user}
        copy.account_type = copy.account_type === "mentor" ? "pro" : "mentor"

        this.setState({...this.state, user: copy})
    }

    drawSelection = () => {
        const { events } = this.state.user.ratings
        const state = ['birthday', 'civil', 'baptism', 'essay', 'wedding', 'corp', 'debut']

        return (
            events.map(({rating, label}, index) => (
                <div>
                    <div>
                        <label className="c-black s-16 f-roboto mar-v-10" htmlFor={state[index]}>{label}</label>
                    </div>
                    <select onChange={({target: { value }}) => this.editSelection(index, value)} className="edit-input low" value={rating} name={state[index]} id={state[index]}>
                        <option value={1}>Amador</option>
                        <option value={2}>Iniciante</option>
                        <option value={3}>Intermediário</option>
                        <option value={4}>Avançado</option>      
                    </select>
                </div>
            ))
        )
    }

    drawInput = (label, state) => {
        const { user } = this.state

        if(state === "phone_number"){
            return(
                <div>
                    <div>
                        <label className="c-black s-16 f-roboto mar-v-6" htmlFor={state}>{label}</label>
                    </div>
                    <MaskedInput onChange={({target: { name, value }}) => this.editProfile(name, value)} mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} value={user[state]} name={state} className="edit-input mar-b-18" type="text"/>
                </div>
            )
        }else if(state === "cpf"){
            return(
                <div>
                    <div>
                        <label className="c-black s-16 f-roboto mar-v-6" htmlFor={state}>{label}</label>
                    </div>
                    <MaskedInput onChange={({target: { name, value }}) => this.editProfile(name, value)} mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]} value={user[state]} name={state} className="edit-input mar-b-18" type="text"/>
                </div>
            )
        }else if(state === "rg"){
            return(
                <div>
                    <div>
                        <label className="c-black s-16 f-roboto mar-v-6" htmlFor={state}>{label}</label>
                    </div>
                    <MaskedInput onChange={({target: { name, value }}) => this.editProfile(name, value)} mask={[/\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /[0-9xX]/]} value={user[state]} name={state} className="edit-input mar-b-18" type="text"/>
                </div>
            )
        }else{
            return (
                <div>
                    <div>
                        <label className="c-black s-16 f-roboto mar-v-6" htmlFor={state}>{label}</label>
                    </div>
                    <input className="edit-input mar-b-18" onChange={({target: { name, value }}) => this.editProfile(name, value)} value={user[state]} name={state} type="text"/>
                </div>
            )
        }
    }

    editSelection = (index, value) => {
        let copy = {...this.state.user}
        copy.ratings.events[index].rating = value

        this.setState({user: copy})
    } 

    editProfile = (name, value) => {
        let copy = {...this.state.user}
        copy[name] = value

        this.setState({user: copy})
    }

    saveChanges = () => {
        const { name, phone_number, email, account_type, portfolio, cpf, rg, ratings: { events } } = this.state.user
        const parsedNumber = phone_number ? phone_number.replace(/[.()-\s_]/g, "") : null
        
        updateUser(this.state.user.id, {
            name, phone_number: parsedNumber,
            portfolio, 
            account_type,
            email,
            cpf: cpf.replace(/[.()-\s_]/g, ""),
            rg: rg.replace(/[.()-\s_]/g, ""), 
            birthday: events[0].rating,
            civil: events[1].rating, 
            baptism: events[2].rating, 
            essay: events[3].rating, 
            wedding: events[4].rating,
            corp: events[5].rating, 
            debut: events[6].rating,
            services: JSON.stringify(this.state.list)
        }).then((res) => {
            if(this.state.user.id === this.context.user.id){
                this.context.setUser(res)
            }
        })
        .then(() => this.props.active.setActive())
        .catch(({response: {data: {data: { msg }}}}) => {
            this.setState({...this.state, modalText: msg})
            activate('edit')
        })
    }
}

export default EditModal;