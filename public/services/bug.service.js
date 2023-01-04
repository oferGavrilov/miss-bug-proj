import {userService} from './user.service.js'

const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    get,
    save,
    remove,
    getDefaultFilter,
    createEmptyBug,
    getPDF,
    getDefaultSort
}

function query(filterBy = getDefaultFilter(), sortBy = getDefaultSort()) {
    const queryParams = `?title=${filterBy.title}&severity=${filterBy.severity}&pageIdx=${filterBy.pageIdx}&labels=${filterBy.labels}&pageSize=${filterBy.pageSize}&createdAt=${sortBy.createdAt}`
    return axios.get(BASE_URL + queryParams)
        .then(res => res.data)
        .catch(err => console.error(err))
}

function get(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}

function save(bug) {
    const url = (bug._id) ? BASE_URL + `${bug._id}` : BASE_URL
    const method = (bug._id) ? 'put' : 'post'
    return axios[method](url, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '', severity: '', pageIdx: 0 ,pageSize:8, labels: '' }
}
function getDefaultSort() {
    return { createdAt: '' }
}
function createEmptyBug() {
    return {
        title: '',
        severity: 0,
        description: '',
        date: Date.now() // check
    }
}
function getPDF() {
    return axios.get(BASE_URL + 'save_pdf')
}