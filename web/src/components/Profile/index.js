import React, { Component, Fragment } from 'react';
import Fade from 'react-reveal/Fade';
import { Link } from "react-router-dom";

//Components
import CropModal from './CropModal'
import EditModal from './EditModal'

//Client
import { getUser, getEvents } from  '../client'

//Contexts
import { UserContext } from  '../../contexts/UserContext'

//Assets
import Star from '../../assets/star.png'
import Fill from '../../assets/star-fill.png'
import Placeholder from '../../assets/profile.png'
import Edit from '../../assets/Edit-Profile.png'
import EditGray from '../../assets/edit-gray.png'
import Arrow from '../../assets/arrow-right.png'

//Partials
import { parsedDate } from  '../partials'

class Profile extends Component {
    static contextType = UserContext;

    render() {
        const { user: { banner_name, avatar_name, account_type, id, mentor_id }, events } = this.state

        return (
            <Fade cascade duration={300} delay={300}>
                <CropModal id={id} type={this.state.type} image={this.state.image} toggle={() => this.setState({...this.state, cropperActive: !this.state.cropperActive})} active={this.state.cropperActive}/>
                <div style={{overflowY: "scroll"}} className='set-area profile overflow-x-hide'>
                    <div className="images pos-relative d-flex a-center">
                        {/* Avatar */}
                        
                            <div className="avatar pos-absolute br-circle d-flex a-center">
                                <div className="pos-absolute pad-10 edit z-index-50">
                                    {
                                        id === this.context.user.id ?
                                            <Fragment>
                                                <img className="edit avatar-edit clickable pos-absolute edit" src={Edit} alt=""/>
                                                <input title="" accept="image/png, image/jpeg" onChange={(e) => this.cropImage(e, "avatar")} className="no-opacity" type="file"/>
                                            </Fragment>
                                        :
                                            null
                                    }
                                </div>
                                <img id="avatar" className="cover br-circle" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt=""/>
                            </div>
                        {/* Banner */}
                        {
                            id === this.context.user.id ?
                                <div className="clickable banner-edit-container">
                                    <img className="clickable" src={Edit} alt=""/>
                                    <input title="" accept="image/png, image/jpeg" onChange={(e) => this.cropImage(e, "banner")} className="no-opacity clickable" type="file"/>
                                </div>
                            :
                                null
                        }
                        <img id="banner" className="cover" src={`http://18.228.199.251:5000/static/${banner_name}?${Math.random()}`} alt=""/>
                    </div>
                        {
                            id === this.context.user.id || this.context.user.account_type === "admin" || mentor_id === this.context.user.id ?
                                <img onClick={this.activateModal} className="edit-profile-btn clickable" src={EditGray} alt=""/>
                            :
                                null
                        }
                    {
                        account_type === "pro" || account_type === "mentor" ? 
                            <Fragment>
                                <p className="c-black s-18 f-roboto mar-l-20 mar-v-24">Minhas Classificações</p>
                                <div className="ratings cw-100 d-flex fdir-column a-vertical">
                                    {this.drawRatings()}
                                </div>
                            </Fragment>
                        :
                            null
                    }
                    {
                    this.state.user.id ? 
                        <EditModal active={{active: this.state.modalActivated, setActive: this.activateModal}} user={this.state.user}/>
                    :
                        null
                }
                {
                    events.length > 0 ?
                        <Fragment>
                            <p className="c-black s-18 f-roboto mar-l-20 mar-v-24">Eventos Relacionados</p>
                            <div className="cw-100 d-flex fdir-column a-vertical">
                                {
                                    events.filter(({current_status}) => current_status !== "rejeitado").map(({ created_at, id, name, current_status }) => {
                                        const { fullDate, hoursString } = parsedDate(created_at)

                                        return (
                                            <Link to={`/evento/${id}`} className="user-details d-flex a-vertical cw-inherit">
                                                <div className="user-list-cell d-flex a-vertical a-between mar-h-20 cw-inherit" key={id}>
                                                    <div className="pad-v-16">
                                                        <p className={`${name ? "c-black w-bold" : "c-gray w-medium"} s-16 f-roboto `}>{name ? name : "(Sem Nome)"}</p>
                                                        <p className="c-black s-14 f-roboto mar-t-6">Criado em {fullDate} às {hoursString}</p>
                                                    </div>
                                                    <div className="right-details d-flex a-vertical mar-r-12">
                                                        <p className="c-black s-14 f-roboto mar-r-14">Evento {current_status === "ongoing" ? "em andamento" : "concluído"}</p>
                                                        <img src={Arrow} alt=""/>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </Fragment>
                    :
                        null
                }
                </div>
            </Fade>
        );
    }

    state = {
        user: {},
        cropperActive: false,
        image: "",
        type: "",
        modalActivated: false,
        events: []
    }

    componentDidMount = () => {
        const { id } = this.props.match.params

        Promise.all([getEvents(id), getUser(id)]).then(([events, user]) => this.setState({...this.state, user, events}))
    }

    drawRatings = () => {
        if(this.state.user.id){
            return this.state.user.ratings.events.map(({label, rating}) => {
                let stars = []

                for(let i = 0; i < rating; i++) stars.push(<img alt="" className="s mar-h-4" key={i + 4} src={Fill}/>)
                for(let x = 0; x < 4; x++) if(stars.length < 4) stars.push(<img alt="" className="s mar-h-4" key={x + 1} src={Star}/>)
    
                return (
                    <div key={label}>
                        <p className="c-black s-16 f-roboto">{label}</p>
                        <div className="mar-12">{stars.map(el => el)}</div>
                    </div>
                )
            })
        }
    }

    cropImage = ({target}, type) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if(e.target.result){
                this.setState({...this.state, type, cropperActive: true, image: e.target.result})
            }
        };

        reader.readAsDataURL(target.files[0]);
    }

    activateModal = () => this.setState({...this.state, modalActivated: !this.state.modalActivated})
}

export default Profile;