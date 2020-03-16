import React, { Component, Fragment } from 'react';
import { View, Modal, Text, ScrollView, ActivityIndicator, Dimensions, TextInput, TouchableNativeFeedback } from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';

import { updateUser } from '../client'

import style from './style'
import mainStyle from '../style'

import { ManageHeader } from '../etc/Headers'
import AddButton from '../event/AddButton'
import EventPicker from './Picker'
import Switch from '../manage/Switch'

const { textBox } = style
const { floater, size } = mainStyle

export default class Edit extends Component {

    onLayout(e) {
        const {width, height} = Dimensions.get('window')
        this.setState({...this.state, isPortrait: height > width})
    }

    render() {
        const {currentUser, navigation: { goBack, state: { params } }} = this.props
        const { name, phone_number, portfolio, cpf, rg, birthday, civil, baptism, essay, wedding, corp, debut, isLoading, isPortrait, email } = this.state
        const services = [
            {label:"Cinegrafista", value: "cinegrafistas"},
            {label:"Fotógrafo", value: "fotografos"},
            {label:"Edição de Vídeo", value: "video_edicao"},
            {label:"Tratamento de Fotos", value: "tratamento_fotos"},
            {label:"Diagramação de Álbum", value: "diagramacao_album"},
        ]

        
        return (
            <Fragment>
                <Modal visible={isLoading} transparent={true} animationType="fade">
                    <View style={[size("100%", "100%"), {backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center',}]}>
                        <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                    </View>    
                </Modal>
                <ManageHeader name="Editar Perfil" changeView={() => goBack()}/>
                <ScrollView onLayout={this.onLayout.bind(this)} contentContainerStyle={{flexDirection: 'column', alignItems: 'center', marginTop: 15}}>
                    <TextInput value={name} onChangeText={(text) => this.handleInput(text, 'name')} autoCapitalize="words" placeholderTextColor="#8190A5" placeholder="Nome" style={[textBox, {marginBottom: 10}]} />
                    <TextInput value={email} onChangeText={(text) => this.handleInput(text, 'email')} autoCapitalize="words" placeholderTextColor="#8190A5" placeholder="E-mail" style={[textBox, {marginBottom: 10}]} />
                    {
                        params.id === params.data.id ? 
                            <TextInputMask value={phone_number} mask={"([00]) [00000]-[0000]"} onChangeText={(extr, text) => this.handleInput(text, 'phone_number')} placeholderTextColor="#8190A5" placeholder="Telefone" keyboardType="number-pad" style={[textBox, {marginBottom: 10}]} />
                        :
                            null
                    }
                    {
                        params.account_type !== "client" ?
                            <Fragment>
                            {
                                params.id === params.data.id ? 
                                    <Fragment>
                                        <TextInput value={portfolio} onChangeText={(text) => this.handleInput(text, 'portfolio')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Link do seu portfólio" style={[textBox, {marginBottom: 10}]} />
                                        <TextInputMask value={cpf} mask={"[000].[000].[000]-[00]"} onChangeText={(extr, text) => this.handleInput(text, 'cpf')} placeholderTextColor="#8190A5" placeholder="CPF" keyboardType="number-pad" style={[textBox, {marginBottom: 10}]} />
                                        <TextInputMask value={rg} mask={"[00].[000].[000]-[-]"} onChangeText={(extr, text) => this.handleInput(text, 'rg')} placeholderTextColor="#8190A5" placeholder="RG" style={[textBox, {marginBottom: 10}]} />
                                    </Fragment>
                                :
                                    null
                            }
                            {
                                params.data.account_type === "admin" ?
                                    params.account_type === "mentor" || params.account_type === "pro" ?
                                        <View style={{flexDirection: "row", justifyContent: "space-between", width: 200, marginVertical: 16}}>
                                            <Text style={{fontSize: 17, fontFamily: "Lato", color: "#8190A5"}}>Mentor</Text>
                                            <Switch state={this.state.account_type === "mentor"} func={() => this.setState({...this.state, account_type: this.state.account_type === "mentor" ? "pro" : "mentor"})}/>
                                        </View>
                                    :
                                        null 
                                :
                                    null
                            }
                                <EventPicker text="Aniversário" selectedValue={birthday} handlePicker={this.handlePicker} toChange="birthday"/>
                                <EventPicker text="Civil" selectedValue={civil} handlePicker={this.handlePicker} toChange="civil"/>
                                <EventPicker text="Batizado" selectedValue={baptism} handlePicker={this.handlePicker} toChange="baptism"/>
                                <EventPicker text="Ensaio" selectedValue={essay} handlePicker={this.handlePicker} toChange="essay"/>
                                <EventPicker text="Casamento" selectedValue={wedding} handlePicker={this.handlePicker} toChange="wedding"/>
                                <EventPicker text="Corporativo" selectedValue={corp} handlePicker={this.handlePicker} toChange="corp"/>
                                <EventPicker text="Debutante" selectedValue={debut} handlePicker={this.handlePicker} toChange="debut"/>
                                {
                                    (params.data.account_type === "admin" || params.data.id === params.id || params.data.id === params.mentor_id) && (params.account_type === "pro" || params.account_type === "mentor") ?
                                        <Fragment>
                                            <Text style={{fontSize: 19, fontFamily: "Lato", color: "#8190A5", width: 288, marginVertical: 15 }}>Serviços</Text>
                                            {
                                                services.map(({label, value}) => (
                                                    <TouchableNativeFeedback onPress={() => this.handleCheck(value)}>
                                                        <View style={{flexDirection: "row", width: "100%", paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center', borderBottomColor: '#D2DAE6', borderBottomWidth: 0.5, backgroundColor: this.state.list.includes(value) ? "#ddd" : "#fff"}}>
                                                            <Text style={{fontFamily: 'Lato', color: '#47525E', fontSize: 16, paddingVertical: 10}}>{label}</Text>
                                                        </View>                    
                                                    </TouchableNativeFeedback>
                                                ))
                                            }
                                        </Fragment>
                                    :
                                        null
                                }
                                <View style={{marginTop: 50}}></View>
                            </Fragment>
                        :
                            null
                    }
                </ScrollView>
                <View style={floater}>
                    <AddButton func={this.updateProfile} label="Salvar" style={{margin: 10}}/>
                </View>
            </Fragment>
        );
    }

    state = {
        name: this.props.navigation.state.params.name,
        email: this.props.navigation.state.params.email,
        phone_number: this.props.navigation.state.params.phone_number,
        portfolio: this.props.navigation.state.params.portfolio,
        cpf: this.props.navigation.state.params.cpf,
        rg: this.props.navigation.state.params.rg,
        id: this.props.navigation.state.params.id,
        account_type: this.props.navigation.state.params.account_type,
        birthday: this.props.navigation.state.params.ratings.events[0].rating,
        civil: this.props.navigation.state.params.ratings.events[1].rating,
        baptism: this.props.navigation.state.params.ratings.events[2].rating,
        essay: this.props.navigation.state.params.ratings.events[3].rating,
        wedding: this.props.navigation.state.params.ratings.events[4].rating,
        corp: this.props.navigation.state.params.ratings.events[5].rating,
        debut: this.props.navigation.state.params.ratings.events[6].rating,
        isLoading: false,
        isPortrait: true,
        list: JSON.parse(this.props.navigation.state.params.services || "[]")
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

    handleInput = (value, key) => this.setState({...this.state, [key]: value})

    handlePicker = (value, toChange) => this.setState({...this.state, [toChange]: value})
 
    updateProfile = () => {
        const { name, email, phone_number, portfolio, cpf, rg, birthday, civil, baptism, essay, wedding, corp, debut, account_type, list } = this.state 

        const {currentUser, navigation: { goBack, state: { params } }} = this.props

        this.setState({...this.state, isLoading: true})

        updateUser(this.state.id, {
            name, phone_number,
            portfolio, cpf,
            rg, birthday,
            civil, baptism, 
            essay, wedding,
            corp, debut,
            account_type,
            email, services: JSON.stringify(list)
        }).then(async (data) => {
            try {
                const value = await AsyncStorage.getItem('user')
                if(value !== null) {
                    const { event_data } = JSON.parse(value)

                    const returnData = params.data.id === params.id ? data : params.data
                    AsyncStorage.setItem('user', JSON.stringify({ data: returnData, event_data }))
                    this.props.navigation.navigate("Main", { data: returnData, event_data })
                }else{
                    this.setState({...this.state, isLoading: false})
                }
            } catch (error) {
                this.setState({...this.state, isLoading: false})
            }
        }).catch(({response: { data: { data: { msg }}, status }}) => {
            this.setState({...this.state, isLoading: false})
            Toast.show(msg, Toast.LONG);
        })
    }
}

