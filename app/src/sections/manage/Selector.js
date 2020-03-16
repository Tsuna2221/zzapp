import React from 'react';
import { View, Image, Text, TouchableNativeFeedback } from 'react-native';
import style from './style'
import mainStyle from '../style'

import Arrow from '../../assets/arrow-right.png'

const { itemContainer, itemText } = style
const { size } = mainStyle

export default Selector = ({onPress, label}) => (
    <TouchableNativeFeedback onPress={() => onPress()}>
        <View style={itemContainer}>
            <Text style={itemText}>{label}</Text>
            <Image style={[size(16, 16)]} source={Arrow}></Image>
        </View>
    </TouchableNativeFeedback>
);