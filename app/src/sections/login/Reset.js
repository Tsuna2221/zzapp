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
import { resetPassword } from '../client'

const { forgotPass, textBox, scrollView, logo, form } = style

export default class Reset extends Component {
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
                            <TextInput onChangeText={(text) => this.setState({...this.state, password: text})} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Nova senha" secureTextEntry={true} style={[textBox, {marginTop: 10}]} />
                            <TextInput onChangeText={(text) => this.setState({...this.state, confirm_password: text})} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Confirme a nova senha" secureTextEntry={true} style={[textBox, {marginTop: 10}]} />
                            <Button btnStyle={{marginBottom: this.state.isPortrait ? null : 25}} event={this.resetPass} type='enter' value="Redefinir Senha"/>
                        </View> 
                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    state = {
        isPortrait: true
    }

    resetPass = () => {
        const { email } = this.props.navigation.state.params
        const { password, confirm_password } = this.state

        resetPassword(email, password, confirm_password)
            .then(() => {
                Toast.show("Senha redefinida com sucesso", Toast.LONG);
                this.props.navigation.navigate("Login")
            })
            .catch(({response: { data: { data: { msg }}, status }}) => {
                this.setState({...this.state, isLoading: false})
                Toast.show(msg, Toast.LONG);
            })
    }
}