import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { getRequests } from '../client'
import style from './style'
import mainStyle from '../style'

import { ManageHeader } from '../etc/Headers'
import PersonCell from './PersonCell'

import Arrow from '../../assets/arrow-right.png'
const { textRequestBold, requestContainer, textRequest, headStatus } = style
const { size } = mainStyle

export default class Requests extends Component {
    render() {
        const { isLoading, itemList, status } = this.state
        const { navigate, state: { params } } = this.props.navigation
        const parsedList = itemList.filter(({status}) => status === this.state.status)

        return (
            <Fragment>
                <ManageHeader name="Solicitações de Orçamento" changeView={() => navigate('Main')}/>
                <View style={[headStatus, {paddingVertical: 13, marginBottom: 10, flexDirection: "row", justifyContent: "space-around"}]}>
                    <TouchableNativeFeedback onPress={() => this.changeStatus('pending')}><Text style={status === "pending" ? textRequestBold : textRequest}>Pendentes</Text></TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.changeStatus('accepted')}><Text style={status === "accepted" ? textRequestBold : textRequest}>Aceitos</Text></TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.changeStatus('rejected')}><Text style={status === "rejected" ? textRequestBold : textRequest}>Rejeitados</Text></TouchableNativeFeedback>
                </View>
                <ScrollView contentContainerStyle={{paddingBottom: 55}}>
                    {
                        isLoading ? 
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                        :
                            parsedList.length > 0 ?
                                parsedList.map((item) => {
                                    const { client_name, client_email, total, level, duration, type, id, date, hour } = item
                                    return (
                                        <TouchableNativeFeedback key={id} onPress={() => navigate('RequestDetail', {item, user_id: params.id})}>
                                            <View style={requestContainer}>
                                                <View>
                                                    <Text style={[textRequestBold, {marginBottom: 6}]}>Tipo de evento: <Text style={textRequest}>{type}</Text></Text>
                                                    <Text style={[textRequestBold, {marginBottom: 6}]}>Nível: <Text style={textRequest}>{level}</Text></Text>
                                                    <Text style={[textRequestBold, {marginBottom: 6}]}>Duração: <Text style={textRequest}>{duration === 1 ? duration + " hora" : duration + " horas"}</Text></Text>
                                                    <Text style={[textRequestBold, {marginBottom: 6}]}>Por: <Text style={textRequest}>{client_name + " <" + client_email + ">"}</Text></Text>
                                                    <Text style={[textRequestBold]}>Data do evento: <Text style={textRequest}>{date} às {hour}</Text></Text>
                                                </View>
                                                <Image style={[size(16, 16)]} source={Arrow}></Image>
                                            </View>
                                        </TouchableNativeFeedback>
                                    )
                                })
                            :
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Nenhuma solicitação encontrada</Text>
                            </View>
                    }
                </ScrollView>
            </Fragment>
        );
    }

    state = {
        isLoading: true,
        itemList: [],
        status: "pending"
    }

    changeStatus = (status) => this.setState({...this.state, status})

    componentDidMount() {
        const { navigate, state: { params: { id } } } = this.props.navigation

        getRequests(id)
            .then(data => {
                this.setState({...this.state, isLoading: false, itemList: data})
            })
            .catch(({response: { data: { data: { msg }}, status} }) => {
                Toast.show(msg, Toast.LONG)
                this.setState({isLoading: false})
            })
    }
}