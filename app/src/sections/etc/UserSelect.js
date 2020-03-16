import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import style from '../login/style'
import Toast from 'react-native-simple-toast';

import { ManageHeader } from './Headers'
import { getUsersBy, image } from '../client'
import SearchBar from './SearchBar'

import Placeholder from '../../assets/profile.png'

const { size } = mainStyle
const {  } = style

export default class UserSelect extends Component {
    render() {
        const { isLoading, userList } = this.state
        const { goBack, navigate, state: { params: { navigateTo, headerText, exec, required } } } = this.props.navigation

        return (
            <Fragment>
                <ManageHeader name={headerText} changeView={required ? () => Toast.show("Pelo menos um cliente deve ser adicionado ao evento", Toast.LONG) : () => goBack()}/>
                <SearchBar lowMargin handleInput={this.handleSearch} placeholder="Buscar usuário"/>
                <ScrollView>
                    {
                        isLoading ? 
                            <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                        :
                            userList.map(({ name, avatar_name, id }) => (
                                <TouchableNativeFeedback 
                                    key={id} 
                                    onPress={() => exec ? this.executeThenNavigate(exec, name, id).then(() => navigate(navigateTo, { name, avatar_name, id })) : navigate(navigateTo, { name, avatar_name, id })}
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

    handleSearch = (text) => {
        const { userCopy } = this.state

        this.setState({
            ...this.state,
            userList: userCopy.filter(({name}) => name.toLowerCase().includes(text.toLowerCase()))
        })
    }

    componentDidMount() {
        const { id, userType } = this.props.navigation.state.params

        getUsersBy(id, userType)
            .then(data => {
                if(userType === 'pro'){
                    const filteredData = data.filter(({status}) => status === "approved")
                    this.setState({isLoading: false, userList: filteredData, userCopy: filteredData})
                }else{
                    this.setState({isLoading: false, userList: data, userCopy: data})
                }
            })
            .catch(({response: { data: { data: { msg }}, status} }) => {
                Toast.show(msg, Toast.LONG)
                this.setState({isLoading: false})
            })
    }

    executeThenNavigate = async (exec, name, id) => {
        const { userType, eventId } = this.props.navigation.state.params
        await exec(name, id, userType, eventId)
    }
}