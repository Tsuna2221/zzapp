import React from 'react';
import { createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Components
import Clients from  './Clients'
import Requests from  './Requests'

const ClientNav = createMaterialTopTabNavigator({
	Clientes: {
		screen: Clients,
		navigationOptions: {
            header: null,
            tabBarIcon: ({ tintColor, focused }) => (
                <Feather name="user" size={25} style={{ color: tintColor }} />
            )
		}
	},
	Solicitações: {
		screen: Requests,
		navigationOptions: {
			header: null,
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialCommunityIcons name="message-text" size={25} style={{ color: tintColor }} />
            )
		},
	}
},{
    initialRouteName: 'Clientes',
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

export default createAppContainer(ClientNav)