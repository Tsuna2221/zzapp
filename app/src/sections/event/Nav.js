import React from 'react';
import { createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Components
import Event from  './'
import Informações from  './Details'

const Nav = createMaterialTopTabNavigator({
	Midia: {
		screen: Event,
		navigationOptions: {
            header: null,
            tabBarIcon: ({ tintColor, focused }) => (
                <Entypo name="images" size={25} style={{ color: tintColor }} />
            )
		}
	},
	Informações: {
		screen: Informações,
		navigationOptions: {
			header: null,
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialCommunityIcons name="information-outline" size={25} style={{ color: tintColor }} />
            )
		},
	}
},{
    initialRouteName: 'Midia',
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
        style:{
            backgroundColor: '#fff'
        },
        tabStyle:{
            height: 49,
            fontSize: 10
        },
        labelStyle: {
            fontSize: 10,
        },
        activeTintColor: '#D47B42',
        inactiveTintColor: '#00000078',
        showIcon: true,
        upperCaseLabel: false,
    }
})

export default createAppContainer(Nav)