import React from 'react';

//Assets
import Close from '../../assets/Close-Black.png'

const SelectSet = ({active, addToSetList, currentSelected, type}) => {
    const set = [
        { label: 'Cinegrafistas', value: "cinegrafistas", type: "evento", exc: [] },
        { label: 'Fotógrafos', value: "fotografos", type: "evento", exc: [] },
        { label: 'Civil', value: "civil", type: "evento", exc: ["casamento"] },

        { label: 'Making Of', value: "making_of", type: "servico", exc: ["debutante", "casamento"], except: true },
        { label: 'Making Of Noivo', value: "making_of_noivo", type: "servico", exc: ["casamento"], except: true },
        { label: 'Ensaio Pre-Evento', value: "ensaio_pre_evento", type: "servico", except: true, exc: [] },
        // { label: 'Vídeo Edição', value: "video_edicao", type: "servico" },
        // { label: 'Tratamento Fotos', value: "tratamento_fotos", type: "servico" },
        // { label: 'Diagramação Álbum', value: "diagramação_album", type: "servico" },
        
        { label: 'Retrospectiva', value: "retrospectiva", type: "outros", except: true, exc: [] },
        { label: 'Wedding Story', value: "wedding_story", type: "outros", except: true, exc: ["casamento"] },
        { label: 'Quadro 60x80cm', value: "quadro_60x80cm", type: "outros", except: true, exc: [] },
        { label: 'Álbum Premium 30x30cm 40p Box', value: "premium_30x30cm_box", type: "outros", album: true, except: true, exc: [] },
        { label: 'Álbum Master 30x30cm 40p Box', value: "master_30x30cm_box", type: "outros", album: true, except: true, exc: [] },
        { label: 'Álbum Premium 24x30cm 40p Box', value: "premium_24x30cm_box", type: "outros", album: true, except: true, exc: [] },
        { label: 'Álbum Master 24x30cm 40p Box', value: "master_24x30cm_box", type: "outros", album: true, except: true, exc: [] },
        { label: 'Álbum Master 20x30cm 20p 20x30cm', value: "master_20x30cm_box", type: "outros", album: true, except: true, exc: [] },
        { label: 'Kit Sogra Premium (15x15cm)', value: "sogra_premium_15x15cm_box", type: "outros", exc: ["casamento"], except: true },
        { label: 'Kit Sogra Master (15x15cm)', value: "sogra_master_15x15cm_box", type: "outros", except: true, exc: ["casamento"] },
        { label: 'Locução 2 min', value: "locucao_2_min", type: "outros", exc: ["corporativo"] },
        { label: 'Trilha Sonora', value: "trilha_sonora", type: "outros", exc: ["corporativo"] },
    ]

    const validSets = () => {
        const normal = set.filter(({exc}) => exc.length === 0)
        const append = set.filter(({exc}) => exc.includes(type))
        const currentSets = currentSelected.map(({value}) => value)
        normal.push(...append)

        const result = () => {
            const cells = normal.filter(({value}) => !currentSets.includes(value))

            if(type === "corporativo"){
                return cells.filter(({except}) => !except)
            }else{
                return cells
            }
        }

        return result()
    }

    const cell = (labelSel, filter) => (
        <div className={filter === "outros" ? "pad-b-180" : ""}>
            <p className="c-black s-16 f-roboto mar-t-26 mar-b-12 mar-h-20">{labelSel}</p>
            {
                validSets().filter(({type}) => type === filter).map((item) => (
                    <div onClick={() => addToSetList({...item, obs: null, qty: 1})} className="sel-set-cell mar-h-10 clickable">
                        <p className="c-black s-14 f-roboto pad-14 mar-l-14">{item.label}</p>
                    </div>
                ))
            }
        </div>
    )

    return (
        <div className={`set-area select-set overflow-y-scroll ${active.activated ? "" : "no-events no-opacity"}`}>
            <div className="mar-t-26 mar-b-12 mar-h-20 d-flex a-between">
                <p className="c-black s-20 f-roboto">Serviços e Produtos</p>
                <img onClick={active.setActive} className="edit-close clickable" src={Close} alt=""/>
            </div>

            {cell('Evento', 'evento')}
            {cell('Serviço', 'servico')}
            {cell('Outros', 'outros')}
        </div>
    )
}

export default SelectSet;