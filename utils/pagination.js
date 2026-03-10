/**
 * @param {number} page
 * @param {number} size
 */

const getPagination = (page,size) => {
    const limit = size ? +size : 5;
    const offset = page ? (page-1) * limit : 0
    return { limit, offset }
}

/**
 * @param {number} data
 * @param {number} page
 * @param {number} limit
 */

const getPaginData = (data,page,limit) => {
    const {count :totalItems, rows: items} = data
    const currentPage = page ? +page : 1
    const totalPages = Math.ceil(totalItems / limit)

    return {totalItems, items, totalPages, currentPage}
}

module.exports = {getPaginData, getPagination}