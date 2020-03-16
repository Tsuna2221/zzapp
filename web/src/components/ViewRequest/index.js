import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';

//Client
import { getRequests } from  '../client'

//Contexts
import { UserContext } from  '../../contexts/UserContext'

//Components
import Details from './Details'

class ViewRequest extends Component {
    static contextType = UserContext;

    render() {
        const { requests, optionsVisible, status } = this.state
        const filteredRequests = requests.filter(({status}) => status === this.state.status )

        return (
            <Fade duration={400} delay={100}>
                <div className='set-area overflow-y-scroll ViewRequest'>
                    <Details route={this.props.history} update={this.updateRequest} request={this.state.currentRequest} active={{isActive: this.state.modalActivated, setActive: this.setModal}}/>
                    <div className="d-flex mar-h-20 mar-t-26 mar-b-18 a-between">
                        <p className="f-roboto c-black s-20 w-black">Solicitações</p>
                        <div className="d-flex fdir-column pos-relative no-select">
                            <div onClick={this.toggleSort} className="d-flex a-vertical clickable">
                                <span className="f-roboto c-black s-16 mar-r-8">{status === "pending" ? "Pendentes" : status === "accepted" ? "Aceitos" : "Rejeitados"}</span>
                                <span className="mdi mdi-sort-variant c-black s-20"></span>
                            </div>
                            <div className={`sorting d-flex fdir-column pos-absolute mar-t-40 txa-right ${optionsVisible ? "" : "no-opacity no-events"}`}>
                                <span onClick={() => this.changeStatus("pending").then(() => this.toggleSort())} className={`f-roboto c-white s-14 ${optionsVisible === "pending" ? "no-curson" : "clickable"}`}>Pendentes</span>
                                <span onClick={() => this.changeStatus("accepted").then(() => this.toggleSort())} className={`f-roboto c-white s-14 mar-t-10 ${optionsVisible === "accepted" ? "no-curson" : "clickable"}`}>Aceitos</span>
                                <span onClick={() => this.changeStatus("rejected").then(() => this.toggleSort())} className={`f-roboto c-white s-14 mar-t-10 ${optionsVisible === "rejected" ? "no-curson" : "clickable"}`}>Rejeitados</span>
                            </div>
                        </div>
                    </div>
                    <div className="mar-b-30">
                        {
                            filteredRequests.length > 0 ?
                                filteredRequests.map((request, index) => {
                                    const { client_email, client_name, type, duration, level, id, date, hour } = request

                                    return (
                                        <div key={id} onClick={() => this.setCurrent(request, index)} className="clickable bb d-flex fdir-column a-horizontal">
                                            <p className="c-black w-medium s-14 mar-v-6 f-roboto mar-l-20 d-flex">Tipo de evento: <span className="mar-l-4 w-regular">{type}</span></p>
                                            <p className="c-black w-medium s-14 mar-v-6 f-roboto mar-l-20 d-flex">Nível: <span className="mar-l-4 w-regular">{level}</span></p>
                                            <p className="c-black w-medium s-14 mar-v-6 f-roboto mar-l-20 d-flex">Duração: <span className="mar-l-4 w-regular">{duration} {duration === 1 ? "hora" : "horas"}</span></p>
                                            <p className="c-black w-medium s-14 mar-v-6 f-roboto mar-l-20 d-flex">Por: <span className="mar-l-4 w-regular">{client_name} {`<${client_email}>`}</span></p>
                                            <p className="c-black w-medium s-14 mar-v-6 f-roboto mar-l-20 d-flex">Data do evento: <span className="mar-l-4 w-regular">{date}, ás {hour}</span></p>
                                        </div>
                                    )
                                })
                            :
                                <div className="cw-100 d-flex a-center">
                                    <span className="c-black f-roboto s-16 pad-v-30">Nenhuma solicitação encontrada</span>
                                </div>
                        }
                    </div>
                </div>
            </Fade>
        );
    }

    state = {
        requests: [],
        currentRequest: {},
        modalActivated: false,
        status: "pending",
        optionsVisible: false
    }

    changeStatus = async (status) => this.setState({...this.state, status})

    toggleSort = () => this.setState({...this.state, optionsVisible: !this.state.optionsVisible})

    setCurrent = (req, index) => this.setState({...this.state, currentRequest: {...req, index}, modalActivated: !this.state.modalActivated})

    setModal = (req) => this.setState({...this.state, modalActivated: !this.state.modalActivated})

    componentDidMount = () => getRequests(this.context.user.id).then(requests => this.setState({requests}))

    updateRequest = (status) => {
        const requestsCopy = [...this.state.requests], current = {...this.state.currentRequest}
        requestsCopy[current.index].status = status
        current.status = status

        this.setState({...this.state, requests: requestsCopy, currentRequest: current})
    }
}

export default ViewRequest;