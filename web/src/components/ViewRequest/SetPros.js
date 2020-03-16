import React, { Component, Fragment } from 'react';
import Fade from 'react-reveal/Fade';

import UserList from './UserList'
import LoadingModal from '../Event/LoadingModal';

//Client
import { createEvent, updateRequest, updateEvent } from  '../client'

//Contexts
import { UserContext } from  '../../contexts/UserContext'

class SetPros extends Component {
    static contextType = UserContext;
    
    render() {
        const { state: { list, selected, users, loading } } = this
        return (
            <Fragment>
                <LoadingModal loading={{status: loading}}/>
                <Fade duration={400}>
                    <div className={`set-area overflow-y-scroll bg-white z-index-100`}>
                        <p className="f-roboto c-black s-20 w-black mar-h-20 mar-t-26 mar-b-18">Selecionar Profissionais</p>
                        <div>
                            {
                                list.length > 0 ?
                                    list.map((item, index) => {
                                        let { label, type, value } = item
                                        return (
                                            <div onClick={() => this.toggleUsers(item)} className="user-list-cell d-flex a-vertical a-between mar-h-12 clickable" key={index}>
                                                <div className="user-details d-flex a-vertical">
                                                    <p className={`c-black s-14 f-roboto pad-14 ${users[type] ? "w-bold" : "w-regular"}`}>{label}{`${users[type] ? `: ${users[type].name}` : ""}`}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    <div className="cw-100 d-flex a-center">
                                        <span className="c-black f-roboto s-16 pad-v-30">Nenhum profissional a ser atribuído</span>
                                    </div>
                            }
                        </div>
                        {
                            this.state.usersVisible ? 
                                <UserList selected={selected} addUser={(user) => this.addUser(user).then(() => this.toggleUsers())}/>
                            :
                                null
                        }
                        {
                            Object.keys(this.state.users).length === this.state.list.length ? 
                                <div onClick={this.confirmEvent} className="user-btn pos-absolute edit-save-btn">Confirmar</div>
                            :   
                                null
                        }
                    </div>
                </Fade>
            </Fragment>
        );
    }

    state = {
        list: [],
        usersVisible: false,
        selected: {},
        users: [],
        request: this.props.request,
        loading: false
    }

    confirmEvent = () => {
        const { users, request } = this.state, { eventId, name, created, updatePros, hide } = this.props
        let idList = [...new Set(Object.keys(users).map((i) => users[i].id))]
        let usersList = [...new Set(Object.keys(users).map((i) => users[i]))]
        let filteredArr = usersList.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        
        this.setState({...this.state, loading: true})

        if(created === true){
            updateEvent(eventId, {name, status: 'agendado', related_pros: idList})
                .then(() => updateRequest(this.context.user.id, request.id, "accepted").then(() => window.location.href = `/evento/${eventId}`))
        }else if(!created){
            updateEvent(eventId, {related_pros: filteredArr.map(({id}) => id)})
                .then(() => updatePros(eventId, filteredArr))
                .then(() => this.setState({...this.state, loading: false}))
                .then(() => hide())
        }else{
            createEvent(this.context.user.id, name, request.id, {related_pros: idList, status: "agendado", related_clients: [request.client_id]})
                .then((event) => {updateRequest(this.context.user.id, request.id, "accepted"); return event})
                .then((event) => window.location.href = `/evento/${event.id}`)
        }
    }

    addUser = async (user) => this.setState({...this.state, users: {...this.state.users, [this.state.selected.type]: {id: user.id, name: user.name, avatar_name: user.avatar_name}} })

    toggleUsers = (item) => this.setState({...this.state, usersVisible: !this.state.usersVisible, selected: item ? item : {}})

    componentDidMount = () => {
        const { request } = this.state
        const albums = ["premium_30x30cm_box", "master_30x30cm_box", "premium_24x30cm_box", "master_24x30cm_box", "master_20x30cm_box"]
        var array = []
        let parsedList = request.set.map(({ label, value, qty }, index) => {
            function listing(num) {
                var arr = Array.apply(null, Array(num));
                return arr.map(function (el, index) { return { value, type: value + index, label: label.substr(0, label.length - 1) + " " + (index + 1) }; });
            };

            return {
                value,
                item: listing(qty),
            }
        })
        let filteredList = parsedList.filter(({value}) => value === "cinegrafistas" || value === "fotografos")
        let filter = filteredList.map(({value}) => value)

        for(let i in filteredList){
            array.push(...filteredList[i].item)
        }

        if(filter.includes("cinegrafistas")){
            array.push(
                {
                    value: "video_edicao",
                    type: "video_edicao",
                    label: "Video Edição"
                }
            )
        } 
        if(filter.includes("fotografos")){
            array.push(
                {
                    value: "tratamento_fotos",
                    type: "tratamento_fotos",
                    label: "Tratamento de Fotos"
                }
            )
        }
        
        if(request.set.map(({value}) => value).some(r=> albums.indexOf(r) >= 0)){
            array.push(
                {
                    value: "diagramacao_album",
                    type: "diagramacao_album",
                    label: "Diagramação de Álbum"
                }
            )
        }

        this.setState({...this.state, list: array})
    };
}

export default SetPros;

{/* <div className="user-list-cell d-flex a-vertical a-between mar-h-12" key={id}>
        <div className="user-details d-flex a-vertical">
            <img className="mar-12 br-circle" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt=""/>
            <p className="c-black s-16 f-roboto w-bold">{name}</p>
        </div>
    </div> */}