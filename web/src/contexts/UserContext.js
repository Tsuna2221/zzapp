import React, { createContext, useContext, useState } from 'react'

//Context
import { EventContext } from './EventContext'

export const UserContext = createContext()

const UserContextProvider = ({children}) => {
    const { setEvents } = useContext(EventContext)
    const [user, setUser] = useState({})
    const [path, setLocation] = useState("")

    const setImage = (name, type) => {
        const currentUser = {...user}
        currentUser[type === "avatar" ? "avatar_name" : "banner_name"] = name

        setUser(currentUser)
    }

    return (
        <UserContext.Provider value={{user, setEvents, setUser, setImage, path, setLocation}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;