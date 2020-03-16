import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Styles
import style from './style'
import mainStyle from '../style'

//Components
import { ManageHeader } from '../etc/Headers'
import AddButton from '../event/AddButton'
import Modal from '../modals'

//Client
import { updateRequest, createEvent } from '../client'

const { textRequestBold, requestContainer, textRequest } = style
const { floater } = mainStyle

export default class RequestDetail extends Component {
    render() {
        const { statefulStatus, modalActive } = this.state
        const { goBack, state: { params: { item } } } = this.props.navigation
        const { client_email, client_name, client_phone, discount, duration, level, set, type, date, hour, status, total: { eventos, outros, sub, servicos } } = item
        const getDiscount = (percent, total) => total - (total * percent / 100)
        const format = (number) => "R$" + parseInt(number).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

        return (
            <Fragment>
                <ManageHeader name="Detalhes do Orçamento" changeView={() => goBack()}/>
                <ScrollView contentContainerStyle={{paddingBottom: 55}}>
                    <View style={requestContainer}>
                        <View>
                            <Text style={[textRequestBold, {fontSize: 17, marginBottom: 8}]}>Sobre o evento</Text>

                            <Text style={[textRequestBold, {marginBottom: 6}]}>Tipo de evento: <Text style={textRequest}>{type}</Text></Text>
                            <Text style={[textRequestBold, {marginBottom: 6}]}>Nível: <Text style={textRequest}>{level}</Text></Text>
                            <Text style={[textRequestBold, {marginBottom: 6}]}>Duração: <Text style={textRequest}>{duration === 1 ? duration + " hora" : duration + " horas"}</Text></Text>
                            <Text style={[textRequestBold]}>Data do evento: <Text style={textRequest}>{date} às {hour}</Text></Text>
                        </View>
                    </View>
                    <View style={requestContainer}>
                        <View>
                            <Text style={[textRequestBold, {fontSize: 17, marginBottom: 8}]}>Cliente</Text>

                            <Text style={[textRequestBold, {marginBottom: 6}]}>Por: <Text style={textRequest}>{client_name}</Text></Text>
                            <Text style={[textRequestBold, {marginBottom: 6}]}>E-mail: <Text style={textRequest}>{client_email}</Text></Text>
                            <Text style={textRequestBold}>Telefone: <Text style={textRequest}>{`(${client_phone.substr(0,2)}) ${client_phone.substr(2,5)}-${client_phone.substr(6)}`}</Text></Text>
                        </View>
                    </View>
                    {
                        set.length > 0 ? 
                            <View style={requestContainer}>
                                <View>
                                    <Text style={[textRequestBold, {fontSize: 17}]}>Serviços e Produtos</Text>

                                    {
                                        set.map(({label, obs, qty}) => (
                                            <Fragment key={label}>
                                                <Text style={[textRequestBold, {marginBottom: 6, marginTop: 8}]}>Pacote: <Text style={textRequest}>{label}</Text></Text>
                                                <Text style={[textRequestBold, {marginBottom: 6}]}>Quantidade: <Text style={textRequest}>{qty}</Text></Text>
                                                <Text style={[textRequestBold, {marginBottom: 6}]}>Observação: <Text style={textRequest}>{obs ? obs : "Nenhuma Observação"}</Text></Text>    
                                            </Fragment>
                                        ))
                                    }
                                </View>
                            </View>
                        :
                            null
                    }
                    <View style={requestContainer}>
                        <View>
                            <Text style={[textRequestBold, {fontSize: 17, marginBottom: 8}]}>Orçamento</Text>

                            {/* <Text style={[textRequestBold, {marginBottom: 6}]}>Serviços (Total): <Text style={textRequest}>{format(servicos)}</Text></Text>
                            <Text style={[textRequestBold, {marginBottom: 6}]}>Eventos (Total): <Text style={textRequest}>{format(eventos)}</Text></Text>
                            <Text style={[textRequestBold, {marginBottom: 6}]}>Outros (Total): <Text style={textRequest}>{format(outros)}</Text></Text> */}
                            <Text style={[textRequestBold, {marginBottom: 6}]}>Sub-Total: <Text style={textRequest}>{format(sub)}</Text></Text>
                            <Text style={textRequestBold}>Total (-{discount}%): <Text style={textRequest}>{format(getDiscount(discount, sub))}</Text></Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={floater}>
                    {
                        statefulStatus === "pending" ? 
                            <Fragment>
                                <AddButton func={() => this.updateStatus('accepted')} label="Aceitar" style={{margin: 10}}/>
                                <AddButton func={() => this.updateStatus('rejected')} label="Recusar" style={{margin: 10, backgroundColor: "#FF0004"}}/>
                            </Fragment>
                        :
                        <Text style={[textRequest, {margin: 12}]}>Solicitação {`${statefulStatus === "accepted" ? "aceita" : "rejeitada"}`}</Text>
                    }
                </View>
                <Modal 
                    label="Criar evento" 
                    text="Insira o nome do evento"
                    left={{ leftFunc: () => null, leftLabel: "Cancelar" }} 
                    right={{ rightFunc: () => this.props.navigation.navigate("SetPros", { request: this.props.navigation.state.params.item, name: this.state.eventInput }), rightLabel: "Confirmar" }}
                    forminput={{placeholder: "Nome"}}
                    handleInput={(text) => this.handleInput(text)}
                    opacity={{
                        isActivated: modalActive, 
                        handleOverlay: this.toggleModal
                    }}
                />
            </Fragment>
        );
    }

    state = {
        statefulStatus: this.props.navigation.state.params.item.status,
        modalActive: false,
        eventInput: ""
    }

    handleInput = (value) => this.setState({...this.props, eventInput: value})

    toggleModal = () => this.setState({...this.state, modalActive: !this.state.modalActive})

    updateStatus = (status) => {
        const { user_id, item: { id } } = this.props.navigation.state.params

        if(status === "accepted"){
            this.toggleModal()
        }else{
            updateRequest(user_id, id, status).then(() => this.setState({...this.state, statefulStatus: status}))
        }
    }

    create = () => {
        const { user_id, item: { id } } = this.props.navigation.state.params
        const { eventInput } = this.state
        
        if(eventInput.length > 0){
            AsyncStorage.getItem("user").then(user => {
                createEvent(user_id, eventInput, id)
                    .then(event => {updateRequest(user_id, id, "accepted"); return event})
                    .then(event => this.props.navigation.navigate('Midia', {event, data: JSON.parse(user).data}))
            })
        }
            //.then(() => this.props.navigation.navigate('Midia', {event, data}))
    }
}