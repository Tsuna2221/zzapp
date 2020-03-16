import React, { Component } from 'react';
import { View, Text, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Toast from 'react-native-simple-toast';

//Components
import Button from './Button'

//Styles
import style from './style'

//Assets
import Logo from '../../assets/logo.png'

//Client
import { sendPassRequest } from '../client'

const { forgotPass, textBox, scrollView, logo, form } = style

export default class Forgot extends Component {
    onLayout(e) {
        const {width, height} = Dimensions.get('window')
        this.setState({...this.state, isPortrait: height > width})
    }

    render() {
        return (
            <KeyboardAvoidingView>
                <ScrollView onLayout={this.onLayout.bind(this)} contentContainerStyle={[scrollView, {height: this.state.isPortrait ? responsiveHeight(95) : null}]}>
                    <Image source={Logo} style={logo}></Image>

                    <ScrollView contentContainerStyle={form}> 
                        <View>
                            <Text style={[forgotPass, {marginTop: 0, marginBottom: 25.25}]}>Informe o e-mail da sua conta, nós iremos enviar um código de redefinição de senha</Text>
                            <TextInput onChangeText={(value) => this.setState({...this.state, email: value})} autoCapitalize="none"  placeholderTextColor="#8190A5" placeholder="Email" keyboardType="email-address" style={textBox} />

                            <Button btnStyle={{marginBottom: this.state.isPortrait ? null : 25}} event={this.sendRequest} type='enter' value="Recuperar Senha"/>
                        </View> 
                        <Button event={() => this.props.navigation.navigate('Login')} type='create' value="Eu lembrei minha senha"/>
                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    state = {
        isPortrait: true
    }

    sendRequest = () => {
        sendPassRequest(this.state.email)
            .then((res) => this.props.navigation.navigate("Verify", { hash: res.hash, email: this.state.email }))
            .catch(({response: { data: { data: { msg }}, status }}) => {
                Toast.show(msg, Toast.LONG);
            })
    }
}