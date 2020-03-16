import React, { Component, Fragment } from 'react';
import { View, Text, ScrollView, Dimensions, Image, TouchableNativeFeedback, Animated, BackHandler } from 'react-native';
import style from './style'
import mainStyle from '../style'
import { NavigationEvents } from 'react-navigation';

import { deleteEvent } from '../client'

//Components
import { EventHeader } from '../etc/Headers'
import MediaDisplay from './MediaDisplay'
import MModal from '../modals'

//Assets
import Play from '../../assets/play.png'

const { imageContainer, imageTouchable } = style
const { size } = mainStyle

export default class Midia extends Component {
    onLayout(e) {
        const {width, height} = Dimensions.get('window')
        this.setState({...this.state, isPortrait: height > width, width, height})
    }

    render() {
        const { event: { name }, data } = this.props.navigation.state.params
        const { width, images, modalActivated } = this.state

        return (
            <Fragment>
                <NavigationEvents
                onDidFocus={payload => {
                    const { newData } = payload.state.params
                    if(newData){
                        let fusedImages = [...this.state.images, ...newData]

                        function removeDuplicates(myArr, prop) {
                            return myArr.filter((obj, pos, arr) => {
                                return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
                            });
                        }

                        this.setState({...this.state, updated: true, images: removeDuplicates(fusedImages, 'id')})
                    }
                }}/>
                <EventHeader isAvailable={data.account_type === "admin"} trashEvent={this.handleModal} text={name} changeView={this.handleBackPress}/>
                <ScrollView onLayout={this.onLayout.bind(this)} contentContainerStyle={[imageContainer]}>
                    {
                        images.length > 0 ? 
                            images.sort((a, b) => b.id - a.id).map(({name, type, id}, index) => (
                                <TouchableNativeFeedback key={index} onPress={() => this.handleOverlay({name, type, id})}>
                                    <View style={[size((width / 2) - 0.5, 137), imageTouchable]}>
                                        {
                                            !type.includes('video') ?
                                                <Image style={size("100%", "100%")} source={{uri: `http://18.228.199.251:5000/static/thumb-${name}`}}></Image>
                                            :
                                                <Fragment>
                                                    <Image style={size("100%", "100%")} source={{uri: `http://18.228.199.251:5000/static/thumb-${name}.jpg`}}></Image>
                                                    <Image style={[size(51, 51), {position: "absolute"}]} source={Play}></Image>
                                                </Fragment>
                                        }
                                    </View>
                                </TouchableNativeFeedback>
                            ))
                        :
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 30}}>
                                <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Não há imagens</Text>
                            </View>
                    }
                </ScrollView>
                <MediaDisplay userId={data.id} userType={data.account_type} updateImages={this.updateImages} currentMedia={this.state.currentMedia} isActivated={this.state.overlayActivated} handleOverlay={this.handleOverlay}/>
                <MModal 
                    label="Deletar Evento" 
                    text="Tem certeza que deseja deletar este evento?" 
                    left={{ leftFunc: () => null, leftLabel: "Não" }} 
                    right={{ rightFunc: () => this.handleTrash(), rightLabel: "Sim" }}
                    opacity={{
                        isActivated: modalActivated,
                        handleOverlay: this.handleModal
                    }}
                />
            </Fragment>
        );
    }

    state = {
        overlayActivated: false,
        modalActivated: false,
        isPortrait: true, 
        width: 0,
        height: 0,
        images: this.props.navigation.state.params.event.images,
        updated: false
    }

    componentDidMount = () => this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    componentWillUnmount = () => this.backHandler.remove()

    handleBackPress = () => {
        let { props: { navigation: { navigate, state: { params } } } } = this

        navigate('Main', { updated: true })
        return true
    }

    handleModal = () => this.setState({...this.state, modalActivated: !this.state.modalActivated})

    handleTrash = () => {
        const { event, data } = this.props.navigation.state.params

        deleteEvent(data.id, event.id)
            .then(() => {
                this.props.navigation.navigate('Main', { remove: event.id })
            })
    }

    updateImages = (deletedId) => this.setState({
        ...this.state,
        images: this.state.images.filter(({id}) => id !== deletedId),
        overlayActivated: false,
        updated: true
    })

    handleOverlay = (data) => this.setState({overlayActivated: !this.state.overlayActivated, currentMedia: data})
}