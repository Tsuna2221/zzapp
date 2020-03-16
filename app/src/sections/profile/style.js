import { StyleSheet } from 'react-native';
import mainStyle from '../style'

export default style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    avatar: {
        position: 'absolute',
        borderRadius: 150,
    },
    editBanner: {
        position: 'absolute',
        bottom: 14.5,
        right: 10
    },
    secText: {
        fontSize: 20, 
        color: '#47525E', 
        marginLeft: 11,
        marginTop: 19, 
        marginBottom: 13,
        fontFamily: 'Roboto-Regular'
    },
    ratingLabel: {
        textAlign: 'center', 
        fontSize: 18, 
        color: '#47525E', 
        fontFamily: 'Roboto-Bold'
    },
    textBox: {
        width: 288, 
        height: 50, 
        borderStyle: 'solid', 
        borderColor: '#8492A6', 
        borderWidth: 0.5, 
        fontSize: 17, 
        paddingVertical: 0, 
        paddingHorizontal: 13, 
        color: '#5a6677', 
        fontFamily: 'Lato'
    },
    itemContainer: {
        width: "90%", 
        paddingVertical: 24,
    },
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
    mainContainer: {
        borderTopColor: '#D2DAE6',
        borderTopWidth: 0.5,
        width: "100%", 
        justifyContent: 'center', 
        alignItems: 'center'
    },
})