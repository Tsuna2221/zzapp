import React, { Component } from 'react';
import { TouchableNativeFeedback, View, Text } from 'react-native';

import style from './style'

const { buttonEnter, buttonCreate, textEnter, textCreate } = style

export default Button = ({ value, event, type, btnStyle }) => (
    <TouchableNativeFeedback style={type === 'create' ? { position: 'absolute', bottom: 14.5} : {}} onPress={event}>
        <View style={[type === 'enter' ? buttonEnter : buttonCreate, btnStyle]}>
            <Text style={type === 'enter' ? textEnter : textCreate}>{value}</Text>
        </View>
    </TouchableNativeFeedback>
)