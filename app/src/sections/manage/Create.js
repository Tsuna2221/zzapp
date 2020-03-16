import React, { Component, Fragment } from 'react';
import { ScrollView, View, Text, TextInput, Modal, ActivityIndicator } from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import Toast from 'react-native-simple-toast';
import Button from '../login/Button'
import Switch from './Switch'

import { createUser } from '../client'
import { ManageHeader } from '../etc/Headers'

import style from '../login/style'
import mainStyle from '../style'

const { textBox } = style
const { size } = mainStyle

export default class CreatePro extends Component {
    render() {
        const { props: { navigation: { goBack, state: { params: { text, type } } } }, state: {isLoading}} = this
        return (
            <Fragment>
                <Modal visible={isLoading} transparent={true} animationType="fade">
                    <View style={[size("100%", "100%"), {backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center',}]}>
                        <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                    </View>    
                </Modal>
                <ManageHeader name={`Cadastrar ${text}`} changeView={() => goBack()}/>
                <ScrollView contentContainerStyle={{width: "100%", flexDirection: 'row', justifyContent: 'center', marginTop: 18.75, paddingBottom: 40}}>
                    <View>
                        <TextInput onChangeText={(text) => this.handleInput("name", text)} autoCapitalize="words"  placeholderTextColor="#8190A5" placeholder="Nome completo" style={[textBox]} />
                        <TextInput onChangeText={(text) => this.handleInput("email", text)} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Email" keyboardType="email-address" style={[textBox, {marginTop: 20}]} />
                        <TextInputMask mask={"([00]) [00000]-[0000]"} onChangeText={(extr, text) => this.handleInput('phone_number', text)} placeholderTextColor="#8190A5" placeholder="Telefone" keyboardType="number-pad" style={[textBox, {marginTop: 20}]} />
                        <TextInput onChangeText={(text) => this.handleInput("password", text)} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Senha" secureTextEntry={true} style={[textBox, {marginTop: 20}]} />
                        <TextInput onChangeText={(text) => this.handleInput("confirm_password", text)} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Confirme sua senha" secureTextEntry={true} style={[textBox, {marginTop: 20}]} />
                        {
                            type === "mentor" ?
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24}}>
                                    <Text>Esse profissional é um mentor?</Text>
                                    <Switch func={() => this.setState({...this.state, isMentor: !this.state.isMentor})}/>
                                </View>
                            :
                                null
                        }
                        <Button btnStyle={{backgroundColor: "#47525E", marginTop: 24}} event={this.createNewUser} type='enter' value="Criar conta"/>
                    </View>
                </ScrollView>
            </Fragment>
        );
    }

    state = {
        isMentor: false,
        name: "",
        email: "",
        password: "",
        isLoading: false
    }

    handleInput = (key, value) => this.setState({...this.state, [key]: value})

    createNewUser = () => {
        const { state: { params: { id, type } }, goBack } = this.props.navigation
        const { name, email, isMentor, password, confirm_password, phone_number } = this.state

        this.setState({...this.state, isLoading: true})

        createUser(name, email, password, confirm_password, type, phone_number, null, null, null, null, id, type === "mentor" ? isMentor : null )
            .then((data) => {
                Toast.show("Usuário criado com sucesso!", Toast.LONG)
                
                this.setState({...this.state, isLoading: false})
                return goBack()
            })
            .catch(({response: { data: { data: { msg }} }}) => {
                this.setState({...this.state, isLoading: false})
                Toast.show(msg, Toast.LONG);
            })
    }
}