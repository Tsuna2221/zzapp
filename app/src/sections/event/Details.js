import React, { Component, Fragment } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Image, Text, ScrollView, Animated, Dimensions, Modal, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob'
import { NavigationEvents } from 'react-navigation';
import Toast from 'react-native-simple-toast';

//Styles
import style from './style'
import mainStyle from '../style'

//Components
import MModal from '../modals'
import { EventHeader } from '../etc/Headers'
import Pros from './Pros'
import Clients from './Clients'
import Stats from './Stats'
import AddButton from './AddButton'
import Request from './Request'

//Client
import { uploadData, updateEvent, getEventRequest, updateRequest } from '../client'

//Partials
import { sectionValues } from '../partials'

const { size } = mainStyle
const { type, duration, level, result } = sectionValues

export default class Informações extends Component {
    render() { 
        const { getImage, handleOverlay, state: { eventName, isActivated, currentId, currentType, isLoading, canDelete, loadingText, event, acceptActive, rejectActive }, props: { navigation: { navigate } } } = this
        const validUser = currentType === "admin" || currentId === event.created_by

        if(event.request){
            const _type = type.filter(({label}) => label === event.request.type)[0]
            const _duration = duration.filter(({value}) => value === event.request.duration)[0]
            const _level = level.filter(({label}) => label === event.request.level)[0]
            const _result = result.filter(({label}) => label === event.request.result)[0]
    
            var requestData = {
                selectedType: {
                    label: _type.label,
                    value: _type.value
                },
                selectedLevel: {
                    label: _level.label,
                    value: _level.value
                },
                selectedDuration: {
                    label: _duration.label,
                    value: _duration.value
                },
                selectedResult: {
                    label: _result.label,
                    value: _result.value
                }
            }
        }else{
            var requestData = {}
        }
        
        return (
            event ? 
                <Fragment>
                    <NavigationEvents
                        onDidFocus={(payload) => {
                            var { action: { type } } = payload

                            if(payload.state.params){
                                const { event, updatePros } = payload.state.params
                                if(updatePros){
                                    this.setState({...this.state, isLoading: true})

                                    this.props.navigation.setParams({updatePros: false})
                                    return this.setState({...this.state, isLoading: false, event})
                                }
                            }else if(type === "Navigation/COMPLETE_TRANSITION"){
                                this.setState({...this.state, isLoading: true})
                                const { id } = this.props.navigation.dangerouslyGetParent().state.routes[0].params.data
                                const { event } = this.state

                                getEventRequest(id, event.id).then((request) => {
                                    let eventCopy = {...this.state.event}

                                    eventCopy = {...eventCopy, ...request}
                                    this.setState({...this.state, event: eventCopy, isLoading: false})
                                })
                            }
                        }}
                    />
                    <Modal visible={isLoading} transparent={true} animationType="fade">
                        <View style={[size("100%", "100%"), {backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center'}]}>
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                            <Text style={{color: "#fff", fontFamily: 'Roboto-Medium', fontSize: 17, marginTop: 10}}>{loadingText}</Text>
                        </View>    
                    </Modal>
                    <EventHeader isAvailable={validUser} trashEvent={this.handleDeletion} text={this.state.event.name} changeView={() => this.props.navigation.goBack()}/>
                    <ScrollView style={{flex: 1}}>
                        <Pros event={this.state.event.id} canDelete={canDelete} deleteUser={this.deleteEventData} pros={this.state.event.related.pros} changeView={(data) => navigate('Profile', data)}/>
                        <Clients event={this.state.event.id} canDelete={canDelete} deleteUser={this.deleteEventData} clients={this.state.event.related.clients} changeView={(data) => navigate('Profile', data)}/>
                        <Stats isAdmin={validUser} update={this.updateEventStatus} status={event.current_status} createdAt={this.state.event.created_at} proLength={this.state.event.related.pros.length} clientLength={this.state.event.related.clients.length} images={this.state.event.images}/>
                        {
                            event.request ?
                                <Request isAdmin={validUser} name={this.state.event.name} request={event.request}/>
                            :
                                null
                        }
                        
                    </ScrollView>
                    <View style={{flexDirection: 'row', position: 'absolute', bottom: 14, right: 14, left: 14}}>
                        {
                            validUser && event.current_status === "fechado" ?
                                <AddButton func={getImage} label="+Mídia" style={{marginRight: 6}}/>
                            :
                                null
                        }
                        {
                            validUser && event.current_status === "fechado" || event.current_status === "agendado" ?
                                <AddButton func={handleOverlay} label="+Membros" style={{marginRight: 6}}/>
                            :
                                null
                        }
                        {
                            validUser && event.current_status !== "portfolio" ?
                                <AddButton func={event.current_status === "pendente" ? () => this.toggleStatusModal("accept") : () => this.updateEventStatus()} label={event.current_status === "pendente" ? "Aceitar solicitação" : `Marcar como ${event.current_status === "agendado" ? "fechado" : event.current_status === "fechado" ? "portfólio" : ""}` } style={{marginRight: 6}}/>
                            :
                                null
                        }
                        {
                            validUser && event.current_status === 'pendente' ?
                                <AddButton func={() => this.toggleStatusModal("reject")} label="Rejeitar Solicitação" style={{marginRight: 6}}/>
                            :
                                null
                        }
                        {
                            validUser && event.current_status === "agendado" ?
                                <AddButton func={() => navigate('AskEvent', 
                                    event.request ?
                                        { 
                                            fromDetails: event.request.id, 
                                            eventId: event.id, 
                                            selectedSet: event.request.set, 
                                            id: currentId, ...requestData, 
                                            date: event.request.date, 
                                            hour: event.request.hour 
                                        }
                                    :
                                        { 
                                            fromDetails: null, 
                                            eventId: event.id, 
                                            selectedSet: [], 
                                            id: currentId, ...requestData, 
                                            date: '', 
                                            hour: ''
                                        }
                                )} label="Atualizar" style={{marginRight: 6}}/>
                            :
                                null
                        }
                    
                    </View>
                    <MModal
                        label="Adicionar Usuário"
                        text="Selecione o tipo de usuário"
                        left={{ leftFunc: () => navigate('UserSelect', { eventId: this.state.event.id, id: currentId, userType: 'client', navigateTo: 'Event', headerText: "Selecione um cliente", exec: this.updateEventData}), leftLabel: "Cliente" }} 
                        right={{ rightFunc: () => {
                            if(event.request){
                                this.props.navigation.navigate("SetPros", { request: event.request, name: event.name, fromDetails: true, eventId: event.id })
                            }else{
                                Toast.show("Adicione uma solicitação para atualizar profissionais", Toast.LONG);
                            }
                        }, rightLabel: 'Profissional' }}
                        opacity={{
                            isActivated, 
                            handleOverlay
                        }}
                    />
                    <MModal
                        label="Nome do evento"
                        handleInput={this.handleInput} 
                        text="Insira o nome do evento"
                        left={{ leftFunc: () => null, leftLabel: "Cancelar" }} 
                        right={{ rightFunc: eventName.length !== 0 ? () => {
                            navigate('SetPros', { fromDetails: true, name: eventName, eventId: event.id, request: event.request })
                        } : null, rightLabel: 'Confirmar' }}
                        forminput={{placeholder: "Nome do evento"}}
                        opacity={{
                            isActivated: acceptActive, 
                            handleOverlay: () => this.toggleStatusModal("accept")
                        }}
                    />
                    <MModal
                        label="Rejeitar Solicitação"
                        text="Tem certeza que deseja rejeitar esta solicitação"
                        left={{ leftFunc: () => null, leftLabel: "Não" }} 
                        right={{ rightFunc: () => {
                            updateEvent(this.state.event.id, { status: "rejeitado" })
                                .then(() => updateRequest(this.state.currentId, event.request.id, "rejected")
                                .then(() => navigate('Main', { updated: true })))
                                
                        }, rightLabel: 'Sim' }}
                        opacity={{
                            isActivated: rejectActive, 
                            handleOverlay: () => this.toggleStatusModal("reject")
                        }}
                    />
                </Fragment>
            :
                null
        );
    }

    state = {
        isActivated: false, 
        currentId: 0,
        isLoading: false,
        canDelete: false,
        fileList: [],
        loadingText: "",
        event: this.props.navigation.dangerouslyGetParent().state.routes[0].params.event,
        acceptActive: false,
        rejectActive: false,
        eventName: "",
        currentType: this.props.navigation.dangerouslyGetParent().state.routes[0].params.data.account_type,
        currentId: this.props.navigation.dangerouslyGetParent().state.routes[0].params.data.id
    }

    toggleStatusModal = (status) => this.setState({...this.state, [status + "Active"]: !this.state[status + "Active"]}) 

    handleInput = (value) => this.setState({...this.state, eventName: value}) 

    updateEventStatus = () => {
        this.setState({...this.state, isLoading: true, loadingText: "Atualizando evento..."})
        const eventCopy = {...this.state.event}, updatable = eventCopy.current_status === "agendado" ? "fechado" : "portfolio"
        eventCopy.current_status = updatable

        if(!this.state.event.request){
            Toast.show("Adicione uma solicitação para atualizar o evento", Toast.LONG);
            this.setState({...this.state, isLoading: false})
        }else{
            if(updatable === "fechado" && eventCopy.related.pros.length === 0){
                Toast.show("Adicione profissionais para atualizar o evento", Toast.LONG); 
                this.setState({...this.state, isLoading: false})
            }else{
                updateEvent(eventCopy.id, { status: updatable }).then(() => {
                    this.setState({...this.state, event: eventCopy, isLoading: false, loadingText: "Sucesso!"})
                }).catch(() => this.setState({...this.state, isLoading: false}))
            }
        }
    }

    handleDeletion = () => this.setState({...this.state, canDelete: !this.state.canDelete})

    handleOverlay = () => this.setState({isActivated: !this.state.isActivated})

    componentDidMount = async () => {
        const value = await AsyncStorage.getItem('user')
        const { data } = JSON.parse(value)
        const { event } = this.props.navigation.dangerouslyGetParent().state.routes[0].params

        if(event.related.clients.length === 0){
            return this.props.navigation.navigate('UserSelect', { 
                eventId: event.id, 
                id: data.id, 
                userType: 'client', 
                navigateTo: 'Event', 
                headerText: "Selecione um cliente",
                exec: this.updateEventData,
                required: true
            })
        }
        
        this.setState({
            ...this.state, 
            currentId: data.id,
            currentType: data.account_type,
            currentStatus: data.status
        })
    }

    getImage = () => {
        const config = {
            multiple: true
        }

        ImagePicker.openPicker(config).then((image) => {
            this.setState({...this.state, isLoading: true, loadingText: "Carregando mídias..."})
            const returnList = async () => {
                let fileList = []

                for(let i in image){
                    await RNFetchBlob.fs.readFile(image[i].path, 'base64')
                    .then((data) => {
                        fileList.push({base: data, image: image[i]})
                    })
                }

                return fileList;
            }
            
            returnList().then(res => {
                this.setState({...this.state, loadingText: "Enviando mídias..."})
                
                uploadData("event", this.state.event.id, res)
                    .then((res) => {
                        this.props.navigation.navigate("Midia", { newData: res })
                        this.setState({...this.state, isLoading: false, loadingText: "Sucesso!"})
                    })
                    .catch(({response}) => this.setState({...this.state, isLoading: false}))  
            })
        })
        .catch((err) => {
            this.setState({...this.state, isLoading: false})
        })
    }

    updateEventData = (name, new_id, userType, eventId) => {
        const { clients, pros } = this.state.event.related
        const currentEvent = this.state.event

        if(userType === "client"){
            const idArray = clients.map(({id}) => id)
            idArray.includes(new_id) ? null : idArray.push(new_id)

            updateEvent(eventId, {related_clients: idArray})
                .then(users => {
                    currentEvent.related.clients = users

                    this.setState({...this.state, event: currentEvent})
                })
        }else{
            const idArray = pros.map(({id}) => id)
            idArray.includes(new_id) ? null : idArray.push(new_id)

            updateEvent(eventId, {related_pros: idArray})
                .then(users => {
                    currentEvent.related.pros = users

                    this.setState({...this.state, event: currentEvent})
                })
        }
    }

    deleteEventData = ( old_id, userType, eventId ) => {
        const { clients, pros } = this.state.event.related
        const currentEvent = this.state.event

        if(userType === "client"){
            const idArray = clients.map(({id}) => id).filter((id) => id !== old_id)

            updateEvent(eventId, {related_clients: idArray})
                .then(users => {
                    currentEvent.related.clients = users

                    this.setState({...this.state, event: currentEvent})
                })
        }else{
            const idArray = pros.map(({id}) => id).filter((id) => id !== old_id)

            updateEvent(eventId, {related_pros: idArray})
                .then(users => {
                    currentEvent.related.pros = users

                    this.setState({...this.state, event: currentEvent})
                })
        }
    }
}