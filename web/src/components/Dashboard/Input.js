import React from 'react'

const Input = ({label, state, stateKey, updateInput, min}) => {
    return (
        <div className="mar-r-14">
            <div style={{width: 140}} className="low mar-v-10">
                <label className="c-black s-14 f-roboto" htmlFor={stateKey}>{label}</label>
            </div>
            <input className={`config-input low mar-b-12 ${min ? "min" : ""}`} onChange={({target: {value, name}}) => updateInput(name, value)} value={state[stateKey]} name={stateKey} type="number"/>
        </div>
    )
}
const InputSplit = ({label, state, stateKey, updateInput, labelEsque}) => {
    let [min, max] = state[stateKey] ? state[stateKey].split("/") : ""
    return (
        <div className="config-input-container a-between a-vertical mar-r-14">
            <div className="mar-v-10">
                <label className="c-black s-14 f-roboto" htmlFor={stateKey}>{label} {labelEsque ? `(${labelEsque[0]}/${labelEsque[1]})` : ""}</label>
            </div>

            <div className="d-flex mar-b-18">
                <input className="config-input min mar-r-10" onChange={({target: {value, name}}) => updateInput(name, value, "min")} value={min} name={stateKey} type="number"/>
                <input className="config-input min" onChange={({target: {value, name}}) => updateInput(name, value, "max")} value={max} name={stateKey} type="number"/>
            </div>
        </div>
    )
}

export { Input, InputSplit };