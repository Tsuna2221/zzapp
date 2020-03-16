import React, { Component, Fragment } from 'react';
import Cookies from 'js-cookie'

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

//Components 
import Login from './components/Login'
import Main from './components/main'

//Contexts
import UserContextProvider from './contexts/UserContext'
import EventContextProvider from './contexts/EventContext'
import ConfirmContextProvider from './contexts/ConfirmContext'

class App extends Component {
    render() {
        const token = Cookies.get('token')

        return (
            <ConfirmContextProvider>
                <EventContextProvider>
                    <UserContextProvider>
                        <Router>
                            <div className='App'>
                                <Route path="/login" component={Login} />

                                {
                                    token ? 
                                        <Route path="/" component={Main} />
                                    :
                                        <Fragment>
                                            <Route path="/" component={Main} />
                                            <Redirect to="/login"/>
                                        </Fragment>
                                }
                            </div>
                        </Router>
                    </UserContextProvider>
                </EventContextProvider>
            </ConfirmContextProvider>
        );
    }

    state = {

    }
}

export default App;