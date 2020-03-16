    
import React, { Component, Fragment } from 'react';
import { View, Text, Image, TextInput, KeyboardAvoidingView, ScrollView, Modal, TouchableNativeFeedback, Animated, BackHandler, ActivityIndicator, Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';

//Components
import Button from './Button'
import MModal from '../modals'

//Styles
import style from './style'
import mainStyle from '../style'

//Assets
import Logo from '../../assets/logo.png'

//Client
import { loginUser, getEvents, validateUser } from '../client' 

const { forgotPass, textBox, scrollView, logo, form } = style
const { size } = mainStyle

export default class Login extends Component {    
    onLayout(e) {
        const {width, height} = Dimensions.get('window')
        this.setState({...this.state, isPortrait: height > width})
    }
    
    
    render() {
        const { navigate } = this.props.navigation
        const { state: { overlayActivated, overlayOpacity, isLoading, isLoadingPreviousData, isPortrait }, handleOverlay } = this
                
        if(!isLoadingPreviousData){
            return(
                <Fragment>
                    <Modal visible={isLoading} transparent={true} animationType="fade">
                        <View style={[size("100%", "100%"), {backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center',}]}>
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                        </View>    
                    </Modal>
                    <KeyboardAvoidingView>
                        <ScrollView onLayout={this.onLayout.bind(this)} contentContainerStyle={[scrollView, {height: isPortrait ? "100%" : null}]}>
                            <Image source={Logo} style={logo}></Image>
    
                            <ScrollView contentContainerStyle={[form]}> 
                                <View>
                                    <TextInput onSubmitEditing={this.handleLogin} value={this.state.form.email} onChangeText = {(text) => this.handleInput(text, 'email')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Email" keyboardType="email-address" style={textBox} />
                                    <TextInput onSubmitEditing={this.handleLogin} onChangeText = {(text) => this.handleInput(text, 'password')} autoCapitalize="none" placeholderTextColor="#8190A5" placeholder="Senha" secureTextEntry={true} style={[textBox, {marginTop: 20}]} />
                                    <Button event={this.handleLogin} type='enter' value="Entrar"/>
                                    <TouchableNativeFeedback onPress={() => navigate('Forgot')}>
                                        <Text style={[forgotPass, {marginBottom: isPortrait ? null : 25}]}>Esqueceu sua Senha?</Text>
                                    </TouchableNativeFeedback>
                                </View>
                                <Button btnStyle={{marginTop: 20}} event={handleOverlay} type='create' value="Eu ainda não tenho uma conta"/>
                            </ScrollView>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <MModal 
                        label="Criar conta" 
                        text="Qual o seu perfil?" 
                        left={{ leftFunc: () => navigate('UserForm'), leftLabel: "Usuário" }} 
                        right={{ rightFunc: () => navigate('ProForm'), rightLabel: "Profissional" }}
                        opacity={{
                            isActivated: overlayActivated, 
                            handleOverlay
                        }}
                    />
                </Fragment>
            );
        }else{
            return <View></View>
        }
    }

    state = {
        overlayActivated: false,
        overlayOpacity: new Animated.Value(0),
        form: {},
        isLoading: false,
        isLoadingPreviousData: false,
        isPortrait: true
    }


    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
       
        try {
            AsyncStorage.getItem('token').then(token => {
                if(token){
                    this.setState({...this.state, isLoadingPreviousData: true})
                    loginUser().then((data) => {
                        getEvents(data.id).then(event_data => {
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Main', params: { data, event_data } })],
                            });
            
                            AsyncStorage.setItem('user', JSON.stringify({ data }))
                            AsyncStorage.setItem('token', token)
                            
                            return this.props.navigation.dispatch(resetAction)
                        }).catch(() => this.setState({...this.state, isLoadingPreviousData: false}))
                    }).catch(({response}) => {
                        const err = response ? response.data.data.msg : "Ocorreu um erro"
                        
                        AsyncStorage.removeItem('token')
                        this.setState({...this.state, isLoadingPreviousData: false})
                        Toast.show(err, Toast.LONG);
                    })
                }else{
                    this.setState({...this.state, isLoadingPreviousData: false})
                }
            })
        } catch (error) {
            this.setState({...this.state, isLoadingPreviousData: false})
        }
    }
    
    componentWillUnmount = () => this.backHandler.remove()
    
    handleBackPress = () => {
        let { overlayActivated } = this.state
        
        if (overlayActivated) {
            this.handleOverlay()
            return true;
        }
        return false;
    }

    handleInput = (value, key) => this.setState({...this.state, form: {...this.state.form, [key]: value}})

    handleLogin = () => {
        let { email, password } = this.state.form
        this.setState({...this.state, isLoading: true})
        
        validateUser(email, password).then(({token}) => {
            loginUser(token).then((data) => {
                getEvents(data.id, null, token).then(event_data => {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Main', params: { data, event_data } })],
                    });

                    AsyncStorage.setItem('user', JSON.stringify({ data }))
                    AsyncStorage.setItem('token', token)
                    
                    return this.props.navigation.dispatch(resetAction)
                }).catch(({response}) => this.setState({...this.state, isLoading: false}))
            }).catch(({response}) => {
                const err = response ? response.data.data.msg : "Ocorreu um erro"
                this.setState({...this.state, isLoading: false})
                Toast.show(err, Toast.LONG);
            })
        }).catch(({response}) => {
            const err = response ? response.data.data.msg : "Ocorreu um erro"

            this.setState({...this.state, isLoading: false})
            Toast.show(err, Toast.LONG);
        })
    }

    handleOverlay = (e) => this.setState({overlayActivated: !this.state.overlayActivated})
}