import React, { Fragment } from 'react';
import { View, Image, Text } from 'react-native';
import style from './style'
import mainStyle from '../style'

const { previewContainer, eventPreview, eventStack, eventContainerText } = style
const { size } = mainStyle

export default EventCell = ({images}) => {
    const validImages = images.sort((a, b) => b.id - a.id).filter((data, index) => index < 4)
    const drawImage = () => {
        return validImages.map(({name, type}, index) => {
            if(index !== 3){
                if(index === 1){
                    return <View key={index} style={[eventPreview, {borderRadius: 5}]}><Image style={[size("100%", "100%")]} source={{uri: `http://18.228.199.251:5000/static/thumb-${name}${type.includes('video') ? ".jpg" : ""}`}}></Image></View>
                }else{
                    return <View key={index} style={[eventPreview, {marginHorizontal: 1.5, borderRadius: 5}]}><Image style={[size("100%", "100%")]} source={{uri: `http://18.228.199.251:5000/static/thumb-${name}${type.includes('video') ? ".jpg" : ""}`}}></Image></View>
                }
            }
        })
    }

    return (
        <View style={[previewContainer, { marginTop: 15.59, height: 68}]}>
            {
                validImages.length === 0 ?
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                        <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Não há imagens</Text>
                    </View>
                :
                <Fragment>
                    {drawImage()}
                    {
                        validImages.length >= 3 ?
                            (images.length - 3) !== 0 ?
                                <View style={[eventPreview, eventStack, {borderRadius: 5}]}>
                                    <Image style={[size("100%", "100%")]} source={{uri: `http://18.228.199.251:5000/static/thumb-${validImages[3] ? validImages[3].type.includes("video") ? validImages[3].name + ".jpg" : validImages[3].name : ""}`}}></Image>
                                    <View style={[size("100%", "100%"), {position: "absolute", backgroundColor: "rgba(71, 82, 94, 0.4)", zIndex: 10, borderRadius: 5}]}></View>
                                    <Text style={eventContainerText}>+{images.length - 3}</Text>
                                </View>  
                            :
                                null      
                        :
                            null
                    }
                </Fragment>
            }
        </View>
    );
}