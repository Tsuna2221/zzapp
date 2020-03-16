export default class Orcamento {
    constructor(config){
        this.config = config
        this.mainConfig = config.config
        this.sets = config.sets
        this.kits = config.kits
        this.constants = {
            grau_avancado: config.config.grau_avancado,
            base_avancado: config.config.base_avancado,
            grau_casamento: parseInt(config.sets.casamento.split('/')[1]),
            taxa_zz: config.config.taxa_zz,
            mar_desconto: config.config.mar_desconto,
            nf: config.config.nf,
            base_tratamento: config.config.base_tratamento,
            multiplicador: 1/(1-config.config.taxa_zz/100)/(1-config.config.mar_desconto/100)/(1-config.config.nf/100),
            minmax: {
                iniciante: {
                    min: parseInt(config.config.minmax_iniciante.split('/')[0]),
                    max: parseInt(config.config.minmax_iniciante.split('/')[1]),
                },
                basico: {
                    min: parseInt(config.config.minmax_basico.split('/')[0]),
                    max: parseInt(config.config.minmax_basico.split('/')[1]),
                },
                intermediario: {
                    min: parseInt(config.config.minmax_intermediario.split('/')[0]),
                    max: parseInt(config.config.minmax_intermediario.split('/')[1]),
                }, 
                avancado: {
                    min: parseInt(config.config.minmax_avancado.split('/')[0]),
                    max: parseInt(config.config.minmax_avancado.split('/')[1]),
                }
            },
            niveis: {
                iniciante: config.config.grau_iniciante,
                basico: config.config.grau_basico,
                intermediario: config.config.grau_intermediario, 
                avancado: config.config.grau_avancado
            }
        }
        this.pacotes = {
            civil:{
                tempo: parseInt(config.sets.civil.split('/')[0]),
                grau: parseInt(config.sets.civil.split('/')[1])
            },
            batizado: {
                tempo: parseInt(config.sets.batizado.split('/')[0]),
                grau: parseInt(config.sets.batizado.split('/')[1])
            },
            ensaio:{
                tempo: parseInt(config.sets.ensaio.split('/')[0]),
                grau: parseInt(config.sets.ensaio.split('/')[1])
            },
            casamento:{
                tempo: parseInt(config.sets.casamento.split('/')[0]),
                grau: parseInt(config.sets.casamento.split('/')[1])
            },
            corporativo:{
                tempo: parseInt(config.sets.corporativo.split('/')[0]),
                grau: parseInt(config.sets.corporativo.split('/')[1])
            },
            debutante:{
                tempo: parseInt(config.sets.debutante.split('/')[0]),
                grau: parseInt(config.sets.debutante.split('/')[1])
            },
            aniversario:{
                tempo: parseInt(config.sets.aniversario.split('/')[0]),
                grau: parseInt(config.sets.aniversario.split('/')[1])
            },
            making_of:{
                tempo: parseInt(config.sets.making_of.split('/')[0]),
                grau: parseInt(config.sets.making_of.split('/')[1])
            },
            making_of_noivo:{
                tempo: parseInt(config.sets.making_of_noivo.split('/')[0]),
                grau: parseInt(config.sets.making_of_noivo.split('/')[1])
            },
            video_edicao:{
                tempo: parseInt(config.sets.video_edicao.split('/')[0]),
                grau: parseInt(config.sets.video_edicao.split('/')[1])
            },
            tratamento_fotos:{
                tempo: parseInt(config.sets.tratamento_fotos.split('/')[0]),
                grau: parseInt(config.sets.tratamento_fotos.split('/')[1])
            },
            diagramação_album:{
                tempo: parseInt(config.sets.diagramação_album.split('/')[0]),
                grau: parseInt(config.sets.diagramação_album.split('/')[1])
            },
            ensaio_pre_evento:{
                tempo: parseInt(config.sets.ensaio_pre_evento.split('/')[0]),
                grau: parseInt(config.sets.ensaio_pre_evento.split('/')[1])
            },
        }
        this.kits = {
            retrospectiva: config.kits.retrospectiva,
            wedding_story: config.kits.wedding_story,
            quadro_60x80cm: config.kits.quadro_60x80cm,
            premium_30x30cm_box: config.kits.premium_30x30cm_box,
            master_30x30cm_box: config.kits.master_30x30cm_box,
            premium_24x30cm_box: config.kits.premium_24x30cm_box,
            master_24x30cm_box: config.kits.master_24x30cm_box,
            master_20x30cm_box: config.kits.master_20x30cm_box,
            sogra_premium_15x15cm_box: config.kits.sogra_premium_15x15cm_box,
            sogra_master_15x15cm_box: config.kits.sogra_master_15x15cm_box,
            locucao_2_min: config.kits.locucao_2_min,
            trilha_sonora: config.kits.trilha_sonora,
            kit_resultado: config.kits.kit_resultado,
            pencard: config.kits.pencard,
        }
    }
    
    valor = (nivel, tipo) => {
        return tipo !== "ensaio_pre_evento" ? this.horaBase(nivel) * this.pacotes[tipo].grau / this.constants.grau_casamento : this.constants.minmax[nivel].min / this.pacotes[tipo].tempo
    }
    
    valorFixo = (tipo) => {
        return Math.ceil(this.kits[tipo] * this.constants.multiplicador/5)*5
    }
    
    valorFreela = (nivel, tipo, duracao) => {
        let total = (nivel !== "avancado" ? this.constants.niveis[nivel] / this.constants.grau_avancado * this.constants.base_avancado : this.constants.base_avancado) * duracao
        // let ensaio = this.constants.minmax[nivel].min / this.pacotes[tipo].tempo
        // let total = tipo === "ensaio_pre_evento" ? ensaio : normal 

        if(total < this.constants.minmax[nivel].min){
            return this.constants.minmax[nivel].min
        }else if(total > this.constants.minmax[nivel].max){
            return this.constants.minmax[nivel].max
        }else{
            return total
        }
    }
        
    horaBase = (nivel) => {
        return nivel !== "avancado" ? this.constants.niveis[nivel] / this.constants.grau_avancado * this.constants.base_avancado : this.constants.base_avancado
    }
    
    valorServico = (nivel, tipo, duracao) => {
        let base = nivel !== "avancado" ? this.constants.niveis[nivel] / this.constants.grau_avancado * this.constants.base_avancado : this.constants.base_avancado
        let refServicos = base * this.pacotes[tipo].grau / this.pacotes.casamento.grau
        let serv = tipo === "ensaio_pre_evento" ? this.constants.minmax[nivel].min / this.pacotes[tipo].tempo : refServicos
        let ref = this.pacotes[tipo].tempo * serv

        if(tipo === "tratamento_fotos" || tipo === "video_edicao"){
            return ref / this.constants.base_tratamento * duracao
        }else{
            return ref
        }
    }

    valorOutros = (tipo) => {
        return this.kits[tipo]
    }
}    



// export const pacotes = (config) => {
//     var {
//         config: {
//             base_avancado, 
//             taxa_zz,
//             mar_desconto, 
//             nf, 
//             base_tratamento, 
//             minmax_iniciante, 
//             minmax_basico,
//             minmax_intermediario, 
//             minmax_avancado, 
//             grau_iniciante, 
//             grau_basico, 
//             grau_intermediario,
//             grau_avancado, 
//         },
//         sets: {
//             civil, 
//             batizado, 
//             ensaio,
//             casamento, 
//             corporativo, 
//             debutante, 
//             aniversario, 
//             making_of,
//             making_of_noivo, 
//             video_edicao, 
//             tratamento_fotos, 
//             diagramação_album, 
//             ensaio_pre_evento,
//         },
//         kits: {
//             retrospectiva, 
//             wedding_story, 
//             quadro_60x80cm,
//             premium_30x30cm_box, 
//             master_30x30cm_box, 
//             premium_24x30cm_box, 
//             master_24x30cm_box, 
//             master_20x30cm_box,
//             sogra_premium_15x15cm_box, 
//             sogra_master_15x15cm_box, 
//             locucao_2_min, 
//             trilha_sonora, 
//             kit_resultado,
//             pencard, 
//         }
//     } = config

//     var constants = {
//         grau_avancado,
//         base_avancado,
//         grau_casamento: casamento.split('/')[1],
//         taxa_zz,
//         mar_desconto,
//         nf,
//         base_tratamento,
//         multiplicador: 1/(1-taxa_zz/100)/(1-mar_desconto/100)/(1-nf/100),
//         minmax: {
//             iniciante: {
//                 min: minmax_iniciante.split('/')[0],
//                 max: minmax_iniciante.split('/')[1],
//             },
//             basico: {
//                 min: minmax_basico.split('/')[0],
//                 max: minmax_basico.split('/')[1],
//             },
//             intermediario: {
//                 min: minmax_intermediario.split('/')[0],
//                 max: minmax_intermediario.split('/')[1],
//             }, 
//             avancado: {
//                 min: minmax_avancado.split('/')[0],
//                 max: minmax_avancado.split('/')[1],
//             }
//         },
//         niveis: {
//             iniciante: grau_iniciante,
//             basico: grau_basico,
//             intermediario: grau_intermediario, 
//             avancado: grau_avancado
//         }
//     }
    
//     var pacotes = {
//         civil:{
//             tempo: civil.split('/')[0],
//             grau: civil.split('/')[1]
//         },
//         batizado: {
//             tempo: batizado.split('/')[0],
//             grau: 2
//         },
//         ensaio:{
//             tempo: ensaio.split('/')[0],
//             grau: ensaio.split('/')[1]
//         },
//         casamento:{
//             tempo: casamento.split('/')[0],
//             grau: casamento.split('/')[1]
//         },
//         corporativo:{
//             tempo: corporativo.split('/')[0],
//             grau: corporativo.split('/')[1]
//         },
//         debutante:{
//             tempo: debutante.split('/')[0],
//             grau: debutante.split('/')[1]
//         },
//         aniversario:{
//             tempo: aniversario.split('/')[0],
//             grau: aniversario.split('/')[1]
//         },
//         making_of:{
//             tempo: making_of.split('/')[0],
//             grau: making_of.split('/')[1]
//         },
//         making_of_noivo:{
//             tempo: making_of_noivo.split('/')[0],
//             grau: making_of_noivo.split('/')[1]
//         },
//         video_edicao:{
//             tempo: video_edicao.split('/')[0],
//             grau: video_edicao.split('/')[1]
//         },
//         tratamento_fotos:{
//             tempo: tratamento_fotos.split('/')[0],
//             grau: tratamento_fotos.split('/')[1]
//         },
//         diagramação_album:{
//             tempo: diagramação_album.split('/')[0],
//             grau: diagramação_album.split('/')[1]
//         },
//         ensaio_pre_evento:{
//             tempo: ensaio_pre_evento.split('/')[0],
//             grau: ensaio_pre_evento.split('/')[1]
//         },
//     }
    
//     var kits = {
//         retrospectiva,
//         wedding_story,
//         quadro_60x80cm,
//         premium_30x30cm_box,
//         master_30x30cm_box,
//         premium_24x30cm_box,
//         master_24x30cm_box,
//         master_20x30cm_box,
//         sogra_premium_15x15cm_box,
//         sogra_master_15x15cm_box,
//         locucao_2_min,
//         trilha_sonora,
//         kit_resultado,
//         pencard,
//     }
    
//     const valor = (nivel, tipo, grau) => tipo !== "ensaio_pre_evento" ? horaBase(nivel) * pacotes[tipo].grau / constants.grau_casamento : constants.minmax[nivel].min / pacotes[tipo].tempo
    
//     const valorFixo = (tipo) => Math.ceil(kits[tipo] * constants.multiplicador/5)*5
    
//     const valorFreela = (nivel, tipo, duracao) => {
//         let total = Math.ceil(duracao * pacotes[tipo].grau / pacotes[tipo].tempo/5)*5
    
//         if(total < constants.minmax[nivel].min){
//             return Math.ceil((valorFreela(duracao, nivel, tipo) * constants.multiplicador)/5)*5
//         }else if(total > constants.minmax[nivel].max){
//             return constants.minmax[nivel].max
//         }else{
//             return total
//         }
//     }
    
//     //const valorFreelaMulti = (nivel, tipo, duracao, grau) => Math.ceil((valorFreela(duracao, nivel, tipo, grau) * constants.multiplicador)/5)*5
    
//     const horaBase = (nivel) => nivel !== "avancado" ? constants.niveis[nivel] / constants.grau_avancado * constants.base_avancado : constants.base_avancado
    
//     const valorServico = (nivel, tipo, duracao) => {
//         let ref = pacotes[tipo].tempo * valor(nivel, tipo)
//         if(tipo === "tratamento_fotos" || tipo === "video_edicao"){
//             return (Math.ceil((ref / constants.base_tratamento * duracao)/5)*5) * constants.multiplicador
//         }else{
//             return Math.ceil((Math.ceil(ref/5)*5) * constants.multiplicador/5)*5
//         }
//     }
    
//     return {
//         valor,
//         valorFixo,
//         valorFreela,
//         horaBase,
//         valorServico,
//         config, 
//         constants,
//         pacotes
//     }
// }    