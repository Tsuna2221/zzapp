import React, { Component } from 'react';
import { View, Dimensions, Animated, Image, Modal, BackHandler } from 'react-native';
import Video from 'react-native-video';
import { deleteEventData } from '../client'

import style from './style'
import mainStyle from '../style'

import { MediaHeader } from '../etc/Headers'

const {  } = style
const { size } = mainStyle
const { width, height } = Dimensions.get('window');

export default class MediaDisplay extends Component {
    render() {
        let { isActivated, handleOverlay, currentMedia, userType } = this.props

        return (
            <Modal visible={isActivated} transparent={true} animationType="fade">
                <MediaHeader isAvailable={userType === "admin"} trashEvent={this.deleteMedia} handleOverlay={() => handleOverlay({name: null, type: 'null'})}/>
                <View style={[size("100%", "100%"), {backgroundColor: '#00000099'}]}>
                    {
                        currentMedia ?
                            !currentMedia.type.includes('video') ?

                                <Image style={size("100%", "100%")} resizeMode="center" source={{uri: `http://18.228.199.251:5000/static/${currentMedia.name}`}}></Image>
                            :
                                <Video repeat controls={true} style={size("100%", "100%")} resizeMode="contain" source={{uri: `http://18.228.199.251:5000/static/${currentMedia.name}`}}/>
                        :
                            null
                    }
                </View>
            </Modal>
        );
    }

    deleteMedia = () => {
        const { userId, currentMedia: {id, name}, updateImages } = this.props

        deleteEventData(userId, id).then(() => updateImages(id))
    }
}