import React from 'react';
import { View, Image, Text, TouchableNativeFeedback } from 'react-native';
import style from './style'
import mainStyle from '../style'

import Arrow from '../../assets/arrow-right.png'

const { itemContainer, itemText } = style
const { size } = mainStyle

export default GoTo = ({onPress, selection, params, label}) => (
    <TouchableNativeFeedback onPress={onPress}>
        <View style={itemContainer}>
            <Text style={[itemText, params ? params[selection] ? {color: "#000"} : null : null]}>
                {params ? params[selection] ? "Selecionado: " + params[selection].label : label : label}
            </Text>
            <Image style={[size(16, 16)]} source={Arrow}></Image>
        </View>
    </TouchableNativeFeedback>
);