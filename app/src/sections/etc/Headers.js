import React from 'react';
import { View, Image, TouchableNativeFeedback, Text, Dimensions } from 'react-native';
import style from './style'
import mainStyle from '../style'

//Assets
import Menu from '../../assets/menu.png'
import MiniLogo from '../../assets/mini-logo.png'
import Arrow from '../../assets/arrow-left.png'
import Close from '../../assets/close-smooth.png'
import Edit from '../../assets/edit-gray.png'
import Trash from '../../assets/trash.png'

const { size } = mainStyle
const { headerContainer, mediaContainer } = style

const DefaultHeader = ({handleOverlay}) => (
    <View style={[headerContainer]}> 
        <TouchableNativeFeedback onPress={handleOverlay}><Image source={Menu} style={size(32,32)}></Image></TouchableNativeFeedback>
        <Image source={MiniLogo} style={size(26,26)}></Image>
    </View>
);

const ProfileHeader = ({changeView, text, editProfile, editAvailable}) => (
    <View style={[headerContainer]}> 
        <TouchableNativeFeedback onPress={changeView}><Image source={Arrow} style={size(32,32)}></Image></TouchableNativeFeedback>
        <Text style={{fontSize: 18, fontFamily: 'Roboto-Regular'}}>{text}</Text>
        <TouchableNativeFeedback onPress={editAvailable ? editProfile : null}>
            {
                editAvailable ? 
                    <Image source={Edit} style={size(24,24)}></Image>
                :
                    <View style={size(24,24)}></View>
            }
        </TouchableNativeFeedback>
    </View>
);

const EventHeader = ({changeView, text, trashEvent, isAvailable}) => (
    <View style={[headerContainer]}> 
        <TouchableNativeFeedback onPress={changeView}><Image source={Arrow} style={size(32,32)}></Image></TouchableNativeFeedback>
        <Text style={{fontSize: 18, fontFamily: 'Roboto-Regular'}}>{text}</Text>
        <TouchableNativeFeedback style={size(32,32)} onPress={() => isAvailable ? trashEvent() : null}><Image source={isAvailable ? Trash : null} style={size(32,32)}></Image></TouchableNativeFeedback>
    </View>
);

const MediaHeader = ({handleOverlay, trashEvent, isAvailable}) => (
    <View style={[mediaContainer, {zIndex: 100}]}> 
        <TouchableNativeFeedback onPress={(handleOverlay)}><Image source={Close} style={size(32,32)}></Image></TouchableNativeFeedback>
        <TouchableNativeFeedback style={size(32,32)} onPress={() => isAvailable ? trashEvent() : null}><Image source={isAvailable ? Trash : null} style={size(32,32)}></Image></TouchableNativeFeedback>
    </View>
);

const ManageHeader = ({changeView, name}) => (
    <View style={[headerContainer]}> 
        <TouchableNativeFeedback style={{zIndex: 10}} onPress={changeView}><Image source={Arrow} style={size(32,32)}></Image></TouchableNativeFeedback>
        <Text style={{fontSize: 18, fontFamily: 'Roboto-Regular'}}>{name}</Text>
        <View style={size(32,32)}></View>
    </View>
);

export { DefaultHeader, ProfileHeader, EventHeader, MediaHeader, ManageHeader };