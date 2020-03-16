import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Cookies from 'js-cookie'

//Auth
import { loginUser, getEvents, getPortfolios } from './client'

//Components
import Header from './etc/Header'
import Sidebar from './etc/Sidebar'
import ConfirmModal from './etc/ConfirmModal'
import Event from './Event'
import EventDetails from './Event/EventDetails'
import Manage from './Manage'
import Profile from './Profile'
import Request from './Request'
import Portfolios from './Event/Portfolios'
import ViewRequest from './ViewRequest'
import Dashboard from './Dashboard'

//Contexts
import { UserContext } from '../contexts/UserContext'

class Main extends Component {
    static contextType = UserContext;
    render() {
        const { pathname } = this.props.location
        const { account_type } = this.context.user

        return (
            <Router>
                {
                    pathname !== '/login' && this.context.user.id ? 
                        <div className="d-flex">
                            <Sidebar type={account_type} path={pathname} />
                            <div className="cw-fill">
                                <Header/>
                                <Route exact path="/" component={Event} />
                                <Route exact path="/portfolio" component={Portfolios} />
                                <Route exact path="/evento/:id" component={EventDetails} />
                                <Route exact path="/gerenciar/clientes" component={Manage} />
                                <Route exact path="/gerenciar/profissionais" component={Manage} />
                                <Route exact path="/gerenciar/administradores" component={Manage} />
                                <Route exact path="/gerenciar/valores" component={account_type === "mentor" || account_type === "admin" ? Dashboard : (null)} />
                                <Route exact path="/perfil/:id" component={Profile} />
                                <Route exact path="/orcamento" component={account_type === "client" ? Request : null}/>
                                {/* <Route exact path="/orcamento" 
                                    component={account_type === "client" ? Request : account_type === "admin" ? ViewRequest : null} 
                                /> */}
                            </div>
                            <ConfirmModal/>
                        </div>
                    :
                        null
                }
            </Router>
        );
    }

    state = {

    }

    componentDidMount = () => {
        const { setUser, setEvents } = this.context
        const token = Cookies.get('token')
        
        if(token){
            loginUser(token)
                .then((user) => {
                    Promise.all([getEvents(user.id, token), getPortfolios()])
                        .then(([events, portfolios]) => {
                            const allEvents = [...events, ...portfolios]
                            const filteredArr = allEvents.reduce((acc, current) => {
                                const x = acc.find(item => item.id === current.id);
                                if (!x) {
                                    return acc.concat([current]);
                                } else {
                                    return acc;
                                }
                            }, []);

                            setUser(user)
                            setEvents(filteredArr)
                        })
                })
                .catch(() => {
                    Cookies.remove('token')
                    window.location.reload()
                })
        }
    }
}

export default Main;