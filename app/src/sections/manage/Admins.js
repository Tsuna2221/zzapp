import React, { Component, Fragment } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import MModal from '../modals'

import { getUsersBy, deleteUser } from '../client'

import mainStyle from '../style'
import { ManageHeader } from '../etc/Headers'
import PersonCell from './PersonCell'
import AddButton from '../event/AddButton'

const { floater } = mainStyle

export default class Admins extends Component {
    render() {
        const { isLoading, adminList, modalActivated } = this.state
        const { navigate, state: { params: { id } } } = this.props.navigation

        return (
            <Fragment>
                <NavigationEvents
                    onDidFocus={() => {
                        return this.updateUsers(id)
                }}/>
                <ManageHeader name="Gerenciar administradores" changeView={() => navigate('Main')}/>
                <ScrollView contentContainerStyle={{paddingBottom: 55}}>
                    <SearchBar handleInput={this.handleSearch} lowMargin placeholder="Buscar administrador"/>
                    {
                        isLoading ? 
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                        :
                        adminList.map((user) => (
                            <PersonCell currentId={id} handleOverlay={this.handleOverlay} changeView={(data) => navigate('Profile', data)} key={user.id} type='admin' user={user}/>
                        ))
                    }
                </ScrollView>
                <View style={floater}>
                <AddButton func={() => navigate('Create', { 
                                id, 
                                text: "Administrador",
                                type: "admin"
                            })} label="+Admin" style={{margin: 10}}/>
                </View>
                <MModal 
                    label="Excluir Administrador" 
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
        adminList: [],
        adminCopy: [],
        modalActivated: false,
        selectedUser: 0
    }

    updateUsers = (id) => getUsersBy(id, 'admin')
        .then(data => this.setState({isLoading: false, adminList: data, adminCopy: data}))
        .catch(({response: { data: { data: { msg }}, status} }) => {
            Toast.show(msg, Toast.LONG)
            this.setState({isLoading: false})
        })

    handleOverlay = (id) => this.setState({...this.state, modalActivated: !this.state.modalActivated, selectedUser: id ? id : 0})

    handleSearch = (text) => this.setState({...this.state, adminList: this.state.adminCopy.filter(({name}) => name.toLowerCase().includes(text.toLowerCase()))})

    removeUser = () => {
        const { selectedUser, adminList } = this.state
        const { id } = this.props.navigation.state.params

        return deleteUser(id, selectedUser).then(() => this.setState({
            ...this.state,
            adminList: adminList.filter(({id}) => id !== selectedUser)
        }))
    }
}