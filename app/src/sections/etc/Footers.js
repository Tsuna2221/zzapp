import React from 'react';
import { View, Image, TouchableNativeFeedback, Text, Dimensions } from 'react-native';
import style from './style'
import mainStyle from '../style'

//Assets
import Media from '../../assets/media.png'
import Info from '../../assets/info.png'

const { size } = mainStyle
const { footerContainer } = style
const { width } = Dimensions.get('window');

const EventFooter = ({changeView}) => (
    <View style={[footerContainer]}> 
        <TouchableNativeFeedback onPress={changeView}>
            <View style={{width: width / 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={[size(32, 32)]} source={Media}></Image>
                 <Text style={{fontSize: 10, color: '#8190A5'}}>Midia</Text>
            </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={changeView}>
            <View style={{width: width / 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={[size(32, 32)]} source={Info}></Image>
                 <Text style={{fontSize: 10, color: '#8190A5'}}>Informações</Text>
            </View>
        </TouchableNativeFeedback>
    </View>
);

export { EventFooter };