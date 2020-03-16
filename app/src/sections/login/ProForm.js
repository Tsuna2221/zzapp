import React, { Component, Fragment } from 'react';
import { Text, View, Image, TextInput, KeyboardAvoidingView, ScrollView, Animated, TouchableNativeFeedback } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import { createUser, getEvents, validateUser } from '../client' 
import TextInputMask from 'react-native-text-input-mask';

//Components
import Button from './Button'
import Modal from '../modals'

//Styles
import style from './style'
import mainStyle from '../style'

//Assets
import Logo from '../../assets/logo.png'
import Arrow from '../../assets/arrow-right.png'
import Placeholder from '../../assets/profile.png'

const { textBox, scrollView, logo, form, select, selectText } = style
const { size } = mainStyle

export default class ProForm extends Component {
    render() {
        const { navigate, dispatch, state: { params } } = this.props.navigation
        const { state: { overlayActivated, overlayOpacity, modalInput: { placeholder, text, btnText } }, handleOverlay, updateInput } = this
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
                <KeyboardAvoidingView>
                    <ScrollView contentContainerStyle={[scrollView, {height: null}]}>
                        <Image source={Logo} style={logo}></Image>

                        <ScrollView contentContainerStyle={[form]}> 
                            <View style={{marginBottom: 9}}>
                                <TextInput onChangeText={(text) => this.handleInput(text, 'name')} autoCapitalize="words" placeholderTextColor="#8190A5" placeholder="Nome completo" style={textBox} />
                                <TextInput onChangeText={(text) => this.handleInput(text, 'email')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Email" keyboardType="email-address" style={[textBox, {marginTop: 10}]} />
                                <TextInputMask mask={"([00]) [00000]-[0000]"} onChangeText={(extr, text) => this.handleInput(text, 'phone_number')} placeholderTextColor="#8190A5" placeholder="Telefone" keyboardType="number-pad" style={[textBox, {marginTop: 10}]} />
                                <TextInput onChangeText={(text) => this.handleInput(text, 'password')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Senha" secureTextEntry={true} style={[textBox, {marginTop: 10}]} />
                                <TextInput onChangeText={(text) => this.handleInput(text, 'confirm_password')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Confirme sua senha" secureTextEntry={true} style={[textBox, {marginTop: 10}]} />
                                <TextInput onChangeText={(text) => this.handleInput(text, 'portfolio')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Link do seu portfólio" style={[textBox, {marginTop: 10}]} />
                                <TouchableNativeFeedback onPress={() => navigate('UserSelect', { id: "new", userType: 'mentor', navigateTo: 'ProForm', headerText: "Selecione seu padrinho" })}>
                                    <View style={select}>
                                        {
                                            params ?
                                                params.name ? 
                                                    <View style={{flexDirection: "row", alignItems: 'center',}}>
                                                        <Image style={[size(42, 42), {borderRadius: 150}]} source={params.avatar_name ? {uri: `http://18.228.199.251:5000/static/${params.avatar_name}`} : Placeholder}></Image>
                                                        <Text style={{marginLeft: 12, fontFamily: 'Lato', color: '#47525E', fontSize: 13}}>{params.name}</Text>
                                                    </View>
                                                :
                                                <Text style={selectText}>Selecione seu padrinho</Text>
                                            :
                                                <Text style={selectText}>Selecione seu padrinho</Text>
                                        }
                                        <Image source={Arrow} style={size(10, 10)}></Image>
                                    </View>
                                </TouchableNativeFeedback>

                                
                                <TouchableNativeFeedback onPress={() => navigate('ServiceSelect')}>
                                    <View style={select}>
                                        {
                                            params ?
                                                params.serviceList ? 
                                                    <View style={{flexDirection: "column"}}>
                                                        <Text style={{marginBottom: 5, fontFamily: 'Lato-Bold', color: '#47525E', fontSize: 14, }}>Selecionado:</Text>
                                                        {
                                                            params.serviceList.map(item => (
                                                                <Text style={{marginVertical: 2, fontFamily: 'Lato', color: '#47525E', fontSize: 13}}>{serviceLabel(item)}</Text>
                                                            ))
                                                        }
                                                    </View>
                                                :
                                                <Text style={selectText}>Serviços à oferecer</Text>
                                            :
                                                <Text style={selectText}>Serviços à oferecer</Text>
                                        }
                                        <Image source={Arrow} style={size(10, 10)}></Image>
                                    </View>
                                </TouchableNativeFeedback>
                                <Button event={handleOverlay} type='enter' value="Criar conta"/>
                            </View>
                            <Button event={() => navigate('Login')} type='create' value="Eu já tenho uma conta"/>
                        </ScrollView>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Modal 
                    label="Criar conta"
                    handleInput={this.handleInput} 
                    text={text}
                    placeholderUpdate={() => this.updateInput('CPF', 'Por favor, insira seu número de CPF', 'Avançar')}
                    left={{ leftFunc: () => placeholder === 'CPF' ? updateInput("RG", 'Por favor, insira seu número de RG', 'Confirmar', true) : this.handleCreation(true), leftLabel: "Pular" }} 
                    right={{ rightFunc: () => placeholder === 'CPF' ? updateInput("RG", 'Por favor, insira seu número de RG', 'Confirmar') : this.handleCreation(), rightLabel: placeholder === "CPF" ? "Avançar" : "Confirmar" }}
                    forminput={{ placeholder }}
                    opacity={{
                        overlayOpacity: overlayOpacity, 
                        isActivated: overlayActivated, 
                        handleOverlay
                    }}
                />
            </Fragment>
        );
    }

    state = {
        overlayActivated: false,
        overlayOpacity: new Animated.Value(0),
        modalInput: {
            placeholder: 'CPF',
            text: 'Por favor, insira seu número de CPF',
            btnText: 'Avançar'
        },
        form: {}
    }

    handleOverlay = (e) => this.setState({overlayActivated: !this.state.overlayActivated})

    updateInput = (placeholder, text, btnText, skip) => {
        this.setState({...this.state, modalInput: { placeholder, text, btnText }, form:{...this.state.form, cpf: skip ? null : this.state.form.cpf} })
    }

    handleInput = (value, key) => this.setState({...this.state, form: {...this.state.form, [key]: value}})

    handleCreation = (skip) => {
        const { email, password, name, confirm_password, phone_number, portfolio, cpf, rg } = this.state.form
        const { params } = this.props.navigation.state
        const skipRG = skip ? null : rg
        
        this.setState({...this.state, isLoading: true})
        
        createUser(
            name, 
            email, 
            password, 
            confirm_password, 
            'pro', 
            phone_number, 
            portfolio, 
            cpf, 
            skipRG, 
            params ? params.id : null, 
            null, 
            null, 
            params ? JSON.stringify(params.serviceList) : null
        ).then((data) => {
            validateUser(email, password).then(({token}) => {
                getEvents(data.id, null, token).then(event_data => {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Main', params: { data, event_data } })],
                    });

                    AsyncStorage.setItem('user', JSON.stringify({ data }))
                    AsyncStorage.setItem('token', token)
                    
                    return this.props.navigation.dispatch(resetAction)
                }).catch(({response}) => null)
            }).catch(({response: { data: { data: { msg }}, status }}) => {
                this.setState({...this.state, isLoading: false})
                Toast.show(msg, Toast.LONG);
            })
        }).catch(({response: { data: { data: { msg }}, status }}) => {
            this.setState({...this.state, isLoading: false})
            Toast.show(msg, Toast.LONG);
        })
    }
}