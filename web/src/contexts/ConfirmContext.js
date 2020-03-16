import React, { createContext, useState } from 'react'

export const ConfirmContext = createContext()

const ConfirmContextProvider = ({children}) => {
    const [active, activateModal] = useState(false)
    const [config, setConfig] = useState({
        label: "",
        text: "",
        leftLabel: "",
        leftFunc: () => null,
        rightLabel: "",
        rightFunc: () => null,
    })

    return (
        <ConfirmContext.Provider value={{config, setConfig, active, activateModal}}>
            {children}
        </ConfirmContext.Provider>
    )
}

export default ConfirmContextProvider;