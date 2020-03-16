export const getQueryString = window.location.search === '' ? {} : JSON.parse('{"'+ window.location.search.substring(1).replace(/&/g, '","').replace(/=/g, '":"') +'"}')

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
            default: break;
        }
    }

    return {
        fullDate: dayString + monthConvert(monthString) + yearString,
        hoursString
    }
}

export const statString = (event) => {
    const { created_at, images, related: { pros, clients } } = event

    if(event){
        const bytesToSize = (bytes) =>  {
            var k = (bytes / 1024).toString().split('.')[0]
            var m = (bytes / 1048576)
            var g = (bytes / 1073741824)
            if(bytes < 1024) return bytes + "bytes";
            else if(bytes < 1048576) return k + "kb";
            else if(bytes < 1073741824) return m.toFixed(2).toString().split('.')[0] + "mb";
            else return g.toFixed(2) + "gb";
        };
        const sizes = images.reduce((total, {size}) => total + size, 0)
        const i = images.filter(({type}) => type.includes('image')).length
        const v = images.filter(({type}) => type.includes('video')).length
        const imgs = i > 0 ? `${i} image${i > 1 ? "ns" : "m"},` : ""
        const videos = v > 0 ? ` ${v} vídeo${v > 1 ? "s" : ""},` : ""
        const p = pros.length > 0 ? ` ${pros.length} profissiona${pros.length > 1 ? "is" : "l"},` : ""
        const c = clients.length > 0 ? ` ${clients.length} client${clients.length > 1 ? "es" : "e"},` : ""
        const size = sizes !== 0 ? ` ${bytesToSize(sizes)} em mídias,` : ""
        const { fullDate, hoursString } = parsedDate(created_at)
    
        return `${imgs}${videos}${p}${c}${size} ${imgs===""&&videos===""&&pros.length===0&&clients.length===0&&size==="" ? "P" : "p"}ublicado em ${fullDate} às ${hoursString}`
    
    }
}