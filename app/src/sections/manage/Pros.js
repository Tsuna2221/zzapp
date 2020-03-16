import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import MModal from '../modals'

import { getUsersBy, deleteUser } from '../client'

import mainStyle from '../style'
import { ManageHeader } from '../etc/Headers'
import PersonCell from './PersonCell'
import AddButton from '../event/AddButton'

const { floater } = mainStyle

export default class Pros extends Component {
    render() {
        const { isLoading, prosList, modalActivated } = this.state
        const { navigate, state: { params: { account_type, id } } } = this.props.navigation

        return (
            <Fragment>
                <NavigationEvents
                    onDidFocus={() => {
                        return this.updateUsers(id)
                }}/>
                <ManageHeader name="Gerenciar profissionais" changeView={() => navigate('Main')}/>
                <ScrollView contentContainerStyle={{paddingBottom: 55}}>
                    <SearchBar handleInput={this.handleSearch} lowMargin placeholder="Buscar profissional"/>
                    {
                        isLoading ? 
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                        :
                            prosList.length > 0 ? 
                                prosList.map((user) => (
                                    <PersonCell currentUser={{ account_type, id }} handleOverlay={this.handleOverlay} changeView={(data) => navigate('Profile', data)} key={user.id} type='pro' user={user}/>
                                ))
                            :
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                    <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Nenhum profissional encontrado</Text>
                                </View>
                    }
                </ScrollView>
                {
                    account_type === "admin" ?
                        <View style={floater}>
                            <AddButton func={() => navigate('Create', { 
                                id, 
                                text: "Profissional",
                                type: "mentor"
                            })} label="+Profissional" style={{margin: 10}}/>
                        </View>
                    :
                        null
                }
                <MModal 
                    label="Excluir Profissional" 
                    text="Tem certeza que deseja excluir este usuário?" 
                    left={{ leftFunc: () => null, leftLabel: "Não" }} 
                    right={{ rightFunc: () => this.removeUser(), rightLabel: "Sim" }}
                    opacity={{
                        isActivated: modalActivated, 
                        handleOverlay: this.handleOverlay
                    }}
                />
            </Fragment>
        );
    }

    state = {
        isLoading: true,
        prosList: [],
        prosCopy: [],
        modalActivated: false,
        selectedUser: 0
    }

    updateUsers = (id) => getUsersBy(id, 'pro')
        .then(data => this.setState({isLoading: false, prosList: data, prosCopy: data}))
        .catch(({response: { data: { data: { msg }}, status} }) => {
            Toast.show(msg, Toast.LONG)
            this.setState({isLoading: false})
        })

    handleOverlay = (id) => this.setState({...this.state, modalActivated: !this.state.modalActivated, selectedUser: id ? id : 0})

    handleSearch = (text) => this.setState({...this.state, prosList: this.state.prosCopy.filter(({name}) => name.toLowerCase().includes(text.toLowerCase()))})

    removeUser = () => {
        const { selectedUser, prosList } = this.state
        const { id } = this.props.navigation.state.params

        return deleteUser(id, selectedUser).then(() => this.setState({
            ...this.state,
            prosList: prosList.filter(({id}) => id !== selectedUser)
        }))
    }
}