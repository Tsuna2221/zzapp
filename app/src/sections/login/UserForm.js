import React, { Component } from 'react';
import { View, Text, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import TextInputMask from 'react-native-text-input-mask';

import { createUser, getEvents, validateUser } from '../client' 

//Components
import Button from './Button'

//Styles
import style from './style'
import mainStyle from '../style'

//Assets
import Logo from '../../assets/logo.png'

const { textBox, scrollView, logo, form } = style
const { size } = mainStyle

export default class UserForm extends Component {
    render() {
        const { isLoading } = this.state
        const { navigate, dispatch } = this.props.navigation
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        
        return (
            <KeyboardAvoidingView>
                <Modal visible={isLoading} transparent={true} animationType="fade">
                    <View style={[size("100%", "100%"), {backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center',}]}>
                        <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                    </View>    
                </Modal>
                <ScrollView contentContainerStyle={[scrollView, {height: null}]}>
                    <Image source={Logo} style={logo}></Image>

                    <ScrollView contentContainerStyle={form}> 
                        <View style={{marginBottom: 13.5}}>
                            <TextInput onChangeText={(text) => this.handleInput(text, 'name')} autoCapitalize="words" placeholderTextColor="#8190A5" placeholder="Nome completo" style={textBox} />
                            <TextInputMask mask={"([00]) [00000]-[0000]"} onChangeText={(extr, text) => this.handleInput(text, 'phone_number')} placeholderTextColor="#8190A5" placeholder="Telefone" keyboardType="number-pad" style={[textBox, {marginTop: 20}]} />
                            <TextInput onChangeText={(text) => this.handleInput(text, 'email')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="E-mail" keyboardType="email-address" style={[textBox, {marginTop: 20}]} />
                            <TextInput onChangeText={(text) => this.handleInput(text, 'password')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Senha" secureTextEntry={true} style={[textBox, {marginTop: 20}]} />
                            <TextInput onChangeText={(text) => this.handleInput(text, 'confirm_password')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Confirme sua senha" secureTextEntry={true} style={[textBox, {marginTop: 20}]} />

                            <Button event={this.handleCreation} type='enter' value="Criar conta"/>
                        </View>
                        <Button event={() => navigate('Login')} type='create' value="Eu já tenho uma conta"/>
                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    state = {
        isLoading: false
    }

    handleInput = (value, key) => this.setState({...this.state, [key]: value})

    handleCreation = () => {
        const { email, password, name, phone_number, confirm_password } = this.state
        this.setState({...this.state, isLoading: true})

        createUser(name, email, password, confirm_password, 'client', phone_number).then((data) => {
            validateUser(email, password).then(({token}) => {
                getEvents(data.id, null, token).then(event_data => {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Main', params: { data, event_data } })],
                    });

                    AsyncStorage.setItem('user', JSON.stringify({ data }))
                    AsyncStorage.setItem('token', token)
                    
                    return this.props.navigation.dispatch(resetAction)
                })
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