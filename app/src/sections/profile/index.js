import React, { Component, Fragment, useEffect, useState } from 'react';
import { Text, ScrollView, ActivityIndicator } from 'react-native';
import style from './style'
import AsyncStorage from '@react-native-community/async-storage';

//Components
import { ProfileHeader } from '../etc/Headers'
import Images from './images'
import Rating from './rating'
import Related from './Related'

//Client
import { getEvents } from  '../client'

const { secText } = style

export default class Profile extends Component {
    render(){
        const {navigation: { goBack, navigate, dispatch, state: { params } }} = this.props
        const { currentUser: { data }, events, loading } = this.state
        const ratingAvailable = ['client', 'admin']

        return(
            <Fragment>
                <ProfileHeader text={params.name} editAvailable={data.id === params.id || data.account_type === "admin" || data.id === params.mentor_id} editProfile={() => navigate('Edit', {...params, data})} changeView={() => goBack()}/>
                <ScrollView>
                    <Images editAvailable={data.id === params.id} id={params.id} avatar_name={params.avatar_name} banner_name={params.banner_name}/>
                    {
                        !ratingAvailable.includes(params.account_type) ?
                            <Rating ratings={params.ratings}/>
                        :
                            null
                    }
                    {
                        !loading ?
                            events.length > 0 ?
                                <Fragment>
                                    <Text style={secText}>Eventos relacionados</Text>
                                    {
                                        events.filter(({current_status}) => current_status !== "rejeitado").map(event => <Related dispatch={dispatch} navigate={navigate} data={data} key={event.id} event={event}/>)
                                    }
                                </Fragment>
                            :
                                null
                        :
                            <ActivityIndicator style={{marginTop: 13}} animating={true} size="large" color="#CB6026"/>
                    }
                </ScrollView>
            </Fragment>
        );
    }

    state = {
        currentUser: {data: {}},
        events: [],
        loading: true
    }

    componentDidMount = async () => {
        const { id } = this.props.navigation.state.params
        const user = await AsyncStorage.getItem('user')
        const data = JSON.parse(user)

        getEvents(id).then((events) => {
            this.setState({...this.state, currentUser: data, events, loading: false})
        })
    }
}