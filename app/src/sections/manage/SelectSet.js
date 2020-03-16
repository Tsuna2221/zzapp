import React, { Component, Fragment } from 'react';
import { View, TextInput, Text, ScrollView, Animated, Dimensions, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import style from './style'
import mainStyle from '../style'

import { ManageHeader } from '../etc/Headers'
import Selector from './Selector'

import Arrow from '../../assets/arrow-right.png'

const { itemContainer, itemText, checkoutContainer, checkoutText, confirmButton, setText } = style
const { size } = mainStyle

export default class SelectSet extends Component {
    render() {
        const { goBack, state: { params: { selectedSet, type } } } = this.props.navigation
        const set = [
            { label: 'Cinegrafistas', value: "cinegrafistas", type: "evento", exc: [] },
            { label: 'Fotógrafos', value: "fotografos", type: "evento", exc: [] },
            { label: 'Civil', value: "civil", type: "evento", exc: ["casamento"] },
    
            { label: 'Making Of', value: "making_of", type: "servico", exc: ["debutante", "casamento"], except: true },
            { label: 'Making Of Noivo', value: "making_of_noivo", type: "servico", exc: ["casamento"], except: true },
            { label: 'Ensaio Pre-Evento', value: "ensaio_pre_evento", type: "servico", except: true, exc: [] },
            // { label: 'Vídeo Edição', value: "video_edicao", type: "servico" },
            // { label: 'Tratamento Fotos', value: "tratamento_fotos", type: "servico" },
            // { label: 'Diagramação Álbum', value: "diagramação_album", type: "servico" },
            //
            { label: 'Retrospectiva', value: "retrospectiva", type: "outros", except: true, exc: [] },
            { label: 'Wedding Story', value: "wedding_story", type: "outros", except: true, exc: ["casamento"] },
            { label: 'Quadro 60x80cm', value: "quadro_60x80cm", type: "outros", except: true, exc: [] },
            { label: 'Álbum Premium 30x30cm 40p Box', value: "premium_30x30cm_box", type: "outros", album: true, except: true, exc: [] },
            { label: 'Álbum Master 30x30cm 40p Box', value: "master_30x30cm_box", type: "outros", album: true, except: true, exc: [] },
            { label: 'Álbum Premium 24x30cm 40p Box', value: "premium_24x30cm_box", type: "outros", album: true, except: true, exc: [] },
            { label: 'Álbum Master 24x30cm 40p Box', value: "master_24x30cm_box", type: "outros", album: true, except: true, exc: [] },
            { label: 'Álbum Master 20x30cm 20p 20x30cm', value: "master_20x30cm_box", type: "outros", album: true, except: true, exc: [] },
            { label: 'Kit Sogra Premium (15x15cm)', value: "sogra_premium_15x15cm_box", type: "outros", exc: ["casamento"], except: true },
            { label: 'Kit Sogra Master (15x15cm)', value: "sogra_master_15x15cm_box", type: "outros", except: true, exc: ["casamento"] },
            { label: 'Locução 2 min', value: "locucao_2_min", type: "outros", exc: ["corporativo"] },
            { label: 'Trilha Sonora', value: "trilha_sonora", type: "outros", exc: ["corporativo"] },
        ]

        const validSets = () => {
            const normal = set.filter(({exc}) => exc.length === 0)
            const append = set.filter(({exc}) => exc.includes(type.value))
            const currentSets = selectedSet.map(({value}) => value)
            normal.push(...append)
    
            const result = () => {
                const cells = normal.filter(({value}) => !currentSets.includes(value))
    
                if(type.value === "corporativo"){
                    return cells.filter(({except}) => !except)
                }else{
                    return cells
                }
            }
    
            return result()
        }

        return (
            <Fragment>
                <ManageHeader name="Pacotes" changeView={() => goBack()}/>
                <ScrollView>
                    <Text style={{paddingHorizontal: 15, marginVertical: 10, fontFamily: "Lato", fontSize: 14}}>Evento</Text>
                    <View>
                    {
                        validSets().filter(({type}) => type ==="evento").filter((item) => !selectedSet.map(({value}) => value).includes(item.value))
                            .map(({label, value, type, exc, except, album}) => (
                                <Selector key={value} label={label} onPress={() => this.sendSet(label, value, type, exc, except, album)}/>
                            ))
                    }
                    </View>
                    <Text style={{paddingHorizontal: 15, marginVertical: 10, fontFamily: "Lato", fontSize: 14}}>Serviços</Text>
                    <View>
                    {
                        validSets().filter(({type}) => type ==="servico").filter((item) => !selectedSet.map(({value}) => value).includes(item.value))
                            .map(({label, value, type, exc, except, album}) => (
                                <Selector key={value} label={label} onPress={() => this.sendSet(label, value, type, exc, except, album)}/>
                            ))
                    }
                    </View>
                    <Text style={{paddingHorizontal: 15, marginVertical: 10, fontFamily: "Lato", fontSize: 14}}>Outros</Text>
                    <View>
                    {
                        validSets().filter(({type}) => type ==="outros").filter((item) => !selectedSet.map(({value}) => value).includes(item.value))
                            .map(({label, value, type, exc, except, album}) => (
                                <Selector key={value} label={label} onPress={() => this.sendSet(label, value, type, exc, except, album)}/>
                            ))
                    }
                    </View>
                </ScrollView>
            </Fragment>
        );
    }

    sendSet = (label, value, type, exc, except, album) => {
        let set = this.props.navigation.state.params.selectedSet

        set.push({qty: 1, label, value, type, exc, except, album, obs: null})
        this.props.navigation.navigate("AskEvent", { selectedSet: set })
    }
}