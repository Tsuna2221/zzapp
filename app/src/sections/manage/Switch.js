import React, { Fragment, useState } from 'react';
import { View, Image, Text, ScrollView, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import style from './style'
import mainStyle from '../style'

const { switchContainer, switchBall } = style
const { size } = mainStyle

export default Switch = ({func, state}) => {
    const [position] = useState(new Animated.Value(1));
    const [isActivated, setActive] = useState(state ? state : false);

    const handleTransform = () => {
        setActive(!isActivated)

        Animated.timing(position, {
            toValue: isActivated ? 10 : 1,
            duration: 70,
            useNativeDriver: true,
        }).start()
    }

    Animated.timing(position, {
        toValue: isActivated ? 10 : 1,
        duration: 70,
        useNativeDriver: true,
    }).start()

    return(
        <TouchableWithoutFeedback style={{padding: 6}} onPress={() => {func(); handleTransform()}}>
            <View style={[size(25.5, 16), switchContainer, {backgroundColor: isActivated ? '#47525E' : "#ddd"}]}>
                <Animated.View style={[size(12, 12), switchBall, {transform: [{translateX: position}]}]}></Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
}