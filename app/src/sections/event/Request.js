import React, { Fragment } from 'react'
import { View, Text } from 'react-native';

import style from './style'

const { textRequestBold, stats, textRequest } = style

const Request = ({name, isAdmin, request: { client_email, client_phone, client_name, duration, level, set, type, hour, date, result }}) => {

    return (
        <View style={{marginHorizontal: 10, marginBottom: 60}}>
            <View>
                <Text style={{marginVertical: 13, fontFamily: 'Roboto-Bold', fontSize: 13}}>Sobre o evento</Text>

                <Text style={stats}>Nome do evento: <Text style={textRequest}>{name}</Text></Text>
                <Text style={stats}>Tipo de evento: <Text style={textRequest}>{type}</Text></Text>
                <Text style={stats}>Nível: <Text style={textRequest}>{level}</Text></Text>
                <Text style={stats}>Duração: <Text style={textRequest}>{duration === 1 ? duration + " hora" : duration + " horas"}</Text></Text>
                <Text style={stats}>Data do evento: <Text style={textRequest}>{date} às {hour}</Text></Text>
            </View>
            <View>
                <Text style={{marginVertical: 13, fontFamily: 'Roboto-Bold', fontSize: 13}}>Cliente</Text>

                <Text style={stats}>Por: <Text style={textRequest}>{client_name}</Text></Text>
                <Text style={stats}>E-mail: <Text style={textRequest}>{client_email}</Text></Text>
                {
                    isAdmin ?
                        <Text style={stats}>Telefone: <Text style={textRequest}>{`(${client_phone.substr(0,2)}) ${client_phone.substr(2,5)}-${client_phone.substr(7)}`}</Text></Text>
                    :
                        null
                }
            </View>
            {
                set.length > 0 ? 
                    <View>
                        <Text style={{marginTop: 13, marginBottom: 7, fontFamily: 'Roboto-Bold', fontSize: 13}}>Serviços e Produtos</Text>
                        <Text style={[stats, {marginTop: 6}]}>Resultado: <Text style={textRequest}>{result}</Text></Text>

                        {
                            set.map(({label, obs, qty}) => (
                                <Fragment key={label}>
                                    <Text style={[stats, {marginTop: 6}]}>Pacote: <Text style={textRequest}>{label}</Text></Text>
                                    <Text style={stats}>Quantidade: <Text style={textRequest}>{qty}</Text></Text>
                                    <Text style={stats}>Observação: <Text style={textRequest}>{obs ? obs : "Nenhuma Observação"}</Text></Text>    
                                </Fragment>
                            ))
                        }
                    </View>
                :
                    null
            }
        </View>
    )
}

export default Request;