import React, { Component, Fragment } from 'react';
import { View, Image, Text, ScrollView, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import style from './style'
import mainStyle from '../style'
import { NavigationEvents } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import TextInputMask from 'react-native-text-input-mask';

import Orcamento from '../pacotes'

//Client
import { createRequest, getConfig, setRequest } from '../client'

//Components
import { ManageHeader } from '../etc/Headers'
import AddButton from './AddButton'
import GoTo from './GoTo'

//Assets
import Confirm from '../../assets/confirm.png'
import Plus from '../../assets/green-plus.png'
import MiniMinus from '../../assets/mini-minus.png'
import MiniPlus from '../../assets/mini-plus.png'

const { checkoutContainer, checkoutText, confirmButton, setText, textBox, itemContainer, itemText } = style
const { size } = mainStyle

export default class AskEvent extends Component {
    render() {
        const { navigate, state: { params } } = this.props.navigation
        const { selectedSet, totalPrice, discountedPrice, isLoading, hour, date } = this.state
        const format = (number) => "R$" + parseInt(number).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

        return (
            <Fragment>
                <Modal visible={isLoading} transparent={true} animationType="fade">
                    <View style={[size("100%", "100%"), {backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center',}]}>
                        <ActivityIndicator animating={isLoading} size="large" color="#CB6026"/>
                    </View>    
                </Modal>
                <NavigationEvents
                    onDidFocus={({state: { params }}) => this.updatePriceParams(params)}
                />
                <ManageHeader name="Solicitar cobertura de Evento" changeView={() => navigate('Main')}/>
                <ScrollView>
                    <GoTo onPress={() => navigate('EventType')} params={params} selection="selectedType" label="Tipo de Evento"/>
                    <GoTo onPress={() => navigate('EventLevel')} params={params} selection="selectedLevel" label="Nível"/>
                    <GoTo onPress={() => navigate('EventDuration')} params={params} selection="selectedDuration" label="Tempo"/>
                    <GoTo onPress={() => navigate('EventResult')} params={params} selection="selectedResult" label="Resultado"/>

                    <View style={[itemContainer, { flexDirection: "row", alignItems: "center", justifyContent: "space-around" }]}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={[itemText, { marginRight: 14 }]}>Data: </Text>
                            <TextInputMask
                                mask={"[00]/[00]/[0000]"} 
                                onChangeText={(extr, text) => this.handleInput("date", extr)} 
                                placeholderTextColor="#8190A5" 
                                placeholder="DD/MM/AAAA" 
                                keyboardType="number-pad" 
                                style={[textBox, { width: 100 }]}
                                value={date}
                            />
                        </View>

                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={[itemText, { marginRight: 14 }]}>Hora: </Text>
                            <TextInputMask
                                mask={"[00]:[00]"} 
                                onChangeText={(extr, text) => this.handleInput("hour", extr)} 
                                placeholderTextColor="#8190A5" 
                                placeholder="HH:MM" 
                                keyboardType="number-pad" 
                                style={[textBox, { width: 65 }]} 
                                value={hour}
                            />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 17, marginVertical: 17}}>
                        <Text style={setText}>Serviços e Produtos</Text>
                        <TouchableWithoutFeedback onPress={() => this.navigateToSet()}>
                            <Image style={size(32, 32)} source={Plus}/>
                        </TouchableWithoutFeedback>
                    </View>
                    {
                        selectedSet.length === 0 ? 
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <Text style={{fontFamily: "Lato", fontSize: 16, color: "#8190A5"}}>Nenhum serviço ou produto selecionado</Text>
                            </View>
                        :
                            selectedSet.map(({qty, label, value, type, obs}, index) => {
                                const { selectedDuration, selectedLevel, selectedType } = this.props.navigation.state.params
                                const duracao = selectedDuration ? selectedDuration.value : 0
                                const orc = new Orcamento(this.state.config)

                                const totalPrice = () => {
                                    const baseEvento = type === "evento" ?          
                                        Math.ceil((orc.valorFreela(selectedLevel.value, selectedType.value, duracao) * qty) * orc.constants.multiplicador/5)*5
                                    :
                                        type === "servico" ?
                                            Math.ceil((orc.valorServico(selectedLevel.value, value, duracao) * qty) * orc.constants.multiplicador/5)*5
                                        :
                                            Math.ceil((orc.valorOutros(value) * qty) * orc.constants.multiplicador/5)*5

                                    return baseEvento;
                                }

                                return (
                                    <View key={index} style={{paddingHorizontal: 30}}>
                                        <Text style={{fontFamily: "Lato-Bold", color: "#47525E", fontSize: 17}}>{label}</Text>
                                        <Text style={{fontFamily: "Roboto", color: "#8190A5", fontSize: 15, marginVertical: 10}}>
                                            {`Quantidade: ${qty} / Observação: ${obs ? obs.substr(0, 20) + `${obs.length > 20 ? '...' : ''}` : "Nenhuma observação"}${totalPrice() !== 0 ? " / Valor " + format(totalPrice()) : ""}`}                                        </Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: "flex-end" }}>
                                            <AddButton style={{marginRight: 20}} label="Adicionar Observação" func={() => navigate("ObsPage", { selectedSet, index })}/>
                                            <TouchableWithoutFeedback onPress={() => this.updateSet(label, "sub").then(() => this.getPrice()).catch(err => null)}><Image style={[size(22, 22), {marginRight: 10}]} source={MiniMinus}></Image></TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback onPress={() => this.updateSet(label, "add").then(() => this.getPrice()).catch(err => null)}><Image style={size(22, 22)} source={MiniPlus}></Image></TouchableWithoutFeedback>
                                        </View>
                                    </View>
                                )
                            })
                    }
                </ScrollView>
                {
                    params.selectedType && params.selectedLevel && params.selectedDuration && params.selectedDuration && params.selectedResult && selectedSet.length > 0 ? 
                        <View style={[size("100%", 105), checkoutContainer]}>
                            <View style={{flexDirection: 'column', justifyContent: 'space-evenly', height: "100%"}}> 
                                <Text style={[checkoutText, {fontFamily: "Roboto-Bold"}]}>Subtotal: <Text style={[checkoutText]}>{format(totalPrice || 0)}</Text></Text>
                                <Text style={[checkoutText, {fontFamily: "Roboto-Bold"}]}>Desconto: <Text style={[checkoutText]}>{this.state.discount}%</Text></Text>
                                <Text style={[checkoutText, {fontFamily: "Roboto-Bold", fontSize: 18}]}>Total: <Text style={[checkoutText, {fontSize: 18}]}>{format(discountedPrice || 0)}</Text></Text>
                            </View>
                            <TouchableWithoutFeedback onPress={this.uploadRequest}>
                                <View style={[size(74, 74), confirmButton]}>
                                    <Image style={size(32, 32)} source={Confirm}></Image>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    :
                        null
                }
            </Fragment>
        );
    }

    state = {
        selectedSet: [],
        isLoading: false,
        date: "",
        hour: "",
        status: false,
        label: "",
    }

    navigateToSet = () => {
        const { navigate, state: { params } } = this.props.navigation
        if(params.selectedType && params.selectedLevel && params.selectedDuration){
            return navigate('SelectSet', {selectedSet: this.state.selectedSet, type: params.selectedType})
        }else{
            return Toast.show("Para escolher serviços e produtos, selecione o tipo, nível e duração do evento", Toast.LONG);
        }
    }

    componentDidMount = () => {
        const { hour, date, selectedSet } = this.props.navigation.state.params
        getConfig().then(config => this.setState({...this.state, config, loading: false, hour, date, selectedSet}))
    }

    handleInput = (key, value) => this.setState({...this.state, [key]: value})

    uploadRequest = () => {
        this.setState({...this.state, isLoading: true})
        const { selectedSet, selectedType, selectedDuration, selectedLevel, id, fromDetails, selectedResult, eventId } = this.props.navigation.state.params
        const { totalPrice, date, hour, status, label, discount, total: { outros, servicos, evento } } = this.state
        const current_date = new Date()

        var obj = {
            type: selectedType.label,
            duration: selectedDuration.value,
            level: selectedLevel.label,
            client_id: id,
            set: selectedSet,
            total: totalPrice,
            discount,
            total_outros: 0,
            total_servicos: 0,
            total_eventos: 0,
            date, hour,
            eventId,
            result: selectedResult.label,
        }

        const verifyDate = async (current_year) => {
            let dateSplit = date.split('/')
            let hourSplit = hour.split(':')
            let day = parseInt(dateSplit[0]), month = parseInt(dateSplit[1]), year = parseInt(dateSplit[2])
            let hours = parseInt(hourSplit[0]), minutes = parseInt(hourSplit[1])

            if(date.length === 0){
                return { status: false, label: 'Campo "Data" é obrigatório' }
            }else if(hour.length === 0){
                return { status: false, label: 'Campo "Hora" é obrigatório' }
            }else if(month > 12 || year > 2099 || day > 31){
                return { status: false, label: "Data inválida" }
            }else if(month === 2 && day > 29){
                return { status: false, label: "Data inválida" }
            }else if(month === 6 && day > 30){
                return { status: false, label: "Data inválida" }
            }else if(month === 9 && day > 30){
                return { status: false, label: "Data inválida" }
            }else if(month === 11 && day > 30){
                return { status: false, label: "Data inválida" }
            }else if(hours > 23){
                return { status: false, label: "Hora inválida" }
            }else if(minutes > 59){
                return { status: false, label: "Hora inválida" }
            }else if(year < current_year.getFullYear()){
                return { status: false, label: "Data inválida" }
            }else if(date.length !== 10){
                return { status: false, label: "Data inválida" }
            }else if(hour.length !== 5){
                return { status: false, label: "Hora inválida" }
            }else{
                return { status: true, label: 'Sucesso' }
            }
        }

        verifyDate(current_date).then(({status, label}) => {
            if(status){
                if(!fromDetails){
                    createRequest(obj)
                        .then(data => {
                            Toast.show("Solicitação feita com sucesso!", Toast.LONG);
            
                            this.setState({...this.state, isLoading: false})
                            this.props.navigation.goBack()
                        })
                        .catch(({response: { data: { data: { msg }}, status }}) => {
                            Toast.show(msg, Toast.LONG);
                            this.setState({...this.state, isLoading: false})
                        })
                }else{
                    setRequest({...obj, request_id: fromDetails})
                        .then((data) => {
                            Toast.show("Evento atualizado com sucesso!", Toast.LONG);

                            this.setState({...this.state, isLoading: false})
                            this.props.navigation.navigate("Informações")
                        })
                        .catch(({response: { data: { data: { msg }}, status }}) => {
                            Toast.show(msg, Toast.LONG);
                            this.setState({...this.state, isLoading: false})
                        })
                }
            }else{
                this.setState({...this.state, isLoading: false})
                Toast.show(label, Toast.LONG);
            }
        })
    }

    updatePriceParams = ({ selectedSet }) => {
        this.setState({...this.state, selectedSet})
        return this.getPrice()
    }

    updateSet = async (setLabel, action) => {
        let { selectedSet } = this.state
        let set = selectedSet.find(({label}) => setLabel === label)
        let index = selectedSet.indexOf(set)
        let setArray = [...selectedSet]

        if(action === "add"){
            setArray[index].qty = setArray[index].qty + 1
        }else if(action === "sub"){
            setArray[index].qty = setArray[index].qty - 1
        }

        this.props.navigation.setParams({selectedSet: setArray.filter(({qty}) => qty !== 0)})
        this.setState({...this.state, selectedSet: setArray.filter(({qty}) => qty !== 0)})
    }

    getPrice = () => {
        const { selectedDuration, selectedLevel, selectedType, selectedResult } = this.props.navigation.state.params
        const { selectedSet } = this.state
        const duracao = selectedDuration ? selectedDuration.value : 0
        const orc = new Orcamento(this.state.config)
        
        var setsCopy = [...selectedSet]

        var normal = setsCopy.filter(({exc}) => exc.length === 0)
        var append = setsCopy.filter(({exc}) => exc.includes(selectedType.value))

        if(selectedType.value === "corporativo"){
            normal = setsCopy.filter(({except}) => !except)
        }
        
        normal.push(...append)

        let values = normal.map(({value, type, qty}) => {
            if(selectedLevel && duracao && selectedType){
                if(type === "servico"){
                    return Math.ceil((orc.valorServico(selectedLevel.value, value, duracao) * qty) * orc.constants.multiplicador/5)*5
                }else if(type === "evento"){
                    return Math.ceil((orc.valorFreela(selectedLevel.value, selectedType.value, duracao) * qty) * orc.constants.multiplicador/5)*5
                }else{
                    return Math.ceil((orc.valorOutros(value) * qty) * orc.constants.multiplicador/5)*5
                }
            }else{
                return 0;
            }
        })
                
        let includes = (duracao) => {
            let setsCopy = [...normal]
            let setsValues = setsCopy.map(({value}) => value)
            let albums = setsCopy.filter(({album}) => album === true)
            let prices = []
            
            if(selectedLevel && duracao){
                if(setsValues.includes("cinegrafistas")){
                    prices.push(Math.ceil(orc.valorServico(selectedLevel.value, "video_edicao", duracao) * orc.constants.multiplicador/5)*5)
                }
                if(setsValues.includes("fotografos")){
                    prices.push(Math.ceil(orc.valorServico(selectedLevel.value, "tratamento_fotos", duracao) * orc.constants.multiplicador/5)*5)
                }
                if(albums.length > 0){
                    prices.push(Math.ceil(orc.valorServico(selectedLevel.value, "diagramação_album", duracao) * orc.constants.multiplicador/5)*5)
                }
    
                let reducer = prices.length > 0 ? prices : [0] 
                var total = reducer.reduce((total, num) => total + num)
            }else{
                var total = 0
            }
            
            return total
        }

        let reducer = values.length > 0 ? values : [0]
        let total = reducer.reduce((total, num) => total + num)
        total += includes(duracao)
        if(selectedResult){
            total += selectedResult.value === "online" ? 0 : Math.ceil(orc.valorOutros(selectedResult.value) * orc.constants.multiplicador/5)*5
        }

        const obj = {
            totalPrice: total,
            discountedPrice: total - (total * orc.constants.mar_desconto / 100),
            discount: orc.constants.mar_desconto,
            total: {
                outros: 0,
                servicos: 0,
                evento: 0
            }
        }

        return this.setState({...this.state, ...obj})
    }
}
