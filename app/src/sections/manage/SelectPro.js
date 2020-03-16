import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import style from '../login/style'
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';

import { ManageHeader } from '../etc/Headers'
import { getUsersBy } from '../client'

import Placeholder from '../../assets/profile.png'

const { size } = mainStyle
const {  } = style

export default class SelectPro extends Component {
    render() {
        const { isLoading, userList } = this.state
        const { goBack, navigate } = this.props.navigation
        const { value, type, label } = this.props.navigation.state.params

        return (
            <Fragment>
                <ManageHeader name={label} changeView={() => goBack()}/>
                <ScrollView>
                    {
                        isLoading ? 
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                        :
                            userList.map(({ name, avatar_name, id }) => (
                                <TouchableNativeFeedback 
                                    key={id} 
                                    onPress={() => navigate('SetPros', {[type]: {name, id}})}
                                >
                                    <View style={{flexDirection: "row", paddingVertical: 7, paddingHorizontal: 15, alignItems: 'center', borderBottomColor: '#D2DAE6', borderBottomWidth: 0.5}}>
                                        <Image style={[size(55, 55), {borderRadius: 150}]} source={avatar_name ? {uri: `http://18.228.199.251:5000/static/${avatar_name}`} : Placeholder}></Image>
                                        <Text style={{marginLeft: 15, fontFamily: 'Lato', color: '#47525E', fontSize: 16}}>{name}</Text>
                                    </View>                    
                                </TouchableNativeFeedback>
                            ))
                    }
                </ScrollView>
            </Fragment>
        );
    }

    state = {
        isLoading: true,
        userList: []
    }

    componentDidMount() {
        let { value, type } = this.props.navigation.state.params
        AsyncStorage.getItem("user").then((data) => {
            let res = JSON.parse(data)

            getUsersBy(res.data.id, 'pro')
                .then(data => {
                    const filteredData = data.filter(({status, services}) => {
                        if(status === "approved" && services){
                            if(JSON.parse(services).includes(value)){
                                return true
                            }
                        }
                    })
                    this.setState({isLoading: false, userList: filteredData, userCopy: filteredData})
                })
        })

    }

}