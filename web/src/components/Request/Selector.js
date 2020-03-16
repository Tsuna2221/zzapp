import React from 'react';

const Selector = ({label, options, setValue, type, state, change, current}) => (
    <div className='selector-container'>
        <p className="c-black s-20 f-roboto mar-t-26 mar-b-12 mar-h-20">{label}</p>
        <div className="cell-container d-flex mar-h-20">
            {
                options.map(({label, value}) => (
                    <div 
                        onClick={() => change(state, value, label)} 
                        className={`cell mar-r-6 mar-t-6 s-14 f-lato clickable d-flex a-center ${state === "selectedDuration" ? "low" : ""} ${current.value === value ? "selected" : ""}`}
                    >
                        {label}
                    </div>
                ))
            }
        </div>
    </div>
)

export default Selector;