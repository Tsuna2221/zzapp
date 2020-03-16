import { StyleSheet, Dimensions } from 'react-native';
const {width} = Dimensions.get('window');

export default style = StyleSheet.create({
    //Events
    eventText: {
        fontFamily: 'Bree Serif',
        fontSize: 22.5,
    },
    previewContainer:{
        flexDirection: 'row',
    },
    eventPreview: {
        borderRadius: 5,
        width: '25%',
        height: 68,
        backgroundColor: '#DEDEDE',
        overflow: 'hidden'
    },
    eventStack: {
        backgroundColor: 'rgba(0, 0, 0, 0.24)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatButton: {
        backgroundColor: "#D47B42", 
        position: 'absolute', 
        bottom: 19.5,
        right: 22,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 7,
        zIndex: 80
    },
    eventContainerText: {
        fontFamily: 'RobotoCondensed-Regular',
        fontSize: 22.5,
        color: '#fff',
        position: "absolute",
        zIndex: 20
    },

    //Menu
    overlay:{
        position: 'absolute', 
        backgroundColor: 'rgba(212, 123, 66, 0.84)',
        zIndex: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTop: {
        fontSize: 22.5, 
        marginTop: 20.5,
        textAlign: 'center'
    },
    textBottom: {
        fontSize: 20, 
        marginTop: 28,
    },
    textFont: {
        color: "#fff",
        fontFamily: 'Roboto-Regular' 
    },
    textRequestBold: {
        fontSize: 15,
        fontFamily: "Lato-Bold",
        color: "#47525E"
    },
    textRequest: {
        fontSize: 14,
        fontFamily: "Lato",
        color: "#617080"
    },
    headStatus: {
        borderBottomColor: '#8492A6', 
        borderBottomWidth: 0.5,
    }
})
