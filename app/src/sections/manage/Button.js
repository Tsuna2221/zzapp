import React, { Fragment } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, TouchableNativeFeedback } from 'react-native';
import style from './style'

const { button, buttonText } = style

export default Button = ({style, label, func}) => (
    <TouchableNativeFeedback onPress={func}>
        <View style={[button, style]}>
            <Text style={buttonText}>{label}</Text>
        </View>
    </TouchableNativeFeedback>
);