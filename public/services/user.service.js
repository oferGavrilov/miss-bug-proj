import { utilService } from './util.service.js'

const BASE_URL = 'api/user/'

export const userService = {
    get,
    login,
    signup,
    logout,
    getLoggingUser,
    getEmptyCredentials,
}


function get(userId) {
    return axios.get(BASE_URL + userId).then(res => res.data)
}

function login(credentials) {
    return axios.post(BASE_URL + 'login', credentials)
        .then(res => res.data)
        .then((user) => {
            _saveLoggedUser(user)
            return user
        })
}

function signup(credentials) {
    return axios.post(BASE_URL + 'signup', credentials)
        .then(res => res.data)
        .then(user => {
            _saveLoggedUser(user)
            return user
        })
}

function logout(){
    return axios.post(BASE_URL + 'logout')
        .then(() => sessionStorage.removeItem('loggedUser'))
}

function getLoggingUser() {
    return JSON.parse(sessionStorage.getItem('loggedUser') || null)
}

function getEmptyCredentials(fullname = '', username = '', password = '') {
    return { fullname, username, password }
}

function _saveLoggedUser(user) {
    sessionStorage.setItem('loggedUser', JSON.stringify(user))
}