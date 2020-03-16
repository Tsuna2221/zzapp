import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import style from './style'

import { getUser } from '../client'

import Placeholder from '../../assets/profile.png'
import Delete from '../../assets/close-fill.png'

const { size } = mainStyle
const { personText, label, deleteFloater } = style

export default Pros = ({pros, changeView, canDelete, deleteUser, event}) => (
    <Fragment>
        {
            pros.length !== 0 ?
                <Fragment>
                    <Text style={label}>Lista de Profissionais</Text>
                    <ScrollView contentContainerStyle={{paddingTop: 17}} showsHorizontalScrollIndicator={false} horizontal>
                        {
                            pros.map(({id, avatar_name, name}) => (
                                <View key={id} style={[{flexDirection: "column", alignItems: 'center', marginHorizontal: 10}]}>
                                    <TouchableWithoutFeedback style={{borderRadius: 150, overflow: "hidden"}} onPress={async () => changeView(await getUser(id))}>
                                        <View style={{borderRadius: 150, overflow: "hidden"}}>
                                            <Image style={[size(67, 67)]} source={avatar_name ? {uri: `http://18.228.199.251:5000/static/${avatar_name}`} : Placeholder}></Image>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <Text style={personText}>{name}</Text>
                                    {
                                        canDelete ?
                                            <TouchableWithoutFeedback onPress={() => deleteUser(id, "pro", event)}>
                                                <Image style={[size(32, 32), deleteFloater]} source={Delete}></Image>
                                            </TouchableWithoutFeedback>
                                        :
                                            null
                                    }
                                </View>
                            ))
                        }
                    </ScrollView>
                </Fragment>
            :
                null
        }
    </Fragment>
)