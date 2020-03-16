import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

//Client
import { uploadData } from  '../client'

//Contexts
import { UserContext } from '../../contexts/UserContext'

class CropModal extends Component {
    static contextType = UserContext;

    _crop(){
        const { type, id, toggle } = this.props
        const data = this.refs.cropper.getCroppedCanvas().toDataURL();
        uploadData(type, id, data)
            .then(({file_name}) => this.context.setImage(file_name, type))
            .then(toggle)
            .then(() => document.getElementById(type).setAttribute("src", data))
    }

    render() {
        const {active, image, toggle, type} = this.props
        return (
            <div className={`d-flex fdir-column a-center crop-modal pos-absolute cw-100 ch-100 z-index-200 ${!active ? "inactive" : "active"}`}>
                <Cropper
                    src={image}
                    style={{maxHeight: type === 'avatar' ? 500 : 402, maxWidth: type === 'avatar' ? 500 : 1127}}
                    guides={false}
                    aspectRatio={type === 'avatar' ? 1 / 1 : 1127 / 500}
                    ref='cropper'
                    background={false}
                    viewMode={1}
                    scalable={false}
                    data={{width: type === 'avatar' ? 500 : 1127, height: type === 'avatar' ? 500 : 402}} //1127x402
                />     
                <div className="crop-buttons d-flex">
                    <div className="crop-btn" onClick={() => this._crop()}>Salvar</div>
                    <div className="crop-btn" onClick={toggle}>Cancelar</div>
                </div>    
            </div>
        );
    }

    state = {
        data: ""
    }
}

export default CropModal;