import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import style from './style'

import { ManageHeader } from '../etc/Headers'
import AddButton from '../event/AddButton'

const { size, floater } = mainStyle
const {  } = style

export default class ServiceSelect extends Component {
    render() {
        const { list } = this.state
        const { goBack, navigate } = this.props.navigation
        const services = [
            {label:"Cinegrafista", value: "cinegrafistas"},
            {label:"Fotógrafo", value: "fotografos"},
            {label:"Edição de Vídeo", value: "video_edicao"},
            {label:"Tratamento de Fotos", value: "tratamento_fotos"},
            {label:"Diagramação de Álbum", value: "diagramacao_album"},
        ]

        return (
            <Fragment>
                <ManageHeader name="Selecionar Serviços" changeView={() => goBack()}/>
                <ScrollView>
                    {
                        services.map(({label, value}) => (
                            <TouchableNativeFeedback onPress={() => this.handleCheck(value)}>
                                <View style={{flexDirection: "row", paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center', borderBottomColor: '#D2DAE6', borderBottomWidth: 0.5, backgroundColor: list.includes(value) ? "#ddd" : "#fff"}}>
                                    <Text style={{fontFamily: 'Lato', color: '#47525E', fontSize: 16, paddingVertical: 10}}>{label}</Text>
                                </View>                    
                            </TouchableNativeFeedback>
                        ))
                    }
                </ScrollView>
                <View style={floater}>
                    <AddButton func={() => navigate("ProForm", { serviceList: list })} label="Confirmar" style={{margin: 10}}/>
                </View>
            </Fragment>
        );
    }

    state = {
        list: []
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
}