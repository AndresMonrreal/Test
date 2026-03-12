//Mas que nada para evitar errores y para ayudar al editor para y como manual 
/**
 * @param {number} page // Esto es para saber en que pagina estamos
 * @param {number} size// Esto es para saber cuantos items queremos por pagina
 */

const getPagination = (page,size) => {
    const limit = size ? +size : 5;// Esto es para saber cuantos items queremos por pagina, si no se especifica se asigna 5
    const offset = page ? (page-1) * limit : 0 // Esto es para saber desde que item queremos empezar a mostrar, si no se especifica se asigna 0
    return { limit, offset } // Esto es para retornar el limit y el offset
}

/**
 * @param {Object} data // Esto es para saber el total de items y los items que se van a mostrar
 * @param {number} page // Esto es para saber en que pagina estamos
 * @param {number} limit // Esto es para saber cuantos items queremos por pagina
 */

const getPaginData = (data,page,limit) => {
    const {count :totalItems, rows: items} = data // Esto es para obtener el total de items y los items que se van a mostrar
    const currentPage = page ? +page : 1 // Esto es para saber en que pagina estamos, si no se especifica se asigna 1
    const totalPages = Math.ceil(totalItems / limit) // Esto es para saber el total de paginas, se divide el total de items entre el limit y se redondea hacia arriba

    return {totalItems, items, totalPages, currentPage} // Esto es para retornar el total de items, los items que se van a mostrar, el total de paginas y la pagina actual
}

module.exports = {getPaginData, getPagination}