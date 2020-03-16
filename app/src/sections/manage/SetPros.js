import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import style from './style'

import { ManageHeader } from '../etc/Headers'
import AddButton from '../event/AddButton'

import AsyncStorage from '@react-native-community/async-storage';

import { createEvent, updateRequest, updateEvent } from '../client'

const { size, floater } = mainStyle
const {  } = style

export default class SetPros extends Component {
    render() {
        const { goBack, navigate } = this.props.navigation
        const { params } = this.props.navigation.state
        return (
            <Fragment>
                <ManageHeader name="Selecionar Profissionais" changeView={() => goBack()}/>
                <ScrollView>
                    {
                        this.state.list.length > 0 ?
                            this.state.list.map(({label, type, value}) => (
                                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("SelectPro", { label, type, value })}>
                                    <View style={{flexDirection: "row", paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center', borderBottomColor: '#D2DAE6', borderBottomWidth: 0.5}}>
                                        <Text style={{fontFamily: params[type] ? 'Lato-Bold' : "Lato", color: '#47525E', fontSize: 16, paddingVertical: 10}}>{label}{params[type] ? `: ${params[type].name}` : ""}</Text>
                                    </View>                    
                                </TouchableNativeFeedback>
                            ))
                        :
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 30}}>
                                <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Nenhum profissional a ser atribuído</Text>
                            </View>
                    }
                </ScrollView>
                <View style={floater}>
                    {console.log(Object.keys(params).length - 4, this.state.list.length)}
                    {
                        Object.keys(params).length - 4 === this.state.list.length ? 
                            <AddButton func={this.confirmEvent} label="Confirmar" style={{margin: 10}}/>
                        :
                            null
                    }
                </View>
            </Fragment>
        );
    }


    state = {
        list: []
    }

    confirmEvent = () => {
        const { params } = this.props.navigation.state
        const userList = [...new Set(Object.keys(params).map((item) => item !== "request" ? params[item].id : null))].filter(i => i)
        
        AsyncStorage.getItem("user").then((user) => {
            let res = JSON.parse(user)

            if(params.fromDetails){
                updateEvent(params.eventId, {name: params.name, status: 'agendado', related_pros: userList})
                    .then(() => updateRequest(res.data.id, params.request.id, "accepted"))
                    .then(event => this.props.navigation.navigate('Informações', { updated: true, updatePros: true, event }))
            }else{
                createEvent(res.data.id, params.name, params.request.id, {related_pros: userList, status: "agendado", related_clients: [params.request.client_id]})
                    .then(event => {updateRequest(res.data.id, params.request.id, "accepted"); return event})
                    .then(event => this.props.navigation.navigate('Midia', {event, data: JSON.parse(user).data, updated: true, updateEvent: true, event}))
            }
        })
    }

    componentDidMount = () => {
        const { request } = this.props.navigation.state.params
        const albums =  ["premium_30x30cm_box", "master_30x30cm_box", "premium_24x30cm_box", "master_24x30cm_box", "master_20x30cm_box"]
        var array = []
        let parsedList = request.set.map(({ label, value, qty }, index) => {
            function listing(num) {
                var arr = Array.apply(null, Array(num));
                return arr.map(function (el, index) { return { value, type: value + index, label: label.substr(0, label.length - 1) + " " + (index + 1) }; });
            };

            return {
                value,
                item: listing(qty),
            }
        })
        let filteredList = parsedList.filter(({value}) => value === "cinegrafistas" || value === "fotografos")
        let filter = filteredList.map(({value}) => value)

        for(let i in filteredList){
            array.push(...filteredList[i].item)
        }

        if(filter.includes("cinegrafistas")){
            array.push(
                {
                    value: "video_edicao",
                    type: "video_edicao",
                    label: "Video Edição"
                }
            )
        } 
        if(filter.includes("fotografos")){
            array.push(
                {
                    value: "tratamento_fotos",
                    type: "tratamento_fotos",
                    label: "Tratamento de Fotos"
                }
            )
        }
        
        if(request.set.map(({value}) => value).some(r=> albums.indexOf(r) >= 0)){
            array.push(
                {
                    value: "diagramacao_album",
                    type: "diagramacao_album",
                    label: "Diagramação de Álbum"
                }
            )
        }

        this.setState({...this.state, list: array})
    };
}