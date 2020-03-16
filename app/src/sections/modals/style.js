import { StyleSheet } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';

export default style = StyleSheet.create({
    modalContainer: { 
        position: 'absolute', 
        backgroundColor: 'rgba(71, 82, 94, 0.4)', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    textTop: {
        fontFamily: 'Lato-Bold',
        fontSize: 17,
        color: '#47525E',
        marginBottom: 7,
        textAlign: 'center'
    },
    textBottom: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        color: '#8190A5',
        textAlign: 'center',
        paddingHorizontal: 20
    },
    buttonsContainer: {
        borderTopColor: '#D2DAE6',
        borderTopWidth: 0.5,
        flexDirection: 'row',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#D2DAE6',
        width: "50%",
        height: 44
    },
    buttonText: {
        fontFamily: 'Lato',
        fontSize: 17,
        color: '#8190A5'
    },
    input: {
        width: 235,
        height: 25,
        borderColor: '#8492A6',
        borderWidth: 0.5,
        borderStyle: 'solid',
        fontSize: 13,
        paddingHorizontal: 10,
        paddingVertical: 0,
        color: '#5a6677', 
        fontFamily: 'Roboto-Regular',
        marginBottom: 13.25
    }
})
