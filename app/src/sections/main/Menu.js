import React from 'react';
import { View, Image, Animated, Text, TouchableWithoutFeedback, ScrollView, useState } from 'react-native';
import style from './style'
import mainStyle from '../style'
import Close from '../../assets/close.png'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';

import Placeholder from '../../assets/profile.png'

const { overlay, textTop, textBottom, textFont } = style
const { size } = mainStyle 
const imageUrlRd = Math.random()

export default Menu = ({handleOverlay, screen, changeView, overlayPos, user, resetView}) => {
    const removeCurrentData = async () => {
        await AsyncStorage.removeItem('user')
        await AsyncStorage.removeItem('token')

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        
        return resetView(resetAction)
    }
    
    return(
        <Animated.View style={[overlay, {transform: [{translateX: overlayPos}], width: screen.width, height: screen.height}]}>
            <TouchableWithoutFeedback onPress={handleOverlay}><Image source={Close} style={[size(32,32), {position: 'absolute', top: 9.5, left: 13.5}]}></Image></TouchableWithoutFeedback>
            <View style={{alignItems: 'center', flexDirection: screen.isPortrait ? 'column' : "row"}}>
                <View style={{flexDirection: "column", alignItems: 'center'}}>
                    <TouchableWithoutFeedback onPress={() => {changeView('Profile', user); handleOverlay()}}>
                        <View style={[size(130, 130), {borderRadius: 150, overflow: "hidden", backgroundColor: "#eee"}]}>
                            <Image source={user.avatar_name ? {uri: `http://18.228.199.251:5000/static/${user.avatar_name}?${Math.random()}`} : Placeholder} style={[size(130, 130)]}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => {changeView('Profile', user); handleOverlay()}}>
                        <Text style={[textTop, textFont]}>{user.name}</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{alignItems: 'center', marginLeft: screen.isPortrait ? 0 : 40}}>
                    <TouchableWithoutFeedback onPress={() => changeView('Portfolios')}><Text style={[textBottom, textFont, {marginTop: screen.isPortrait ? 30 : 0}]}>Portfólios</Text></TouchableWithoutFeedback>
                    {
                        user.account_type === "client" ? 
                            <TouchableWithoutFeedback onPress={() => changeView('AskEvent', {selectedSet: [], id: user.id})}><Text style={[textBottom, textFont]}>Solicitar cobertura de evento</Text></TouchableWithoutFeedback>
                        :   
                            null
                    }
                    {
                        user.account_type === "admin" ?
                            <TouchableWithoutFeedback onPress={() => changeView('Admins', { id: user.id, account_type: user.account_type })}><Text style={[textBottom, textFont]}>Gerenciar administradores</Text></TouchableWithoutFeedback>
                        :
                            null 
                    }
                    {
                        user.account_type === "admin" || user.account_type === "mentor" ?
                            <TouchableWithoutFeedback onPress={() => changeView('Pros', { id: user.id, account_type: user.account_type })}><Text style={[textBottom, textFont]}>Gerenciar profissionais</Text></TouchableWithoutFeedback>
                        :
                            null
                    }
                    {
                        user.account_type === 'admin' ?
                            <TouchableWithoutFeedback onPress={() => changeView('ClientNav', { id: user.id, account_type: user.account_type })}><Text style={[textBottom, textFont]}>Gerenciar clientes</Text></TouchableWithoutFeedback>
                        :
                            null
                    }
                    <TouchableWithoutFeedback onPress={removeCurrentData}><Text style={[textBottom, textFont, { marginBottom: 28 }]}>Sair</Text></TouchableWithoutFeedback>
                </View>
            </View>
        </Animated.View>
    )
}