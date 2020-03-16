import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade';

//Client
import { getPortfolios } from '../client'

class Portfolios extends Component {
    render() {
        return (
            <Fragment>
                <Fade duration={300}>
                    <div className="set-area overflow-y-scroll d-flex main-container fdir-column a-vertical">
                        <div style={{width: "95%"}}>
                            <div className="mar-t-26 cw-100">
                                <p className="c-black s-20 f-roboto">Portfólios</p>
                            </div>
                            {
                                this.state.events.length > 0 ?
                                    this.state.events.sort((a, b) => b.id - a.id).map(({ name, request, images, id, current_status }) => {
                                        let validImages = images.sort((a, b) => b.id - a.id).filter((data, index) => index < 5)
                                        return (
                                            <Link to={{pathname: `/evento/${id}`}} className='EventContainer mar-b-18'>
                                                <div className="d-flex a-between">
                                                    <p className={`f-roboto s-20 w-black mar-t-26 mar-b-18 ${!name ? "c-gray w-medium" : "c-black"} `}>{name}</p>
                                                </div>
                                                <div style={{maxWidth: validImages.length > 0 ? "min-content" : null}} className="d-flex">
                                                    {
                                                        validImages.length > 0 ?
                                                            validImages.map(({id, name, type}, index) => (
                                                                <Fragment key={id}>
                                                                    <Fade duration={500}>
                                                                        {
                                                                            index === 4 ?
                                                                                <div className="event-cell">
                                                                                    <div className="last-overlay d-flex a-center f-roboto w-black c-white s-22">+{images.length - 4}</div>
                                                                                    <img className="cover" src={`http://18.228.199.251:5000/static/${type.includes("video") ? `thumb-${name}.jpg` : name}`} alt=""/>
                                                                                </div>
                                                                            :
                                                                                <div className="event-cell mar-r-10">
                                                                                    <img className="cover" src={`http://18.228.199.251:5000/static/${type.includes("video") ? `thumb-${name}.jpg` : name}`} alt=""/>
                                                                                </div>
                                                                        }
                                                                    </Fade>
                                                                </Fragment>
                                                            ))
                                                        :
                                                            <div className="cw-100 d-flex a-center">
                                                                <span className="c-black f-roboto s-16 pad-v-30">Nenhuma imagem encontrada</span>
                                                            </div>
                                                    }
                                                </div>
                                            </Link>
                                        )
                                    })
                                :
                                    <div className="cw-100 d-flex a-center">
                                        <span className="c-black f-roboto s-16 pad-v-30">Nenhum portfólio encontrado</span>
                                    </div>
                            }
                        </div>
                    </div>
                </Fade>
            </Fragment>
        );
    }

    state = {
        events: []
    }

    componentDidMount = () => {
        getPortfolios().then(events => this.setState({...this.state, events}))
    }
}

export default Portfolios;