import React, { Component } from 'react';
import { View, BackHandler, TextInput, Text, ScrollView, Animated, Modal, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import TextInputMask from 'react-native-text-input-mask';

import style from './style'
import mainStyle from '../style'

const { modalContainer, textTop, textBottom, buttonsContainer, button, buttonText, input } = style
const { size } = mainStyle

export default class MModal extends Component {
    render(){
        const { handleInput, label, text, forminput, left: {leftLabel, leftFunc}, right: {rightLabel, rightFunc}, opacity: { isActivated, handleOverlay }} = this.props
        return (
            <Modal onRequestClose={() => this.handlePress()} visible={isActivated} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={handleOverlay}>
                <View style={[size('100%', '100%'), modalContainer]}>
                    <View name='view' style={[size(270, forminput ? 180 : 140), {backgroundColor: "#fff", borderRadius: 10}]}>
                        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: "100%"}}>
                            <View style={{marginTop: 17}}>
                                <Text style={textTop}>{label}</Text>
                                <Text style={textBottom}>{text}</Text>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                {
                                    forminput ? 
                                        forminput.placeholder === 'CPF' || forminput.placeholder === 'RG' ? 
                                            <TextInputMask 
                                                mask={forminput.placeholder === "CPF" ? "[000].[000].[000]-[00]": "[00].[000].[000]-[-]"}
                                                onChangeText={(ext, text) => handleInput(text, forminput.placeholder === "CPF" ? 'cpf' : 'rg')} 
                                                keyboardType={forminput.placeholder === "CPF" ? "number-pad" : 'default'}
                                                placeholderTextColor="#8190A5" 
                                                autoCaptalize="characters"
                                                placeholder={forminput.placeholder} 
                                                style={[input, {textTransform: "uppercase"}]}
                                            />
                                        :
                                            <TextInputMask 
                                                onChangeText={(text) => handleInput(text)} 
                                                placeholderTextColor="#8190A5" 
                                                placeholder={forminput.placeholder} 
                                                style={input}
                                            />
                                    :
                                        null
                                }
                                <View style={buttonsContainer}>
                                    <TouchableNativeFeedback onPress={() => { leftFunc(); return forminput ? forminput.placeholder === "CPF" ? null : handleOverlay() : handleOverlay() }}><View style={[button, {borderRightWidth: 0.5}]}>
                                        <Text style={buttonText}>{leftLabel}</Text>
                                    </View></TouchableNativeFeedback>

                                    <TouchableNativeFeedback onPress={() => { rightFunc(); return forminput ? forminput.placeholder === "CPF" ? null : handleOverlay() : handleOverlay() }}><View style={[button]}>
                                        <Text style={buttonText}>{rightLabel}</Text>
                                    </View></TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    handlePress = () => {
        const { placeholderUpdate, forminput, opacity: { isActivated, handleOverlay }} = this.props
        if(isActivated){
            if(forminput && forminput.placeholder === "RG"){
                placeholderUpdate()
                return true;
            }else{
                handleOverlay()
                return true;
            }
        }
        return false
    }
}