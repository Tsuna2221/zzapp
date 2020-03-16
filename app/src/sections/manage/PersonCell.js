import React, { Fragment, useState } from 'react';
import { View, Image, Text, TouchableNativeFeedback } from 'react-native';

import style from './style'
import { parsedDate } from '../partials'
import { updateUser, getUser } from '../client'

//Components
import Button from './Button'

const { container, topText, bottomText, mainContainer, buttonContainer } = style

export default PersonCell = ({user: {name, created_at, account_type, status, id, mentor_id}, changeView, currentId, handleOverlay, currentUser}) => {
    const { fullDate, hoursString } = parsedDate(created_at)
    const [recStatus, setRecStatus] = useState(status)

    return (
        <TouchableNativeFeedback onPress={async () => changeView(await getUser(id))}>
            <View style={mainContainer}>
                <View style={container}>
                    <Text style={topText}>{name}</Text>
                    <Text style={bottomText}>Cadastro em {fullDate} às {hoursString}</Text>
        
                    <View style={[buttonContainer, {alignItems: 'center'}]}>
                        {
                            account_type !== 'client' ?
                                <Fragment>
                                    {
                                        account_type === 'pro' ?
                                            recStatus === 'pending' && (currentUser.account_type === "admin" || currentUser.id === mentor_id) ?
                                                <Fragment>
                                                    <Button label="Aprovar" func={() => {updateUser(id, {status: 'approved'}); setRecStatus('approved')}} style={{marginRight: 18.5, backgroundColor: "#47525E"}}/>
                                                    <Button label="Rejeitar" func={() => {updateUser(id, {status: 'rejected'}); setRecStatus('rejected')}} style={{backgroundColor: "#FF0004"}}/>
                                                </Fragment>
                                            :
                                                recStatus === 'pending' ? 
                                                    null
                                                :
                                                    <Text style={bottomText}>{recStatus === 'approved' ? "Usuário Aprovado" : "Usuário Rejeitado"}</Text>
                                        :
                                            null
                                    }
                                    {
                                        currentId !== id && (currentUser.account_type === "admin" || currentUser.id === mentor_id) ?
                                            <Button label="Excluir" func={() => handleOverlay(id)} style={{marginLeft: 18.5, backgroundColor: "#47525E"}}/>
                                        : 
                                            null
                                    }
                                </Fragment>
                            :
                                null
                        }
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}