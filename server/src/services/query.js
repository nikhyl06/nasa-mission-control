DEFAULT_PAGE_LIMIT = 1
DEFAULT_PAGE_NUMBER = 50
function getPaginatedData(query) {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_NUMBER;
    const page = Math.abs(query.page) || DEFAULT_PAGE_LIMIT;

    return {skip: limit * (page - 1) , limit: limit};
}

module.exports = {
    getPaginatedData
}