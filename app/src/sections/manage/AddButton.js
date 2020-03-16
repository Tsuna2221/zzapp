import React, { Component } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, TouchableNativeFeedback } from 'react-native';
import style from './style'

const { addButton, secondaryButton } = style

export default AddButton = ({func, label, style}) => (
    <TouchableNativeFeedback onPress={func}>
        <View style={[addButton, style]}>
            <Text style={secondaryButton}>{label}</Text>
        </View>
    </TouchableNativeFeedback>
)