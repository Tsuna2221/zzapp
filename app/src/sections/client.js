import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

const httpClient = axios.create();

httpClient.defaults.timeout = 8000;

export function validateUser(email, password){
    const url = "http://18.228.199.251:5000/validateuser"

    return httpClient.post(url,{email, password})
        .then(({data: { data }}) => data)
}

export function loginUser(sent_token){
    const url = "http://18.228.199.251:5000/loguser"

    return AsyncStorage.getItem('token').then((t) => {
        return httpClient.post(url, null, { headers: {authorization: sent_token ? sent_token : t} })
            .then(({data: { data }}) => data)
    })
}

export function createUser(name, email, password, confirm_password, type, phone_number, portfolio, cpf, rg, mentor_id, id, is_mentor, services){
    const url = "http://18.228.199.251:5000/createuser"

    return axios.post(url, {email, password, name, confirm_password, account_type: type, phone_number, portfolio, cpf, rg, mentor_id, id, is_mentor, services})
        .then(({data: { data }}) => data)
}

export function getEvents(user_id, event_id, sent_token){
    const url = `http://18.228.199.251:5000/getevents?user_id=${user_id}${event_id ? `&event_id=${event_id}` : ""}`

    return AsyncStorage.getItem('token').then((t) => {
        return axios.get(url, { headers: {authorization: sent_token ? sent_token : t} })
            .then(({data: { data }}) => data)
    })
}

export function getUser(user_id){
    const url = `http://18.228.199.251:5000/getuser?id=${user_id}`

    return AsyncStorage.getItem('token').then((t) => {
        return axios.get(url, { headers: {authorization: t} })
            .then(({data: { data }}) => data)
    })
}

export function getUsersBy(id, type){
    const url = `http://18.228.199.251:5000/getusers?user_id=${id}&user_type=${type}`
    
    return axios.get(url)
        .then(({data: { data }}) => data)
}

export function updateUser(id, data){
    const url = `http://18.228.199.251:5000/updateaccount`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.put(url, {id, ...data}, { headers: {authorization: t} })
            .then(({data: { data }}) => data)
    })
}

export function deleteUser(user_id, deleted_id){
    const url = `http://18.228.199.251:5000/deleteuser?user_id=${user_id}&deleted_id=${deleted_id}`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.delete(url, { headers: {authorization: t} })
            .then(({data: { data }}) => data)
    })
}

export function uploadUserImage(id, data, name, type, mime){
    const url = `http://18.228.199.251:5000/uploaduserdata`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.post(url, {
            data, 
            name,
            id,
            type,
            mime
        }, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function createEvent(user_id, name, related_to, data){
    const url = `http://18.228.199.251:5000/createevent`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.post(url, {
            user_id, 
            name,
            related_to,
            ...data
        }, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function uploadData(store_type, event_id, data){
    const url = `http://18.228.199.251:5000/uploaddata?store_type=${store_type}`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.post(url, {
            event_id, 
            data,
        }, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function updateEvent(id, data){
    const url = `http://18.228.199.251:5000/updateevent`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.put(url, {event_id: id, ...data}, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function deleteEvent(user_id, event_id){
    const url = `http://18.228.199.251:5000/deleteevents?user_id=${user_id}&event_id=${event_id}`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.delete(url, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function deleteEventData(user_id, media_id){
    const url = `http://18.228.199.251:5000/deleteeventdata?user_id=${user_id}&media_id=${media_id}`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.delete(url, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function getRequests(user_id){
    const url = `http://18.228.199.251:5000/getrequests?id=${user_id}`
    
    return axios.get(url).then(({data: { data }}) => data)
}

export function createRequest(obj){
    const url = `http://18.228.199.251:5000/createrequest`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.post(url, obj, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function updateRequest(user_id, request_id, status){
    const url = `http://18.228.199.251:5000/updaterequest`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.put(url, { user_id, request_id, status }, { headers: {authorization: t} }).then(({data: { data }}) => data)
    })
}

export function getConfig(){
    const url = `http://18.228.199.251:5000/getconfig`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.get(url, { headers: {authorization: t} })
            .then(({data: { data }}) => data)
    })
}

export function getPortfolios(){
    const url = `http://18.228.199.251:5000/getportfolios`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.get(url, { headers: {authorization: t} })
            .then(({data: { data }}) => data)
    })
}

export function getEventRequest(user_id, event_id){
    const url = `http://18.228.199.251:5000/getevent?user_id=${user_id}&event_id=${event_id}`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.get(url, { headers: {authorization: t} })
            .then(({data: { data }}) => data)
    })
}

export function sendPassRequest(email){
    const url = `http://18.228.199.251:5000/send_reset_request`
    
    return axios.post(url, { email }).then(({data: { data }}) => data)
}

export function verifyRequest(email, code, hash){
    const url = `http://18.228.199.251:5000/verify_request`
    
    return axios.post(url, { email, code, hash }).then(({data: { data }}) => data)
}

export function resetPassword(email, password, confirm_password){
    const url = `http://18.228.199.251:5000/reset_password`
    
    return axios.post(url, { email, password, confirm_password }).then(({data: { data }}) => data)
}

export function setRequest(data){
    const url = `http://18.228.199.251:5000/setrequest`
    
    return AsyncStorage.getItem('token').then((t) => {
        return axios.put(url, data, { headers: {authorization: t} })
            .then(({data: { data }}) => data)
    })
}

