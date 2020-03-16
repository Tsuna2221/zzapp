import React from 'react';
import { Image, TouchableWithoutFeedback, Animated } from 'react-native';
import style from './style'

//Assets
import PlusSign from '../../assets/plus.png'

const { size } = mainStyle
const { floatButton } = style

export default AddButton = ({buttonY, handleOverlay}) => (
    <TouchableWithoutFeedback onPress={handleOverlay}>
        <Animated.View style={[size(63, 63), floatButton, {transform: [{translateY: buttonY}]}]}>
            <Image source={PlusSign} style={[size(32, 32)]}></Image>     
        </Animated.View>
    </TouchableWithoutFeedback>
);