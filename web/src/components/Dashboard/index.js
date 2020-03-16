import React, { Component, Fragment } from 'react';
import Fade from 'react-reveal/Fade';

//Components
import { MessageModal, activate } from '../etc/MessageModal'
import LoadingModal from '../Event/LoadingModal'
import { Input, InputSplit } from './Input'

//Client
import { getConfig, updateConfig } from  '../client'

//Contexts
import { UserContext } from  '../../contexts/UserContext'

class Dashboard extends Component {
    static contextType = UserContext;

    render() {
        const { loading } = this.state
        return (
            <Fragment>
                <LoadingModal loading={{status: loading}}/>
                <Fade duration={400}>
                    <div className='set-area overflow-y-scroll d-flex fdir-column a-between'>
                        <div className="mar-h-20">
                            <div className="mar-t-30 mar-b-18 d-flex">
                                <p className="c-black s-20 f-roboto">Gerenciar Valores</p>
                            </div>
                            <div className="d-flex mar-b-14 wrap">
                                <Input updateInput={this.updateInput} stateKey="base_avancado" state={this.state} label="Hora Base (Avançado)"/>
                                <Input updateInput={this.updateInput} stateKey="taxa_zz" state={this.state} label="Taxa ZZ"/>
                                <Input updateInput={this.updateInput} stateKey="mar_desconto" state={this.state} label="Margem Desconto %"/>
                            </div>

                            <div className="mar-t-30 mar-b-18 d-flex">
                                <p className="c-black s-20 f-roboto">Minimo e Máximo</p>
                            </div>
                            <div className="d-flex mar-b-14 wrap">
                                <InputSplit labelEsque={["Min", "Max"]} updateInput={this.updateInput} stateKey="minmax_iniciante" state={this.state} label="Iniciante"/>
                                <InputSplit labelEsque={["Min", "Max"]} updateInput={this.updateInput} stateKey="minmax_basico" state={this.state} label="Básico"/>
                                <InputSplit labelEsque={["Min", "Max"]} updateInput={this.updateInput} stateKey="minmax_intermediario" state={this.state} label="Intermediário"/>
                                <InputSplit labelEsque={["Min", "Max"]} updateInput={this.updateInput} stateKey="minmax_avancado" state={this.state} label="Avançado"/>
                            </div>

                            <div className="mar-t-30 mar-b-18 d-flex">
                                <p className="c-black s-20 f-roboto">Grau</p>
                            </div>
                            <div className="d-flex mar-b-14 wrap">
                                <Input min updateInput={this.updateInput} stateKey="grau_iniciante" state={this.state} label="Iniciante"/>
                                <Input min updateInput={this.updateInput} stateKey="grau_basico" state={this.state} label="Básico"/>
                                <Input min updateInput={this.updateInput} stateKey="grau_intermediario" state={this.state} label="Intermediário"/>
                                <Input min updateInput={this.updateInput} stateKey="grau_avancado" state={this.state} label="Avançado"/>
                            </div>

                            <div className="mar-t-30 mar-b-18 d-flex">
                                <p className="c-black s-20 f-roboto">Eventos e Serviços (Tempo / Grau)</p>
                            </div>
                            <div className="d-flex mar-b-14 wrap">
                                <InputSplit updateInput={this.updateInput} stateKey="civil" state={this.state} label="Civil"/>
                                <InputSplit updateInput={this.updateInput} stateKey="batizado" state={this.state} label="Batizado"/>
                                <InputSplit updateInput={this.updateInput} stateKey="ensaio" state={this.state} label="Ensaio"/>
                                <InputSplit updateInput={this.updateInput} stateKey="casamento" state={this.state} label="Casamento"/>
                                <InputSplit updateInput={this.updateInput} stateKey="corporativo" state={this.state} label="Corporativo"/>
                                <InputSplit updateInput={this.updateInput} stateKey="debutante" state={this.state} label="Debutante"/>
                                <InputSplit updateInput={this.updateInput} stateKey="aniversario" state={this.state} label="Aniversário"/>
                                <InputSplit updateInput={this.updateInput} stateKey="making_of" state={this.state} label="Making Of"/>
                                <InputSplit updateInput={this.updateInput} stateKey="making_of_noivo" state={this.state} label="Making Of Noivo"/>
                                <InputSplit updateInput={this.updateInput} stateKey="video_edicao" state={this.state} label="Video Edição"/>
                                <InputSplit updateInput={this.updateInput} stateKey="tratamento_fotos" state={this.state} label="Tratamento de Fotos"/>
                                <InputSplit updateInput={this.updateInput} stateKey="diagramação_album" state={this.state} label="Diagramação Álbum"/>
                                <InputSplit updateInput={this.updateInput} stateKey="ensaio_pre_evento" state={this.state} label="Ensaio Pre-Evento"/>
                            </div>

                            <div className="mar-t-30 mar-b-18 d-flex">
                                <p className="c-black s-20 f-roboto">Outros</p>
                            </div>
                            <div className="d-flex mar-b-14 wrap">
                                <Input updateInput={this.updateInput} stateKey="retrospectiva" state={this.state} label="Retrospectiva"/>
                                <Input updateInput={this.updateInput} stateKey="wedding_story" state={this.state} label="Wedding Story"/>
                                <Input updateInput={this.updateInput} stateKey="quadro_60x80cm" state={this.state} label="Quadro 60x80cm"/>
                                <Input updateInput={this.updateInput} stateKey="premium_30x30cm_box" state={this.state} label="Álbum Premium 30x30cm 40p Box"/>
                                <Input updateInput={this.updateInput} stateKey="master_30x30cm_box" state={this.state} label="Álbum Master 30x30cm 40p Box"/>
                                <Input updateInput={this.updateInput} stateKey="premium_24x30cm_box" state={this.state} label="Álbum Premium 24x30cm 40p Box"/>
                                <Input updateInput={this.updateInput} stateKey="master_24x30cm_box" state={this.state} label="Álbum Master 24x30cm 40p Box"/>
                                <Input updateInput={this.updateInput} stateKey="master_20x30cm_box" state={this.state} label="Álbum Master 20x30cm 20p 20x30cm"/>
                                <Input updateInput={this.updateInput} stateKey="sogra_premium_15x15cm_box" state={this.state} label="Kit Sogra Premium (15x15cm)"/>
                                <Input updateInput={this.updateInput} stateKey="sogra_master_15x15cm_box" state={this.state} label="Kit Sogra Master (15x15cm)"/>
                                <Input updateInput={this.updateInput} stateKey="locucao_2_min" state={this.state} label="Locução 2 min"/>
                                <Input updateInput={this.updateInput} stateKey="trilha_sonora" state={this.state} label="Trilha Sonora"/>
                                <Input updateInput={this.updateInput} stateKey="kit_resultado" state={this.state} label="Kit Resultado"/>
                                <Input updateInput={this.updateInput} stateKey="pencard" state={this.state} label="Pencard"/>
                            </div>

                        </div>
                        <div onClick={this.update} className="save-config-btn user-btn">Salvar</div>
                    </div>
                    <MessageModal status="success" name="update_config" message=":D"/>
                </Fade>
            </Fragment>
        );
    }

    state = {
        loading: true,
        form: {}
    }
    
    componentDidMount = () => getConfig().then(res => this.setState({...this.state, loading: false, ...res.config, ...res.sets, ...res.kits}))

    updateInput = (key, value, type) => {
        var formCopy = {...this.state.form}

        if(!type){
            formCopy[key] = value

            this.setState({...this.state, [key]: value, form: formCopy})
        }else{
            let split = this.state[key].split("/")
            split[type === "min" ? 0 : 1] = value

            formCopy[key] = `${split[0]}/${split[1]}`
            this.setState({...this.state, [key]: formCopy[key], form: formCopy})
        }
    }

    update = () => updateConfig(this.state.form).then(() => window.location.reload())
}

export default Dashboard;