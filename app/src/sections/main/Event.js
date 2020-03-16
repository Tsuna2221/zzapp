import React, { Component } from 'react';
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import style from './style'
import mainStyle from '../style'
import EventCell from './EventCell'

//Assets
import Arrow from '../../assets/arrow-right.png'

const { eventText } = style
const { size } = mainStyle

export default EventContainer = ({changeView, event, updateEvent}) => (
    <TouchableWithoutFeedback onPress={changeView}>
        <View style={{paddingHorizontal: 14}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 22}}>
                <Text style={[eventText, {color: event.name ? "#000" : "#bfbdc5"}]}>{event.name ? event.name : "(Sem Nome)"}</Text>
                <Image source={Arrow} style={size(23, 23)}></Image>
            </View>
            <EventCell images={event.images}/>
        </View>
    </TouchableWithoutFeedback>
);