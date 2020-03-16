import React, { Component, Fragment } from 'react';
import { View, Image, TouchableWithoutFeedback, ActivityIndicator, Modal } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';

import { uploadData } from '../client'
import MModal from '../modals'

import style from './style'
import mainStyle from '../style'

import Edit from '../../assets/edit.png'
import EditGray from '../../assets/edit-gray.png'
import Placeholder from '../../assets/profile.png'

const { avatar, editBanner, container } = style
const { size } = mainStyle

export default class  extends Component {
    render() {
        const { props: {editAvailable, banner_name, avatar_name}, state: { isLoading, label, imageUrlRd, isLoadingUpdate } } = this
        return (
            <Fragment>
                <Modal visible={isLoadingUpdate} transparent={true} animationType="fade">
                    <View style={[size("100%", "100%"), {backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center',}]}>
                        <ActivityIndicator animating={isLoadingUpdate} size="large" color="#CB6026"/>
                    </View>    
                </Modal>
                <View style={[size("100%", 134), container, { backgroundColor: "#CB6026" }]}>
                    <Image source={{uri: `http://18.228.199.251:5000/static/${banner_name}` + "?" + imageUrlRd}} style={[size("100%", 134)]}></Image>
                    <View style={[size(105, 105), avatar, container, {borderRadius: 150, overflow: "hidden"}]}>
                        <Image source={avatar_name ? {uri: `http://18.228.199.251:5000/static/${avatar_name}` + "?" + imageUrlRd} : Placeholder} style={[size(105, 105)]}></Image>
                        {
                            editAvailable ?
                                <TouchableWithoutFeedback onPress={() => this.setModalLabel("avatar")}>
                                    <Image source={EditGray} style={[size(24, 24), {position: 'absolute'}]}></Image>
                                </TouchableWithoutFeedback>
                            :
                                null
                        }
                    </View>
                    {
                        editAvailable ? 
                            <TouchableWithoutFeedback onPress={() => this.setModalLabel("banner")}>
                                <Image source={Edit} style={[size(24, 24), editBanner]}></Image>
                            </TouchableWithoutFeedback>
                        :
                            null
                    }
                </View>
                <MModal 
                    label={label} 
                    text='Selecionar por:'
                    left={{ leftFunc: () => this.getImage('camera'), leftLabel: "Câmera" }} 
                    right={{ rightFunc: () => this.getImage('galeria'), rightLabel: "Galeria" }}
                    opacity={{
                        isActivated: isLoading, 
                        handleOverlay: this.handleOverlay
                    }}
                />
            </Fragment>
        );
    }

    state = {
        isLoadingUpdate: false,
        isLoading: false,
        label: '',
        uploadType: '',
        imageUrlRd: Math.random()
    }

    setModalLabel = (type) => {
        type === "avatar" ? 
            this.setState({
                label: 'Editar Avatar',
                uploadType: 'avatar'
            })
        :
            this.setState({
                label: 'Editar Banner',
                uploadType: 'banner'
            })

        this.handleOverlay()
    }

    getImage = (from) => {
        this.setState({...this.state, isLoadingUpdate: true, imageUrlRd: Math.random()})
        const { props: {id, banner_name, avatar_name}, state } = this
        const pickerType = from === 'camera' ? ImagePicker.openCamera : ImagePicker.openPicker
        const config = {
            includeBase64: true,
            width: state.uploadType === "avatar" ? 500 : 1125,
            height: state.uploadType === "avatar" ? 500 : 402,
            cropping: true
        }
        
        pickerType(config).then((image) => {
            uploadData(state.uploadType, id, image)
                .then(() => this.setState({...this.state, isLoadingUpdate: false, imageUrlRd: Math.random()}))
                .then(() => {
                    if(state.uploadType === "avatar" && avatar_name === null){
                        Toast.show("Reinicie o app para atualizar imagens", Toast.LONG)
                    }else if(state.uploadType === "banner" && banner_name === null){
                        Toast.show("Reinicie o app para atualizar imagens", Toast.LONG)
                    }
                })
        }).catch((err) => this.setState({...this.state, isLoadingUpdate: false}));
    }   

    handleOverlay = () => this.setState({isLoading: !this.state.isLoading})
}