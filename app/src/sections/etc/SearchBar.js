import React, { Component } from 'react';
import { View, Image, TextInput } from 'react-native';
import style from './style'
import mainStyle from '../style'

//Assets
import SearchIcon from '../../assets/search.png'

const { size } = mainStyle
const { searchBarContainer, searchBarInput } = style

export default SearchBar = ({placeholder, lowMargin, handleInput}) => (
    <View style={[searchBarContainer, lowMargin ? { marginVertical: 5 } : null]}>
        <Image style={[size(15.5, 15.5), {position: 'absolute', zIndex: 2, left: 6}]} source={SearchIcon}></Image>
        <TextInput onChangeText={(text) => handleInput(text)} placeholderTextColor="#A4A4A4" placeholder={placeholder} style={searchBarInput}></TextInput>
    </View>
);