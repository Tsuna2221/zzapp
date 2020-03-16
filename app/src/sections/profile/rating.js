import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import style from './style'
import mainStyle from '../style'

import Star from '../../assets/star.png'
import Fill from '../../assets/star-fill.png'

const { size } = mainStyle
const { secText, ratingLabel } = style

export default class Rating extends Component {
    render() {
        return (
            <View>
                <Text style={secText}>Minhas classificações</Text>
                <View style={{alignItems: 'center'}}>
                    {this.drawRatings()}
                </View>
            </View>
        );
    }

    drawRatings = () => {
        return this.props.ratings.events.map(({label, rating}) => {
            let stars = []

            for(let i = 0; i < rating; i++){
                stars.push(<Image key={i + 4} style={[size(24,24), {marginHorizontal: 2.5,}]} source={Fill}></Image>)
            }

            for(let x = 0; x < 4; x++){
                if(stars.length < 4){
                    stars.push(<Image key={x + 1} style={[size(24,24), {marginHorizontal: 2.5,}]} source={Star}></Image>)
                }
            }

            return (
                <View key={label}>
                    <Text style={ratingLabel}>{label}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 22}}>
                        {stars.map(el => el)}
                    </View>
                </View>
            )
        })
    }
}