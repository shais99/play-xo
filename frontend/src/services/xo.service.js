import httpService from './httpService'
const BASE_URL = 'xo'

export default {
    query,
    get,
    remove,
    save
}

async function query() {
    return await httpService.get(BASE_URL);
}

async function get(id) {
    return await httpService.get(`${BASE_URL}/${id}`)
}

async function remove(id) {
    return await httpService.delete(`${BASE_URL}/${id}`)
}

async function save(book) {
    var prm;
    if (book._id) {
        prm = await httpService.put(`${BASE_URL}/${book._id}`, book)
    } else {
        prm = await httpService.post(`${BASE_URL}`, book)
    }
    return prm
}