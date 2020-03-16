import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { getUsersBy } from '../client'

import { ManageHeader } from '../etc/Headers'
import PersonCell from './PersonCell'

import style from './style'

const {  } = style

export default class Clients extends Component {
    render() {
        const { isLoading, clientList } = this.state
        const { navigate } = this.props.navigation

        return (
            <Fragment>
                <ManageHeader name="Gerenciar clientes" changeView={() => navigate('Main')}/>
                <ScrollView contentContainerStyle={{paddingBottom: 55}}>
                    <SearchBar handleInput={this.handleSearch} lowMargin placeholder="Buscar cliente"/>
                    {
                        isLoading ? 
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                        :
                            clientList.length > 0 ? 
                                clientList.map(user => (
                                    <PersonCell changeView={(data) => navigate('Profile', data)} key={user.id} type='client' user={user}/>
                                ))
                            :
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                    <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Nenhum cliente encontrado</Text>
                                </View>
                    }
                </ScrollView>
            </Fragment>
        );
    }

    state = {
        isLoading: true,
        clientList: [],
        clientCopy: []
    }

    componentDidMount() {
        const { navigate, state: { params: { id } } } = this.props.navigation

        getUsersBy(id, 'client')
            .then(data => this.setState({isLoading: false, clientList: data, clientCopy: data}))
            .catch(({response: { data: { data: { msg }}, status} }) => {
                Toast.show(msg, Toast.LONG)
                this.setState({isLoading: false})
            })
    }

    handleSearch = (text) => this.setState({...this.state, clientList: this.state.clientCopy.filter(({name}) => name.toLowerCase().includes(text.toLowerCase()))})
}