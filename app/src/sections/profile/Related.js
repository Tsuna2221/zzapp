import React, { Component } from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

//Partials
import { parsedDate } from '../partials'

//Styles
import style from './style'

const { itemContainer, topText, bottomText, mainContainer, buttonContainer } = style

export default class Rating extends Component {
    render() {
        const { navigate, event, data, dispatch } = this.props
        const { created_at, name, current_status } = this.props.event
        const { fullDate, hoursString } = parsedDate(created_at)
        return (
            <View style={{alignItems: 'center'}}>
                <View style={mainContainer}>
                    <View style={itemContainer}>
                        <Text style={[topText, {color: name ? "#000" : "#bfbdc5" }]}>{name ? name : "(Sem Nome)"}</Text>
                        <Text style={bottomText}>Criado em {fullDate} às {hoursString}</Text>
            
                        <View style={[buttonContainer, {alignItems: 'center'}]}>
                            <Text style={bottomText}>Evento {current_status === "ongoing" ? "em andamento" : "concluído"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}