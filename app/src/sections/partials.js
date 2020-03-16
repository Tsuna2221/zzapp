export function parsedDate(timestamp){
    const dateConvert = new Date(timestamp*1000).toString()
    const hoursString = dateConvert.substr(16, 5)
    const dayString = dateConvert.substr(8, 2)
    const monthString = dateConvert.substr(4, 3)
    const yearString = dateConvert.substr(11, 4)

    var monthConvert = (str) => {
        switch (str) {
            case "Jan": return "/01/"
            case "Feb": return "/02/"
            case "Mar": return "/03/"
            case "Apr": return "/04/"
            case "May": return "/05/"
            case "Jun": return "/06/"
            case "Jul": return "/07/"
            case "Aug": return "/08/"
            case "Sep": return "/09/"
            case "Oct": return "/10/"
            case "Nov": return "/11/"
            case "Dec": return "/12/"
        }
    }

    return {
        fullDate: dayString + monthConvert(monthString) + yearString,
        hoursString
    }
}

export function calcularOrcamento (obj, qty){
    const { base, grau, taxa } = obj
    const calc = (base * qty) - Math.trunc((qty / grau))
    const add = qty % grau === 0 ? taxa : 0
    return Math.round((calc + add)/5)*5 - add
}


export const sectionValues = {
    type: [
        { label: 'Civil', value: "civil" },
        { label: 'Batizado', value: "batizado" },
        { label: 'Ensaio', value: "ensaio" },
        { label: 'Casamento', value: "casamento" },
        { label: 'Corporativo', value: "corporativo" },
        { label: 'Debutante', value: "debutante" },
        { label: 'Aniversário', value: "aniversario" },
    ],
    level: [
        { label: 'Iniciante', value: "iniciante" },
        { label: 'Básico', value: "basico" },
        { label: 'Intermediário', value: "intermediario" },
        { label: 'Avançado', value: "avancado" },
    ],
    result: [
        {label: "Kit Resultado", value: 'kit_resultado'},
        {label: "Pencard", value: 'pencard'},
        {label: "Apenas Online", value: 'online'},
    ],
    duration: [
        { label: '1 hora', value: 1 },
        { label: '2 horas', value: 2 },
        { label: '3 horas', value: 3 },
        { label: '4 horas', value: 4 },
        { label: '5 horas', value: 5 },
        { label: '6 horas', value: 6 },
        { label: '7 horas', value: 7 },
        { label: '8 horas', value: 8 },
        { label: '9 horas', value: 9 },
        { label: '10 horas', value: 10 },
        { label: '11 horas', value: 11 },
        { label: '12 horas', value: 12 },
    ]
}