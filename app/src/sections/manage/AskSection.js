import React, { Component, Fragment } from 'react';
import { ScrollView } from 'react-native';

import { ManageHeader } from '../etc/Headers'
import Selector from './Selector'

import { sectionValues } from '../partials'

export class EventType extends Component {
    render() {
        const { navigate, goBack } = this.props.navigation

        return (
            <Fragment>         
                <ManageHeader name="Tipo de Evento" changeView={() => goBack()}/>   
                <ScrollView>
                    {
                        sectionValues.type.map(({label, value}) => (
                            <Selector key={value} label={label} onPress={() => navigate("AskEvent", {selectedType: {label, value}})}/>
                        ))
                    }
                </ScrollView>
            </Fragment>
        );
    }
}

export class EventLevel extends Component {
    render() {
        const { navigate, goBack } = this.props.navigation

        return (
            <Fragment>         
                <ManageHeader name="Nível" changeView={() => goBack()}/>   
                <ScrollView>
                    {
                        sectionValues.level.map(({label, value}) => (
                            <Selector key={value} label={label} onPress={() => navigate("AskEvent", {selectedLevel: {label, value}})}/>
                        ))
                    }
                </ScrollView>
            </Fragment>
        );
    }
}

export class EventResult extends Component {
    render() {
        const { navigate, goBack } = this.props.navigation

        return (
            <Fragment>         
                <ManageHeader name="Resultado" changeView={() => goBack()}/>   
                <ScrollView>
                    {
                        sectionValues.result.map(({label, value}) => (
                            <Selector key={value} label={label} onPress={() => navigate("AskEvent", {selectedResult: {label, value}})}/>
                        ))
                    }
                </ScrollView>
            </Fragment>
        );
    }
}

export class EventDuration extends Component {
    render() {
        const { navigate, goBack } = this.props.navigation

        return (
            <Fragment>         
                <ManageHeader name="Duração" changeView={() => goBack()}/>   
                <ScrollView>
                    {
                        sectionValues.duration.map(({label, value}) => (
                            <Selector key={value} label={label} onPress={() => navigate("AskEvent", {selectedDuration: {label, value}})}/>
                        ))
                    }
                </ScrollView>
            </Fragment>
        );
    }
}