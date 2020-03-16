import React, { Component, Fragment } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Components
import { ManageHeader } from '../etc/Headers'
import EventContainer from '../main/Event'

import { getPortfolios } from '../client'

export default class Portfolios extends Component {
    render() {
        const { state: { loadingEvents, data, events }, props: { navigation: { goBack, navigate } } } = this

        return (
            <Fragment>
                <ManageHeader name="Portfólios" changeView={() => goBack()}/>
                <ScrollView>
                    {
                        loadingEvents ?
                            <ActivityIndicator style={{marginTop: 14}} animating={true} size="large" color="#CB6026"/>
                        :
                            <View>
                                {
                                    events.length > 0 ?
                                        events.sort((a, b) => b.id - a.id).map(event => {
                                            return (
                                                <EventContainer key={event.id} event={event} changeView={() => navigate('Gallery', {event, data})}/>
                                            )
                                        })
                                    :
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 30}}>
                                            <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Nenhum portfólio encontrado</Text>
                                        </View>
                                }
                            </View>
                    }
                </ScrollView>
            </Fragment>
        );
    }

    state = { 
        loadingEvents: true,
        events: [],
        data: {}
    }

    componentDidMount = async () => {
        const user = await AsyncStorage.getItem('user'), { data } = JSON.parse(user)

        getPortfolios().then(events => this.setState({...this.state, events, data, loadingEvents: false}))
    }
}