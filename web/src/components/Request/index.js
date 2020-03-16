import React, { Component, Fragment } from 'react';
import Fade from 'react-reveal/Fade';
import MaskedInput from 'react-text-mask'

//Components
import Selector from './Selector'
import SelectSet from './SelectSet'
import Sets from './Sets'
import Check from './Check'
import AddObs from './AddObs'
import { MessageModal, activate } from '../etc/MessageModal'
import LoadingModal from '../Event/LoadingModal'

//Assets
import Plus from '../../assets/green-plus.png'

//Client
import { createRequest, getConfig, setRequest } from  '../client'

//Contexts
import { UserContext } from  '../../contexts/UserContext'

const typeOptions = [
    {label: "Aniversário", value: "aniversario"},
    {label: "Civil", value: "civil"},
    {label: "Corporativo", value: "corporativo"},
    {label: "Debutante", value: "debutante"},
    {label: "Casamento", value: "casamento"},
    {label: "Batizado", value: "batizado"},
    {label: "Ensaio", value: "ensaio"},
]
const levelOptions = [
    {label: "Iniciante", value: "iniciante"},
    {label: "Básico", value: "basico"},
    {label: "Intermediário", value: "intermediario"},
    {label: "Avançado", value: "avancado"},
]
const durationOptions = [
    {label: "1 hora", value: 1},
    {label: "2 horas", value: 2},
    {label: "3 horas", value: 3},
    {label: "4 horas", value: 4},
    {label: "5 horas", value: 5},
    {label: "6 horas", value: 6},
    {label: "7 horas", value: 7},
    {label: "8 horas", value: 8},
    {label: "9 horas", value: 9},
    {label: "10 horas", value: 10},
    {label: "11 horas", value: 11},
    {label: "12 horas", value: 12},
]

const resultOptions = [
    {label: "Kit Resultado", value: 'kit_resultado'},
    {label: "Pencard", value: 'pencard'},
    {label: "Apenas Online", value: 'online'},
]

class Request extends Component {
    static contextType = UserContext;

    render() {
        const { loading, config, date, hour } = this.state, { visible, eventId } = this.props

        return (
            <Fragment>
                <LoadingModal loading={{status: loading}}/>
                <Fade duration={400}>
                    <div className={`requests bg-white z-index-204 set-area d-flex fdir-column a-between ${eventId ? visible ? "" : "no-visibility" : ""}`}>
                        <AddObs updateObs={this.updateObs} index={this.state.obsSet} active={{active: this.state.obsModal, setActive: () => this.toggleModal()}}/>
                        <SelectSet type={this.state.selectedType.value} currentSelected={this.state.selectedSets} addToSetList={this.addToSetList} active={{activated: this.state.setModalActive, setActive: this.activateSet}}/>
                        <div className="overflow-y-scroll">
                            <Selector change={(state, value, label) => this.changeState(state, value, label).then(() => this.updateInclude())} current={this.state.selectedType} state="selectedType" label="Selecione o tipo do evento" options={typeOptions} />
                            <Selector change={this.changeState} current={this.state.selectedLevel} state="selectedLevel" label="Selecione o nível de profissionais" options={levelOptions} />
                            <Selector change={this.changeState} current={this.state.selectedDuration} state="selectedDuration" label="Informe a duração do evento" options={durationOptions} />
                            <Selector change={this.changeState} current={this.state.selectedResult} state="selectedResult" label="Informe a como deseja receber os dados" options={resultOptions} />
                            <div className='selector-container'>
                                <p className="c-black s-20 f-roboto mar-t-26 mar-b-12 mar-h-20">Data e hora do evento</p>
                                <div className="cell-container d-flex mar-h-20">
                                <div className="mar-r-14">
                                        <span className="c-black f-roboto s-16">Data: </span>
                                        <MaskedInput value={date} onChange={({target: { name, value }}) => this.setDate(name, value) } mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]} name="date" placeholder="DD/MM/AAAA" className="date-input f-lato" type="text"/>
                                    </div>
                                    <div>
                                        <span className="c-black f-roboto s-16">Hora: </span>
                                        <MaskedInput value={hour} onChange={({target: { name, value }}) => this.setDate(name, value) } mask={[/\d/, /\d/, ":", /\d/, /\d/]} name="hour" placeholder="HH:MM" className="date-input f-lato" type="text"/>
                                    </div>
                                </div>
                            </div>
                            <div className="sets-selection mar-b-40">
                                <div className="d-flex a-between a-vertical">
                                    <p className="c-black w-bold s-20 f-roboto mar-t-26 mar-b-12 mar-h-20">Serviços e Produtos</p>
                                    <img onClick={this.activateSet} className="green-plus mar-r-20 clickable" src={Plus} alt=""/>
                                </div>
                                    <Sets config={config} setClickedObs={this.setClickedObs} changeQty={this.changeQty} state={this.state} />
                            </div>
                        </div>
                        {
                            Object.keys(config).length ? 
                                <Check config={config} sendRequest={this.sendRequest} updatePrice={this.updatePrice} state={this.state}/>
                            :
                                null
                        }
                    </div>
                    <MessageModal status={this.state.status ? "success" : "error"} name="create_request" message={this.state.status ? "Solicitação enviada com sucesso!" : this.state.label}/>
                </Fade>
                <MessageModal status="error" name="event_update" message="Ocorreu um erro"/>
            </Fragment>
        );
    }

    state = {
        setModalActive: false,
        selectedType: { label: "Aniversário", value: "aniversario" },
        selectedLevel: { label: "Iniciante", value: "iniciante" },
        selectedDuration: { label: "1 hora", value: 1 },
        selectedResult: { label: "Kit Resultado", value: 'kit_resultado' },
        selectedSets: [],
        obsSet: 0,
        obsModal: false,
        hideCheck: false,
        date: "",
        hour: "",
        status: false,
        label: "",
        loading: true,
        config: {}
    }
    
    componentDidMount = () => {
        getConfig()
            .then(config => this.setState({...this.state, config}))
            .then(() => {
                if(this.props.currentRequest){
                    const { set, type, level, duration, date, hour, result } = this.props.currentRequest
                    return this.setState({
                        ...this.state,
                        loading: false,
                        selectedSets: set,
                        selectedType: typeOptions.filter(({label}) => label === type)[0],
                        selectedLevel: levelOptions.filter(({label}) => label === level)[0],
                        selectedDuration: durationOptions.filter(({value}) => value === duration)[0],
                        selectedResult: resultOptions.filter(({label}) => label === result)[0],
                        date, hour
                    })
                }
                return this.setState({...this.state, loading: false})
            })
    }


    sendRequest = (request) => {
        const { eventId, currentRequest } = this.props
        const { id } = this.context.user
        const { selectedType, selectedLevel, selectedDuration, selectedSets, selectedResult, date, hour } = this.state
        const { totalPrice, discount, discountedPrice } = request
        const current_date = new Date()
        const obj = {
            type: selectedType.label,
            duration: selectedDuration.value,
            level: selectedLevel.label,
            client_id: id,
            set: selectedSets,
            total: totalPrice,
            discount,
            total_outros: 0,
            total_servicos: 0,
            total_eventos: 0,
            date,
            hour,
            eventId,
            result: selectedResult.label,
        }
        
        const verify = async (current_year) => {
            let dateSplit = date.split('/')
            let hourSplit = hour.split(':')
            let day = parseInt(dateSplit[0]), month = parseInt(dateSplit[1]), year = parseInt(dateSplit[2])
            let hours = parseInt(hourSplit[0]), minutes = parseInt(hourSplit[1])

            if(month > 12 || year > 2099 || day > 31){
                this.setState({ ...this.state, status: false, label: "Data inválida" })
            }else if(month === 2 && day > 29){
                this.setState({ ...this.state, status: false, label: "Data inválida" })
            }else if(month === 6 && day > 30){
                this.setState({ ...this.state, status: false, label: "Data inválida" })
            }else if(month === 9 && day > 30){
                this.setState({ ...this.state, status: false, label: "Data inválida" })
            }else if(month === 11 && day > 30){
                this.setState({ ...this.state, status: false, label: "Data inválida" })
            }else if(hours > 23){
                this.setState({ ...this.state, status: false, label: "Hora inválida" })
            }else if(minutes > 59){
                this.setState({ ...this.state, status: false, label: "Hora inválida" })
            }else if(year < current_year.getFullYear()){
                this.setState({ ...this.state, status: false, label: "Data inválida" })
            }else if(date.includes("_")){
                this.setState({ ...this.state, status: false, label: "Data inválida" })
            }else if(hour.includes("_")){
                this.setState({ ...this.state, status: false, label: "Hora inválida" })
            }else{
                this.setState({ ...this.state, status: true })
            }
        }
        
        verify(current_date).then(() => {
            activate('create_request').then(() => {
                this.setState({...this.state, hideCheck: this.state.status, loading: true})
                setTimeout(() => {
                    if(this.state.status){
                        if(!currentRequest){
                            createRequest(obj).then(() => eventId ? window.location.reload() : this.props.history.push('/'))
                        }else{
                            setRequest({...obj, request_id: currentRequest.id}).then(() => window.location.href = '/evento/' + eventId)
                        }
                    }else{
                        activate('event_update')
                        this.setState({...this.state, loading: false})
                    }
                }, 2000)
            })
        })
    }

    setClickedObs = (index) => this.setState({...this.state, obsSet: index, obsModal: true})
    
    toggleModal = () => this.setState({...this.state, obsModal: !this.state.obsModal})

    updateObs = (text) => {
        const copy = [...this.state.selectedSets]
        copy[this.state.obsSet].obs = text

        this.setState({...this.state, set: copy, obsModal: false})
    }

    changeQty = (type, index) => {
        const copy = [...this.state.selectedSets]

        if(type === "add"){
            copy[index].qty = copy[index].qty + 1
        }else{
            copy[index].qty = copy[index].qty - 1
        }

        this.setState({...this.state, selectedSets: copy.filter(({qty}) => qty !== 0)})
    }

    setDate = (name, value) => this.setState({...this.state, [name]: value}) 

    updatePrice = (obj) => this.setState({...this.state, ...obj})

    activateSet = () => this.setState({...this.state, setModalActive: !this.state.setModalActive})

    changeState = async (state, value, label) => this.setState({...this.state, [state]: {value, label}}) 

    updateInclude = () => {
        const { selectedType, selectedLevel, selectedDuration, selectedSets, date, hour } = this.state
        var setsCopy = [...selectedSets]

        var normal = setsCopy.filter(({exc}) => exc.length === 0)
        var append = setsCopy.filter(({exc}) => exc.includes(selectedType.value))

        if(selectedType.value === "corporativo"){
            normal = setsCopy.filter(({except}) => !except)
        }
        
        normal.push(...append)

        this.setState({...this.state, selectedSets: normal}) 
    }

    addToSetList = (set) => {
        const setCopy = [...this.state.selectedSets]
        setCopy.push(set)
        
        this.setState({...this.state, selectedSets: setCopy, setModalActive: !this.state.setModalActive})
    }
}

export default Request;