import { StyleSheet } from 'react-native';

export default style = StyleSheet.create({
    topText: {
        fontFamily: 'Lato-Bold',
        fontSize: 17,
        color: '#47525E',
        marginBottom: 2
    },
    bottomText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        color: '#47525E'
    },
    buttonContainer: {
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        marginTop: 10
    },
    button: {
        width: 70,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    buttonText: {
        textTransform: 'capitalize',
        fontFamily: 'Roboto-Medium',
        fontSize: 12,
        color: '#fff'
    },
    mainContainer: {
        borderTopColor: '#D2DAE6',
        borderTopWidth: 0.5,
        width: "100%", 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    container: {
        width: "82%", 
        paddingVertical: 24,
    },
    switchContainer: {
        borderRadius: 150,
        flexDirection: 'row',
        alignItems: 'center',
    }, 
    switchBall: {
        borderRadius: 100,
        backgroundColor: "#fff",
        marginHorizontal: 1,
    },
    itemContainer: {
        height: 44, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15, 
        borderTopColor: '#D2DAE6', 
        borderTopWidth: 0.5
    },
    itemText:{
        fontFamily: 'Lato', 
        color: '#5c6a7a', 
        fontSize: 17
    },
    checkoutContainer: {
        backgroundColor: '#D47B42',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    checkoutText: {
        color: "#fff",
        fontSize: 15,
        fontFamily: 'Roboto-Regular'
    },
    confirmButton: {
        backgroundColor: '#fff',
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    setText: {
        color: '#47525E',
        fontFamily: "Roboto-Bold",
        fontSize: 20
    },
    addButton:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#47525E',
        borderRadius: 4,
        width: 175,
        height: 30.87
    },
    secondaryButton: {
        textTransform: 'uppercase', 
        color: '#fff', 
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
    },
    textarea: {
        width: "90%", 
        height: 140,
        marginTop: 15,
        borderStyle: 'solid', 
        borderColor: '#8492A6', 
        borderWidth: 0.5, 
        fontSize: 17, 
        paddingVertical: 0, 
        paddingHorizontal: 13, 
        color: '#5a6677', 
        fontFamily: 'Lato',
        textAlignVertical: 'top',
        paddingTop: 15
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
        fontFamily: "Lato",
        color: "#617080"
    },
    textBox: {
        height: 30, 
        borderStyle: 'solid', 
        borderColor: '#8492A6', 
        borderWidth: 0.5, 
        fontSize: 14, 
        paddingVertical: 0, 
        paddingHorizontal: 10, 
        color: '#5a6677', 
        fontFamily: 'Lato'
    },
    headStatus: {
        borderBottomColor: '#8492A6', 
        borderBottomWidth: 0.5,
    }
}) 