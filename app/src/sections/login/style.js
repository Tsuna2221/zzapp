import { StyleSheet } from 'react-native';

export default style = StyleSheet.create({
    textBox: {width: 288, height: 50, borderStyle: 'solid', borderColor: '#8492A6', borderWidth: 0.5, fontSize: 17, paddingVertical: 0, paddingHorizontal: 13, color: '#5a6677', fontFamily: 'Lato'},
    forgotPass: { textAlign: 'center', color: '#8190A5', fontSize: 13, marginTop: 24, fontFamily: 'Lato', width: 288},
    scrollView: {flexDirection: 'column', alignItems: 'center', justifyContent: "flex-end"}, //<< Dynamic Height
    logo: {marginTop: 35, marginBottom: "10%", width: '100%', height: 100, resizeMode: 'contain'},
    form: {flexDirection: 'column', justifyContent: 'space-between', height: '100%'},
    buttonEnter: {justifyContent:'center', alignItems:'center', width: 288, height: 44, borderRadius: 5, backgroundColor: '#CB6026', marginTop: 30},
    buttonCreate: {justifyContent:'center', alignItems:'center', width: 288, height: 50, borderRadius: 8, backgroundColor: 'rgba(71, 82, 94, 0.11)', marginBottom: 14.5},
    textEnter: {fontSize: 17, fontFamily: 'Lato', color: '#fff'},
    textCreate: {fontSize: 18, fontFamily: 'Roboto-Regular', color: '#D47B42'},
    select: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9.5, paddingVertical: 13, borderBottomColor: '#D2DAE6', borderBottomWidth: 0.5,},
    selectText: {fontFamily: "Lato", color: '#47525E', fontSize: 13.5, paddingHorizontal: 5,}
})