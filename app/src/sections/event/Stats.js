import React, { useState } from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import style from './style'
import MModal from '../modals'

import { parsedDate } from '../partials'
const { stats } = style

export default Stats = ({createdAt, proLength, clientLength, images, status, update, isAdmin}) => {
    //state
    const [isActivated, handleOverlay] = useState(false)
    
    //vars
    const bytesToSize = (bytes) => {
        var k = (bytes / 1024).toString().split('.')[0]
        var m = (bytes / 1048576)
        var g = (bytes / 1073741824)
        if(bytes < 1024) return bytes + "bytes";
        else if(bytes < 1048576) return k + "kb";
        else if(bytes < 1073741824) return m.toFixed(2).toString().split('.')[0] + "mb";
        else return g.toFixed(2) + "gb";
    };
    const sizes = images.reduce((total, {size}) => total + size, 0)
    const i = images.filter(({type}) => type.includes('image')).length
    const v = images.filter(({type}) => type.includes('video')).length
    const imgs = i > 0 ? `${i} image${i > 1 ? "ns" : "m"},` : ""
    const videos = v > 0 ? ` ${v} vídeo${v > 1 ? "s" : ""},` : ""
    const pros = proLength > 0 ? ` ${proLength} profissiona${proLength > 1 ? "is" : "l"},` : ""
    const clients = clientLength > 0 ? ` ${clientLength} client${clientLength > 1 ? "es" : "e"},` : ""
    const size = sizes !== 0 ? ` ${bytesToSize(sizes)} em mídias,` : ""
    const { fullDate, hoursString } = parsedDate(createdAt)
    
    return (
        <View style={{marginHorizontal: 10}}>
            <Text style={{marginVertical: 13, fontFamily: 'Roboto-Bold', fontSize: 13}}>Estatísticas</Text>
            <Text style={stats}>{`${imgs}${videos}${pros}${clients}${size}${imgs===""&&videos===""&&pros===""&&clients===""&&size==="" ? "P" : " p"}ublicado em ${fullDate} às ${hoursString}`}</Text>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: isAdmin ? 'space-between' : "flex-start" , width: "100%", marginTop: 5}}>
                <Text style={stats}>Status: {status === "agendado" ? "Agendado" : status === "fechado" ? "Fechado" : "Portfólio"}</Text>
                {/* {
                    isAdmin && status !== "portfolio" ?
                        <TouchableNativeFeedback onPress={() => handleOverlay(!isActivated)}>
                            <Text style={[stats, { textDecorationLine: 'underline' }]}>Marcar como {status === "agendado" ? "FECHADO" : "PORTFÓLIO"}</Text>
                        </TouchableNativeFeedback>
                    :
                        null
                } */}
            </View>
            <MModal 
                label="Atualizar Status"
                handleInput={() => null} 
                text={`Tem certeza que deseja alterar o status do evento para ${status === "agendado" ? "FECHADO" : "PORTFÓLIO"}`}
                left={{ leftFunc: () => null, leftLabel: "Não" }} 
                right={{ rightFunc: update, rightLabel: 'Sim' }}
                opacity={{
                    isActivated: isActivated, 
                    handleOverlay: () => handleOverlay(!isActivated)
                }}
            />
        </View>
    );
}