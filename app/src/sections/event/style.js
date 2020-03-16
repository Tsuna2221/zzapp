import { StyleSheet } from 'react-native';

export default style = StyleSheet.create({
    imageContainer:{
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    addButton:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#47525E',
        borderRadius: 4,
        paddingHorizontal: 5,
        minWidth: 73,
        height: 28
    },
    secondaryButton: {
        textTransform: 'uppercase', 
        color: '#fff', 
        fontSize: 10,
        fontFamily: 'Roboto-Medium',
    },
    personText: {
        color: '#47525E', 
        fontSize: 11, 
        textAlign: 'center',
        fontFamily: 'Lato'
    },
    label: {
        color: '#47525E', 
        marginHorizontal: 10, 
        marginTop: 15,
        fontFamily: 'Roboto-Bold',
        fontSize: 13
    },
    stats: {
        color: '#47525E', 
        fontFamily: 'Roboto-Medium',
        fontSize: 13
    },
    imageTouchable:{
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 2,
        backgroundColor: "#ddd"
    },
    deleteFloater: {
        position: "absolute",
        zIndex: 10,
        top: -10,
        right: -10
    },
    requestContainer: {
        flexDirection: "row", 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        borderBottomColor: '#8492A6', 
        borderBottomWidth: 0.5,
        paddingVertical: 10,
    },
    textRequestBold: {
        fontSize: 15,
        fontFamily: "Lato-Bold",
        color: "#47525E"
    },
    textRequest: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: "#47525E"
    },
    
})