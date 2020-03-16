import React from 'react'
import { View, Text, Picker } from 'react-native';

export default EventPicker = ({text, selectedValue, handlePicker, toChange}) => (
    <View style={{width: 250, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
        <Text style={{fontSize: 17, fontFamily: "Lato", color: "#8190A5"}}>{text}</Text>
        <Picker 
            selectedValue={selectedValue}
            style={{height: 50, width: 130}}
            onValueChange={(itemValue, itemIndex) => handlePicker(itemValue, toChange)}>
            <Picker.Item label="Amador" value={1} />
            <Picker.Item label="Iniciante" value={2} />    
            <Picker.Item label="Intermediário" value={3} />
            <Picker.Item label="Avançado" value={4} />    
        </Picker>
    </View>
)