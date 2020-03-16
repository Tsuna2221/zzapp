import React, { Component, Fragment } from 'react';
import { View, ScrollView, Dimensions, Animated, BackHandler, Text, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { createEvent, getEvents } from '../client'

import style from './style'

//Components
import { DefaultHeader } from '../etc/Headers'
import SearchBar from '../etc/SearchBar'
import EventContainer from './Event'
import Menu from './Menu'
import AddButton from './AddButton'
import Modal from '../modals'

const { textRequestBold, textRequest, headStatus } = style

const { width } = Dimensions.get('window');

export default class Main extends Component {
    onLayout(e) {
        const {width, height} = Dimensions.get('window')
        this.setState({...this.state, isPortrait: height > width, width, height})

        if(!this.state.overlayActivated){
            Animated.timing(this.state.overlayPos, {
                toValue: -width,
                duration: 0,
                useNativeDriver: true,
            }).start()
        }
    }

    render() {
        const { state: { overlayModalActivated, overlayModalOpacity, width, height, isPortrait, event_data, loadingEvents, status }, handleOverlay } = this
        const { data, updated } = this.props.navigation.state.params
        const filteredEvents = event_data.filter(({current_status}) => current_status === status)

        const filter = () => {
            const { data } = this.props.navigation.state.params
            const { status } = this.state
    
            if(data.account_type === "admin"){
                return event_data.filter(({current_status}) => current_status === status)
            }else{
                return event_data.filter(({current_status, related, equivalent}) => {          
                    let relatedUsers = related[data.account_type === "mentor" ? "pros" : data.account_type === "pro" ? "pros" : 'clients'].map(({id}) => id === data.id)
                    
                    if(status === "portfolio"){
                        return current_status === "portfolio" && (!relatedUsers.includes(true) || equivalent)
                    }else if(status === "agendado"){
                        return current_status === "agendado" && (relatedUsers.includes(true) || equivalent)
                    }else if(status === "fechado"){
                        return current_status === "fechado" && (relatedUsers.includes(true) || equivalent)
                    }else if(status === "finalizados"){
                        return current_status === "portfolio" && (relatedUsers.includes(true) || equivalent)
                    }else if(status === "pendente"){
                        return current_status === 'pendente' && (relatedUsers.includes(true) || equivalent)
                    }
                })
            }
        }

        return (
            <Fragment>
                <NavigationEvents
                onDidFocus={(payload) => {
                    const {state: { params: { remove, updated, data: { id } } }} = payload

                    if(updated){
                        this.setState({...this.state, loadingEvents: true})
                        
                        getEvents(id).then(event_d => {
                            this.setState({...this.state, event_data: event_d, loadingEvents: false})
                        }).then(() => this.props.navigation.setParams({updated: false}))
                    }else if(remove){
                        const eventsCopy = [...this.state.event_data]
                        const filtered = eventsCopy.filter(({id}) => id !== remove)

                        this.setState({...this.state, event_data: filtered})
                        this.props.navigation.setParams({remove: null})
                    }
                }}/>
                <DefaultHeader handleOverlay={this.handleOverlayActivation}/>
                <View style={[headStatus, {paddingVertical: 13, flexDirection: "row", justifyContent: "space-around"}]}>
                    {
                        data.account_type === "admin" ? 
                            <TouchableNativeFeedback onPress={() => this.changeStatus('pendente')}><Text style={status === "pendente" ? textRequestBold : textRequest}>Pendentes</Text></TouchableNativeFeedback>
                        :
                            null
                    }
                    <TouchableNativeFeedback onPress={() => this.changeStatus('agendado')}><Text style={status === "agendado" ? textRequestBold : textRequest}>Confirmados</Text></TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.changeStatus(data.account_type === "admin" ? 'fechado' : "finalizados")}><Text style={(data.account_type === "admin" ? status === "portfolio" : status === "finalizados") || status === "fechado" ? textRequestBold : textRequest}>Realizados</Text></TouchableNativeFeedback>
                </View>
                {
                    (data.account_type === "admin" ? status === "portfolio" : status === "finalizados") || status === "fechado" ?
                        <View style={[headStatus, {paddingVertical: 13, marginBottom: 10, flexDirection: "row", justifyContent: "space-around"}]}>
                            <TouchableNativeFeedback onPress={() => this.changeStatus('fechado')}><Text style={status === "fechado" ? textRequestBold : textRequest}>Fechados</Text></TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => this.changeStatus(data.account_type === "admin" ? 'portfolio' : "finalizados")}><Text style={(data.account_type === "admin" ? status === "portfolio" : status === "finalizados") ? textRequestBold : textRequest}>Finalizados</Text></TouchableNativeFeedback>
                        </View>
                    :
                        null
                }   
                <ScrollView onLayout={this.onLayout.bind(this)}>
                    <SearchBar handleInput={this.handleSearch} placeholder="Buscar evento"/>
                    {
                        loadingEvents ?
                            <ActivityIndicator style={{marginTop: 14}} animating={true} size="large" color="#CB6026"/>
                        :
                            null
                    }
                    <View style={{marginBottom: data.account_type === "admin" ? 120 : 35}}>
                        {
                            filter().length > 0 ?
                                filter().sort((a, b) => b.id - a.id).map(event => {
                                    return (
                                        <EventContainer key={event.id} event={event} changeView={() => this.props.navigation.navigate('Midia', {event, data})}/>
                                    )
                                })
                            :
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 30}}>
                                    <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Nenhum evento encontrado</Text>
                                </View>
                        }
                    </View>
                </ScrollView>
                <Menu screen={{width, height, isPortrait}} user={data} resetView={(screen) => this.props.navigation.dispatch(screen)} changeView={(screen, data) => this.props.navigation.navigate(screen, data)} overlayPos={this.state.overlayPos} handleOverlay={this.handleOverlayActivation}/>
                {
                    data.account_type === "admin" || data.account_type === "mentor" ?
                        <AddButton handleOverlay={this.handleOverlay} buttonY={this.state.buttonY} />
                    :
                        null
                }
                <Modal 
                    label="Criar evento" 
                    text="Insira o nome do evento"
                    left={{ leftFunc: () => null, leftLabel: "Cancelar" }} 
                    right={{ rightFunc: () => this.createEvent(), rightLabel: "Confirmar" }}
                    forminput={{placeholder: "Nome"}}
                    handleInput={this.handlePortInput}
                    opacity={{
                        isActivated: overlayModalActivated, 
                        handleOverlay
                    }}
                />
            </Fragment>
        );
    }

    state = { 
        overlayActivated: false,
        overlayModalActivated: false,
        overlayOpacity: new Animated.Value(0),
        overlayModalOpacity: new Animated.Value(0),
        buttonY: new Animated.Value(0),
        overlayPos: new Animated.Value(-width - 100),
        event_data: [],
        portfolioName: '',
        loadingEvents: false,
        status: this.props.navigation.state.params.data.account_type === "admin" ? "pendente" : "agendado",
    }

    changeStatus = (status) => this.setState({...this.state, status})

    handleOverlayActivation = () => {
        let { overlayActivated } = this.state
        this.setState({overlayActivated: !overlayActivated})

        Animated.timing(this.state.overlayPos, {
            toValue: overlayActivated ? -this.state.width : 0,
            duration: 240,
            useNativeDriver: true,
        }).start()

        Animated.spring(this.state.buttonY, {
            toValue: overlayActivated ? 0 : 100,
            duration: 120,
            useNativeDriver: true,
        }).start()
    }

    componentDidMount() {
        const { params } = this.props.navigation.state
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        this.setState({...this.state, event_data: params.event_data ? params.event_data : []})
    }

    componentWillUnmount = () => this.backHandler.remove()

    handleBackPress = () => {
        let { overlayModalActivated } = this.state

        if (overlayModalActivated) {
            this.handleOverlay()
            return true;
        }
        return false;
    }

    handleOverlay = (e) => {
        let { overlayActivated, overlayModalActivated } = this.state

        this.setState({overlayModalActivated: !overlayModalActivated, overlayActivated: !overlayActivated})

        Animated.spring(this.state.buttonY, {
            toValue: overlayActivated ? 0 : 100,
            duration: 120,
            useNativeDriver: true,
        }).start()
    }

    handlePortInput = (text) => this.setState({...this.state, portfolioName: text})

    handleSearch = (text) => {
        const { params } = this.props.navigation.state

        this.setState({
            ...this.state,
            event_data: params.event_data.filter(({name}) => {
                let _name = name ? name : ""
                return _name.toLowerCase().includes(text.toLowerCase())
            })
        })
    }

    createEvent = () => {
        const { portfolioName } = this.state
        const { id } = this.props.navigation.state.params.data
        
        createEvent(id, portfolioName)
            .then(res => this.setState({...this.state, event_data: [res, ...this.state.event_data]}))
    }
}