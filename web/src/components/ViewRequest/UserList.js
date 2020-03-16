import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import Fade from 'react-reveal/Fade';

//Contexts
import { UserContext } from '../../contexts/UserContext'

//Assets
import Placeholder from '../../assets/profile.png'
import Arrow from '../../assets/arrow-right.png'

//Client
import { getUsersBy, deleteUser, updateUser } from  '../client'

//Assets
import Plus from '../../assets/black-plus.png'

//Partials
import { parsedDate } from  '../partials'

class UserList extends Component {
    static contextType = UserContext;

    render() {    
        const { state: { userList, modalActive, isLoading }, props: { addUser, selected } } = this

        return (
            <Fragment>
                <Fade cascade collapse duration={200}>
                    <div className={`set-area overflow-y-scroll bg-white`}>
                        <div>
                            <div className="mar-t-26 mar-b-18 mar-h-20 d-flex a-between">
                                <p className="c-black s-20 f-roboto">{selected.label}</p>
                            </div>
                            {
                                isLoading ? 
                                    <div className="cw-max-area d-flex a-center">
                                        <div className="spinner mini"></div>
                                    </div>
                                :
                                    userList.map((user, index) => {
                                        const { name, id, avatar_name, created_at, account_type, status } = user
                                        const { fullDate, hoursString } = parsedDate(created_at)
                                        return (
                                            <div onClick={() => addUser(user)} className="user-list-cell clickable low d-flex a-vertical a-between mar-h-12 z-index-150" key={id}>
                                                <div className="user-details d-flex a-vertical">
                                                    <img className="mar-12 br-circle" src={avatar_name ? `http://18.228.199.251:5000/static/${avatar_name}?${Math.random()}` : Placeholder} alt=""/>
                                                    <div>
                                                        <p className="c-black s-16 f-roboto w-medium">{name}</p>
                                                    </div>
                                                </div>
                                                <div className="right-details d-flex a-vertical mar-r-12">
                                                    <div className="d-flex mar-r-10 a-vertical"></div>
                                                    <img src={Arrow} alt=""/>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                </Fade>
            </Fragment>
        );
    }

    state = {
        userList: [],
        modalActive: false,
        isLoading: true
    }

    componentDidMount = () => {
        const { value, type } = this.props.selected
        const { user } = this.context
 
        getUsersBy(user.id, 'pro')
            .then((data) => {
                const filteredData = data.filter(({status, services}) => {
                    if(status === "approved" && services){
                        if(JSON.parse(services).includes(value)){
                            return true
                        }
                    }
                })

                this.setState({...this.state, userList: filteredData, isLoading: false})
            })
            .catch(err => this.setState({...this.state, isLoading: false}))
    }
}

export default UserList;