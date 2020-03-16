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
import { verifyRequest } from '../client'

const { forgotPass, textBox, scrollView, logo, form } = style

export default class Verify extends Component {
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
                            <Text style={[forgotPass, {marginTop: 0, marginBottom: 25.25}]}>Insira o código de verificação enviado ao seu e-mail</Text>
                            <TextInput onChangeText={(value) => this.setState({...this.state, code: value})} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Código de Verificação" style={textBox} />
                            <Button btnStyle={{marginBottom: this.state.isPortrait ? null : 25}} event={this.verifyCode} type='enter' value="Recuperar Senha"/>
                        </View> 
                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    state = {
        isPortrait: true
    }

    verifyCode = () => {
        const { email, hash } = this.props.navigation.state.params
        verifyRequest(email, this.state.code, hash)
            .then(() => this.props.navigation.navigate("Reset", {email}))
            .catch(({response: { data: { data: { msg }}, status }}) => {
                this.setState({...this.state, isLoading: false})
                Toast.show(msg, Toast.LONG);
            })
    }
}