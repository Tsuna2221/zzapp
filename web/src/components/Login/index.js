import React, { Fragment, useState, useContext } from 'react';
import Cookies from 'js-cookie'
import MaskedInput from 'react-text-mask'

//Client
import { validateUser, loginUser, getEvents, createUser, getUsersBy, sendPassRequest, verifyRequest, resetPassword } from '../client'

//Components 
import { MessageModal, activate } from '../etc/MessageModal'
import MentorList from './MentorList'
import ServiceList from './ServiceList'

//Contexts
import { UserContext } from '../../contexts/UserContext'

//Assets
import Placeholder from '../../assets/profile.png'
import Logo from '../../assets/Logo.png'

const Login = ({history}) => {
    const { setUser, setEvents } = useContext(UserContext)
    const [form, setForm] = useState('')
    const [modalActivated, setModal] = useState(false)
    const [mentorActivated, setMentor] = useState(false)
    const [servicesActivated, setServices] = useState(false)
    const [serviceList, setList] = useState([])
    const [mModalText, setModalText] = useState('')
    const [mentorList, setMentorList] = useState([])
    const [input, setInput] = useState({})
    
    const reset = {email: "", password: "", phone_number: "", confirm_password: "", cpf: "", rg: "", portfolio: ""}
    const [resetHash, setHash] = useState('')
    const updateInput = (name, value, modalState) => {
        const copy = {...input}
        copy[name] = value

        setInput(copy)
        if(modalState){
            setMentor(!mentorActivated)
        }
    }
    
    const handleInput = ({target: { name, value }}) => {
        if(name === "rg" || name === "cpf" || name === "phone_number"){
            updateInput(name, value.replace(/[.()-\s_]/g, ""))
        }else{
            updateInput(name, value)
        }
    }

    const validUser = () => {
        validateUser(input.email, input.password).then(({token}) => {
            loginUser(token)
            .then((user) => getEvents(user.id, token)
                .then(events => {
                    setUser(user)
                    setEvents(events)

                    Cookies.set('token', token)
                    return window.location.href = "/"
                })
            )
        }).catch(({response}) => {
            setModalText(response ? response.data.data.msg : "Ocorreu um erro")
            activate('login')
        })
    }

    const registerUser = () => {
        createUser(
            input.name,
            input.email,
            input.password,
            input.confirm_password,
            form,
            input.phone_number,
            input.portfolio,
            input.cpf,
            input.rg,
            input.mentor_id,
            null,
            null,
            JSON.stringify(serviceList)
        )
        .then(() => validUser())
        .catch(({response: { data: { data: { msg } }}}) => {
            setModalText(msg)
            activate('login')
        })
    }

    const getMentorList = () => getUsersBy('new', 'mentor').then(list => setMentorList(list)).then(() => setMentor(!mentorActivated))

    const selectedMentor = mentorList.filter(({id}) => id === input.mentor_id)[0]

    const sendRequest = () => sendPassRequest(input.email)
        .then(({hash}) => {
            setHash(hash)
            return setForm('validate')
        })
        .catch(({response: { data: { data: { msg } }}}) => {
            setModalText(msg)
            activate('login')
        })

    const validateCode = () => verifyRequest(input.email, input.code, resetHash)
        .then(() => {
            setForm('reset')
        })
        .catch(({response: { data: { data: { msg } }}}) => {
            setModalText(msg)
            activate('login')
        })

    const resetPass = () => resetPassword(input.email, input.password, input.confirm_password)
        .then(() => {
            setModalText("Senha redefinida com sucesso")
            activate('login')
            setInput(reset)
            setForm('')
        })
        .catch(({response: { data: { data: { msg } }}}) => {
            setModalText(msg)
            activate('login')
        })

    const serviceLabel = (value) => {
        var label = ""
        
        switch (value) {
            case 'cinegrafistas':
                label = "Cinegrafista"
                break;
            case 'fotografos':
                label = "Fotógrafo"
                break;
            case 'video_edicao':
                label = "Edição de Vídeo"
                break;
            case 'tratamento_fotos':
                label = "Tratamento de Fotos"
                break;
            case 'diagramacao_album':
                label = "Diagramação de Álbum"
                break;
        }

        return label
    }
    
    return (
        <Fragment>
            <div className={`form-type-modal d-flex a-center pos-fixed cw-100 ch-100 ${modalActivated ? "" : "no-opacity no-events"}`}>
                <div className="d-flex fdir-column a-vertical">
                    <p className="txa-center f-lato s-34 c-white">Qual o seu perfil?</p>
                    <div className="d-flex mar-t-40">
                        <div onClick={() => {setForm('client'); setModal(!modalActivated)}} className="confirm txa-center log w-medium cw-fit s-14 c-orange clickable mar-r-10">Cliente</div>
                        <div onClick={() => {setForm('pro'); setModal(!modalActivated)}} className="confirm txa-center log w-medium cw-fit s-14 c-orange clickable">Profissional</div>
                    </div>
                </div>
            </div>
            <ServiceList serviceActivated={servicesActivated} closeModal={() => setServices(false)} update={(item) => {setList(item); setServices(false);}}/>
            <MentorList updateInput={updateInput} mentorActivated={mentorActivated} getMentorList={getMentorList} mentorList={mentorList} />
            {
                form === "client" ?
                    <div className="log-form-container d-flex">
                        <img src={Logo} alt=""/>
                        <form className="d-flex fdir-column">
                            <input onChange={handleInput} value={input.name} name="name" placeholder="Nome completo" className="text-box mar-t-40" type="text"/>
                            <input onChange={handleInput} value={input.email} name="email" placeholder="E-mail" className="text-box mar-t-12" type="email"/>
                            <MaskedInput onChange={handleInput} value={input.phone_number} mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} name="phone_number" placeholder="Telefone" className="text-box mar-t-12" type="text"/>
                            <input onChange={handleInput} value={input.password} name="password" placeholder="Senha" className="text-box mar-t-12" type="password"/>
                            <input onChange={handleInput} value={input.confirm_password} name="confirm_password" placeholder="Confirme sua senha" className="text-box mar-t-12" type="password"/>
                        </form>
                        <div onClick={registerUser} className="btn mar-t-12">Criar conta</div>
                        <div onClick={() => {setForm(''); setInput(reset)}} className="btn gray mar-t-10">Eu já tenho uma conta</div>
                    </div>
                :
                    form === "pro" ? 
                        <div className="log-form-container d-flex">
                            <img src={Logo} alt=""/>
                            <form className="d-flex fdir-column">
                                <div className="d-flex a-vertical">
                                    <input onChange={handleInput} value={input.name} name="name" placeholder="Nome completo" className="text-box mar-r-10 mar-t-12 medium" type="text"/>
                                    <input onChange={handleInput} value={input.email} name="email" placeholder="E-mail" className="text-box mar-t-12 medium" type="email"/>
                                </div>
                                <div className="d-flex a-vertical">
                                    <input onChange={handleInput} value={input.password} name="password" placeholder="Senha" className="text-box mar-r-10 mar-t-12 medium" type="password"/>
                                    <input onChange={handleInput} value={input.confirm_password} name="confirm_password" placeholder="Confirme sua senha" className="text-box mar-t-12 medium" type="password"/>
                                </div>
                                <div className="d-flex a-vertical">
                                    <MaskedInput onChange={handleInput} value={input.phone_number} mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} name="phone_number" placeholder="Telefone" className="text-box mar-r-10 mar-t-12 medium" type="text"/>
                                    <input onChange={handleInput} value={input.portfolio} name="portfolio" placeholder="Link do seu portfólio (opcional)" className="text-box mar-t-12 medium" type="text"/>
                                </div>
                                <div className="d-flex a-vertical">
                                    <MaskedInput value={input.cpf} mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]} onChange={handleInput} name="cpf" placeholder="CPF (opcional)" className="text-box mar-r-10 mar-t-12 medium" type="text"/>
                                    <MaskedInput value={input.rg} mask={[/\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /[0-9xX]/]} onChange={handleInput} name="rg*" placeholder="RG (opcional)" className="text-box mar-t-12 medium" type="text"/>
                                </div>
                            </form>
                            <div onClick={() => getMentorList()} className={`clickable mar-v-8 bb cw-100 ${input.mentor_id ? "pad-v-6" : "pad-v-12"}`}>
                                {
                                    !input.mentor_id ? 
                                        <p className="c-black s-14 f-lato mar-l-10">Selecione um mentor</p>
                                    :
                                        <div className="d-flex a-vertical">
                                            <img className="mentor-selected-avatar br-circle mar-h-8" src={selectedMentor.avatar_name ? `http://18.228.199.251:5000/static/${selectedMentor.avatar_name}?${Math.random()}` : Placeholder} alt=""/>
                                            <span className="c-black s-14 f-lato w-bold">{selectedMentor.name}</span>
                                        </div>
                                }
                            </div>
                            <div onClick={() => setServices(true)} className={`clickable mar-v-8 bb cw-100 pad-v-12`}>
                                {
                                    serviceList.length > 0 ? 
                                        <div className="mar-h-8">
                                            <p className="c-black s-14 f-lato mar-v-6">Selecionado: </p>
                                            {
                                                serviceList.map((item, index) => {
                                                    return (
                                                        <p className="c-black s-14 f-lato w-bold mar-v-2">{serviceLabel(item)}{index !== serviceList.length - 1 ? ", " : ""}</p>
                                                    )
                                                }) 
                                            }
                                        </div>
                                    :
                                        <p className="c-black s-14 f-lato mar-l-10">Serviços à oferecer</p>
                                }
                            </div>
                            <div className="d-flex a-vertical mar-v-10">
                                <div onClick={() => {setForm(''); setInput(reset)}} className="btn medium gray mar-r-10">Eu já tenho uma conta</div>
                                <div onClick={registerUser} className="btn medium">Criar conta</div>
                            </div>
                        </div>
                    :
                        form === "forgot" ?
                            <div className="log-form-container d-flex">
                                <img src={Logo} alt=""/>
                                <form className="d-flex fdir-column">
                                    <p className="f-lato c-light w-bold s-13 mar-t-30">
                                        Informe o e-mail da sua conta, nós iremos enviar um código de redefinição de senha
                                    </p>
                                    <input value={input.email} onChange={handleInput} name="email" placeholder="E-mail" className="text-box mar-t-20" type="email"/>
                                </form>
                                <div onClick={sendRequest} className="btn mar-t-12">Recuperar Senha</div>
                                <div onClick={() => {setForm('')}} className="btn gray mar-t-30">Eu lembrei minha senha</div>
                            </div>
                        :
                            form === "validate" ?
                                <div className="log-form-container d-flex">
                                    <img src={Logo} alt=""/>
                                    <form autoComplete="off" className="d-flex fdir-column">
                                        <p onClick={() => setForm("forgot")} className="f-lato c-light w-bold s-13 mar-t-30">
                                            Insira o código de verificação enviado ao seu e-mail
                                        </p>
                                        <input autoComplete="off" maxLength={6} value={input.code} onChange={handleInput} name="code" placeholder="Código de Verificação" className="text-box mar-t-20" type="text"/>
                                    </form>
                                    <div onClick={validateCode} className="btn mar-t-12">Recuperar Senha</div>
                                </div>
                            :
                                form === "reset" ?
                                    <div className="log-form-container d-flex">
                                        <img src={Logo} alt=""/>
                                        <form className="d-flex fdir-column">
                                            <input value={input.password} onChange={handleInput} name="password" placeholder="Nova senha" className="text-box mar-t-12" type="password"/>
                                            <input value={input.confirm_password} onChange={handleInput} name="confirm_password" placeholder="Confirme a nova senha" className="text-box mar-t-12" type="password"/>
                                        </form>
                                        <div onClick={() => resetPass()} className="btn mar-t-12">Redefinir Senha</div>
                                    </div>
                                :
                                    <div className="log-form-container d-flex">
                                        <img src={Logo} alt=""/>
                                        <form className="d-flex fdir-column">
                                            <input value={input.email} onChange={handleInput} name="email" placeholder="E-mail" className="text-box mar-t-40" type="email"/>
                                            <input value={input.password} onChange={handleInput} name="password" placeholder="Senha" className="text-box mar-t-12" type="password"/>
                                        </form>
                                        <div onClick={validUser} className="btn mar-t-12">Entrar</div>
                                        <p onClick={() => {setForm("forgot"); setInput(reset)}} className="f-lato c-light w-bold s-13 mar-t-12 clickable">Esqueceu sua senha?</p>
                                        <div onClick={() => {setModal(!modalActivated); setInput(reset)}} className="btn gray mar-t-30">Eu ainda não tenho uma conta</div>
                                    </div>
            }
            <MessageModal status={`${mModalText === "Senha redefinida com sucesso" ? "success" : "error"}`} name="login" message={mModalText}/>
        </Fragment>
    )
}

export default Login;