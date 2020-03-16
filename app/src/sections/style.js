import { StyleSheet } from 'react-native';

export default mainStyle = StyleSheet.create({
    size: (width, height) => ({
        width,
        height
    }),
    floater: {
        marginTop: 30,
        width: "100%", 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        position: "absolute", 
        bottom: 0, 
        right: 0
    }
})