import React, { Component, Fragment } from 'react';
import { View, TextInput, Image, Text, ScrollView, Animated, Dimensions } from 'react-native';
import style from './style'
import AddButton from './AddButton';
import { ManageHeader } from '../etc/Headers'
import Toast from 'react-native-simple-toast';

const { textarea } = style

export default class ObsPage extends Component {
    render() {
        const { navigate, goBack, state: { params: { selectedSet, index } } } = this.props.navigation
        const set = selectedSet[index]
        return (
            <Fragment>
                <ManageHeader name="Adicionar Observação" changeView={() => goBack()}/>
                <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                    <View style={{width: "90%", marginTop: 15}}>
                        <Text style={{textAlign: 'left', fontFamily: "Lato-Bold", color: "#47525E", fontSize: 17}}>{set.label}</Text>
                    </View>
                    <TextInput
                        onChangeText={(text) => this.setState({text})}
                        placeholderTextColor="#8190A5" 
                        placeholder="Observação" 
                        multiline={true} 
                        numberOfLines={30} 
                        style={[textarea, { justifyContent: 'center' }]}
                    />
                </ScrollView>
                <AddButton func={this.updateObs} label="Salvar" style={{position: "absolute", bottom: 15, right: 15, width: 100}} />
            </Fragment>
        );
    }

    state = {
        text: ""
    }

    updateObs = () => {
        const { text } = this.state
        const { selectedSet, index } = this.props.navigation.state.params

        if(text.length > 10){
            selectedSet[index].obs = text
            
            this.props.navigation.navigate("AskEvent", { selectedSet })
        }else{
            Toast.show("Observação precisa ter mais de 10 letras", Toast.LONG);
        }
    }
}