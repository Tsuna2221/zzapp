import React, { createContext, useState } from 'react'

export const EventContext = createContext()

const EventContextProvider = ({children}) => {
    const [events, setEvents] = useState([])
    const [searchFilter, setSearchFilter] = useState("")
    const getEvent = (event_id) => events.filter(({id}) => parseInt(event_id) === id)[0]

    const addMediaTo = async (event_id, medias) => {
        let eventCopy = events.filter(({id}) => parseInt(event_id) === id)[0]
        return eventCopy.images.unshift(...medias)
    }

    const removeMediaFrom = async (event_id, media_id) => {
        let eventsCopy = [...events]
        let eventCopy = events.filter(({id}) => parseInt(event_id) === id)[0]
       
        eventCopy.images = eventCopy.images.filter(({id}) => media_id !== id)
        eventsCopy.filter(({id}) => id !== event_id).push(eventCopy)

        setEvents(eventsCopy)
    }

    const addEvent = async (event) => {
        let eventsCopy = [...events]
        eventsCopy.unshift(event)

        setEvents(eventsCopy)
    }

    const removeEvent = async (event_id) => setEvents([...events.filter(({id}) => id !== event_id)])

    const updateRelated = (event_id, type, list) => {
        let eventsCopy = [...events]
        let eventCopy = eventsCopy.filter(({id}) => parseInt(event_id) === id)[0]

        eventCopy.related[type === "pro" ? "pros" : "clients"] = list
        eventsCopy.filter(({id}) => id !== event_id).push(eventCopy)

        setEvents(eventsCopy)
    }

    const updateStatus = (event_id, status) => {
        let eventsCopy = [...events]
        let eventCopy = eventsCopy.filter(({id}) => parseInt(event_id) === id)[0]

        eventCopy.current_status = status
        eventsCopy.filter(({id}) => id !== event_id).push(eventCopy)

        setEvents(eventsCopy)
    }

    const updatePros = async (event_id, list) => {
        let eventsCopy = [...events]
        let eventCopy = eventsCopy.filter(({id}) => parseInt(event_id) === id)[0]

        eventCopy.related.pros = list
        eventsCopy.filter(({id}) => id !== event_id).push(eventCopy)

        setEvents(eventsCopy)
    } 

    return (
        <EventContext.Provider value={{events, updateStatus, updatePros, setEvents, getEvent, addMediaTo, removeMediaFrom, addEvent, removeEvent, updateRelated, searchFilter, setSearchFilter}}>
            {children}
        </EventContext.Provider>
    )
}

export default EventContextProvider;