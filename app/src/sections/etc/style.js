import { StyleSheet } from 'react-native';

export default style = StyleSheet.create({
    headerContainer:{
        height: 54,
        borderBottomColor: '#D2DAE6',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 11,
    },
    mediaContainer: {
        width: '100%',
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 11,
        position: 'absolute',
        top: 1
    },
    searchBarContainer: {
        marginTop: 10,
        height: 28,
        marginHorizontal: 13.5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchBarInput: {
        width: '100%',
        height: '100%',
        paddingVertical: 0,
        color: '#797979',
        backgroundColor: 'rgba(0, 0, 0, 0.09)',
        borderRadius: 10,
        paddingLeft: 30
    },
    footerContainer:{
        height: 49,
        borderTopColor: '#D2DAE6',
        borderTopWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
    }
})